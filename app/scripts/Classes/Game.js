import {Draw, Elements, Engine} from 'genesi-js';

const $ = window.$;

/**
 * Main class representing game
 * @class Game
 * @public
 */
export default class Game extends Engine.Game {
  /**
   * Init the world, create main loader promise.
   * @memberOf Game
   * @method constructor
   * @instance
   * @return {Promise.<TResult>}
   */
  constructor(config, locales) {
    Game.STATUS = 'initializing';
    Game.CONFIG = config;
    Game.LOCALES = locales;

    return new Promise((resolve) => {
      this.init(resolve);
    }).then(() => {
      Game.STATUS = 'initialized';
      console.log('Game initialized');
      return new Preload();
    }).then(() => {
      console.log('Game preloaded');

      if (!Game.CONFIG.environment.editor) {
        const ticket = new TicketViewModel(Game.CONFIG.tickets[1]).toJS(true);

        Game.dispatchEvent({type: 'startGame'}.inherit(ticket));
      } else {
        Game.EDITOR.onStartGameClick();
      }

      console.log('Game ready');
      Game.STATUS = 'ready';
    });
  }

  /**
   * initializes shared data of the game world
   * @memberOf Game
   * @method initShared
   * @instance
   */
  initShared() {
    const qs = window.location.href.extractQueryString();

    Game.SHARED.inherit({
      gameId: qs.gameId || 0,
      mode: qs.e || 'l', // l, sw, bw, b, r
      scale: Math.min(window.innerWidth / Game.CONFIG.environment.canvas.width, window.innerHeight / Game.CONFIG.environment.canvas.height),
      canvas: {
        w: Game.CONFIG.environment.canvas.width,
        h: Game.CONFIG.environment.canvas.height,
      },
      showAll: {
        started: false,
        tileButtonIndex: 0,
      },
    });

    Game.SHARED.inherit({
      canvas: {
        scaledW: Game.SHARED.canvas.w * Game.SHARED.scale,
        scaledH: Game.SHARED.canvas.h * Game.SHARED.scale,
      },
    });
  }

  /**
   * initializes debug mode of the game world depending of config parameter
   * @memberOf Game
   * @method initEditor
   * @instance
   */
  initEditor() {
    if (!!Game.CONFIG.environment.editor) {
      Game.EDITOR = new Editor({
        tiles: Game.CONFIG.tickets[1].tiles,
        steps: Game.CONFIG.tickets[1].steps,
      });
    } else {
      const $canvasCol = $('.canvas-col');
      const $editorTableCol = $('.editor-table-col');

      $canvasCol.removeClass('col-xs-6').addClass('col-xs-12');
      $editorTableCol.remove();
    }
  }

  /**
   * Initialized entire game world & global objects
   * @memberOf Game
   * @method init
   * @param resolve
   * @instance
   */
  init(resolve) {
    this.initShared();
    this.initEditor();

    this.$canvas = $(Game.CONFIG.environment.canvas.selector);
    Game.CANVAS = this.canvas = this.$canvas[0];

    this.stage = new EaselJS.Stage(this.canvas);
    this.stage.enableMouseOver();

    Game.STAGE = this.stageContainer = new Elements.Element({
      parent: this.stage,
      position: {
        x: Game.SHARED.canvas.w * 0.5,
        y: Game.SHARED.canvas.h * 0.5,
      },
      size: {
        width: Game.SHARED.canvas.w,
        height: Game.SHARED.canvas.h,
      },
      fill: 'transparent',
    });

    this.gameElement = null;

    EaselJS.Ticker.framerate = Game.CONFIG.environment.ticker.fps;
    EaselJS.Ticker.timingMode = Game.CONFIG.environment.ticker.timingMode;
    EaselJS.Ticker.on('tick', this.ticker.bind(this));

    this.onResize();

    this.bindEvents();

    resolve();
  }

  /**
   * Ticker function - updating stage with each tick.
   * @memberOf Game
   * @method ticker
   * @instance
   */
  ticker() {
    this.stage.update();
  }

