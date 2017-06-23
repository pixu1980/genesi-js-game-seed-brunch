import { Anim, Draw, Preload, Sound, Elements, Engine } from 'genesi-js';

/**
 * Main class representing game
 * @class Game
 * @public
 */
export default class Game extends Engine.Game {
  postInit(assets) {
    super.postInit(assets);

    this.addChild('background', Elements.SpriteElement, {
      spritesheet: assets.spritesheets.background,
      align: 'left middle',
      scale: 2.2,
    }).animate({
      animationName: 'anim',
    });


    this.addChild('tiger', Elements.SpriteElement, {
      spritesheet: assets.spritesheets.tiger,
      align: 'left bottom',
      scale: 1.5,
    }).setPosition({
      x: -this.ENVIRONMENT.get('canvas.ar.width') * 2,
    }).animate({
      animationName: 'anim',
    });

    this.addChild('giant', Elements.SpriteElement, {
      spritesheet: assets.spritesheets.giant,
      align: 'left bottom',
      scale: 1.5,
    }).setPosition({
      x: -this.ENVIRONMENT.get('canvas.ar.width') * 1.4,
    }).animate({
      animationName: 'anim',
    });

    this.addChild('girl', Elements.SpriteElement, {
      spritesheet: assets.spritesheets.girl,
      align: 'left bottom',
      scale: 1.5,
    }).setPosition({
      x: -this.ENVIRONMENT.get('canvas.ar.width') * 1.2,
    }).animate({
      animationName: 'anim',
    });

    this.addChild('kid', Elements.SpriteElement, {
      spritesheet: assets.spritesheets.kid,
      align: 'left bottom',
      scale: 1.5,
    }).setPosition({
      x: -this.ENVIRONMENT.get('canvas.ar.width'),
    }).animate({
      animationName: 'anim',
    });

    Anim.Tween.get(this.background).to({
      x: this.background.getComputedBounds().x - 100,
    }, 3500, Anim.Ease.linear);

    Anim.Tween.get(this.tiger).to({
      x: this.ENVIRONMENT.get('canvas.ar.width') + this.tiger.getComputedBounds().width,
    }, 5600, Anim.Ease.linear);

    Anim.Tween.get(this.giant).to({
      x: this.ENVIRONMENT.get('canvas.ar.width') + this.giant.getComputedBounds().width,
    }, 6000, Anim.Ease.linear);

    Anim.Tween.get(this.girl).to({
      x: this.ENVIRONMENT.get('canvas.ar.width') + this.girl.getComputedBounds().width,
    }, 6000, Anim.Ease.linear);

    Anim.Tween.get(this.kid).to({
      x: this.ENVIRONMENT.get('canvas.ar.width') + this.kid.getComputedBounds().width,
    }, 6000, Anim.Ease.linear);
  }
}