  /**
   * onResize handler updates canvas and stage depending on window dimensions.
   * @memberOf Game
   * @method onResize
   * @instance
   */
  onResize() {
    if (!this.canvas) {
      return;
    }

    Game.SHARED.inherit({
      scale: Math.min(window.innerWidth / Game.CONFIG.environment.canvas.width, window.innerHeight / Game.CONFIG.environment.canvas.height),
      canvas: {
        w: Game.CONFIG.environment.canvas.width,
        h: Game.CONFIG.environment.canvas.height,
      },
      cell: {
        w: (Game.CONFIG.environment.canvas.width * 0.95) / Game.CONFIG.game.grid.cols,
        h: (Game.CONFIG.environment.canvas.width * 0.95) / Game.CONFIG.game.grid.cols, // ar square 1:1
      },
    });

    Game.SHARED.inherit({
      canvas: {
        scaledW: Game.SHARED.canvas.w * Game.SHARED.scale,
        scaledH: Game.SHARED.canvas.h * Game.SHARED.scale,
      },
    });

    Elements.ElementHelpers.setBoxSize(this.canvas, Game.SHARED.canvas.scaledW, Game.SHARED.canvas.scaledH, true);

    if (!this.stage) {
      return;
    }

    Elements.ElementHelpers.scale(this.stage, Game.SHARED.scale);

    this.stage.update();
  }

  /**
   * startGame event handler
   * @memberOf Game
   * @method onStartGame
   * @instance
   */
  onStartGame(options) {
    Game.STATUS = 'started';

    if (!!this.gameElement) {
      Game.STAGE.removeChild(this.gameElement);
      this.gameElement = null;
    }

    Game.CONFIG.inherit({
      game: {
        grid: {
          rows: options.rows,
          cols: options.cols,
        },
        prizes: Game.CONFIG.game.prizes.inherit(options.prizes),
      },
    });

    Game.SHARED.inherit({
      cell: {
        w: (Game.CONFIG.environment.canvas.width * 0.95) / Game.CONFIG.game.grid.cols,
        h: (Game.CONFIG.environment.canvas.width * 0.95) / Game.CONFIG.game.grid.cols, // ar square 1:1
      },
    });

    Game.WORLD = this.gameElement = new GameElement({
      parent: Game.STAGE,
      align: 'center top',
      size: '100%',
      colors: Game.CONFIG.game.colors,
      prizes: Game.CONFIG.game.prizes,
      tiles: options.tiles,
      steps: options.steps,
    });
  }

  /**
   * endGame event handler
   * @memberOf Game
   * @method onEndGame
   * @param options
   * @instance
   */
  onEndGame(options) {
    Game.STATUS = 'ended';
    let mode = 'lose';

    if (options.prize > 0) {
      mode = (options.prize >= 500 ? 'big-win' : 'small-win');
    } else if (options.prize === 'R') {
      mode = 'replay';
    }

    Game.MODALS.open('gameEnd', {
      mode,
      prize: options.prize,
    });
  }

  checkStatus(options) {
    if (Game.WORLD.isEnded()) {
      Game.dispatchEvent({
        type: 'endGame',
        prize: Game.CONTROLS.getPrize(),
      });
    }
  }

  updateStatus(options) {
    Game.CONTROLS.status = 'animated';
    Game.WORLD.updateStatus(options);
  }

  updatePrize(options) {
    Game.WORLD.updatePrize(options.prize);
  }

  /**
   * Game world events binder
   * @memberOf Game
   * @method bindEvents
   * @instance
   */
  bindEvents() {
    window.onresize = this.onResize.proxy(this);

    EaselJS.EventDispatcher.initialize(this);

    this.addEventListener('startGame', this.onStartGame.proxy(this));
    this.addEventListener('endGame', this.onEndGame.proxy(this));

    this.addEventListener('checkStatus', this.checkStatus.proxy(this));
    this.addEventListener('updateStatus', this.updateStatus.proxy(this));
    this.addEventListener('updatePrize', this.updatePrize.proxy(this));

    Game.inherit(this);
  }
}

/**
 * CANVAS Object represents canvas
 * @type {HTMLElement}
 */
Game.CANVAS = null;

/**
 * STAGE Object represents stage container
 * @type {Stage}
 */
Game.STAGE = null;

/**
 * WORLD Object represents the game world
 * @type {HTMLElement}
 */
Game.WORLD = null;

/**
 * IMAGES Object for preloaded images
 * @type {Hash}
 */
Game.IMAGES = {};

/**
 * SPRITESHEETS Object for preloaded spritesheets
 * @type {Hash}
 */
Game.SPRITESHEETS = {};

/**
 * SHARED Object represents shared data
 * @type {Hash}
 */
Game.SHARED = {}; //

/**
 * STATUS String represents actual game status
 * @type {String}
 */
Game.STATUS = 'unknown';

/**
 * CONTROLS Object represents game controls object
 * @type {Object}
 */
Game.CONTROLS = null;

/**
 * CONFIG Object represents game config
 * @type {Object}
 */
Game.CONFIG = null;

/**
 * LANGS Object represents game config
 * @type {Object}
 */
Game.LANGS = null;

/**
 * MODALS Object represents modals controller
 * @type {ModalController}
 */
Game.MODALS = ModalController;
