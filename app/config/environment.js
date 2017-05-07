module.exports = {
  editor: false,
  debug: false,
  canvas: {
    selector: '.game-canvas',
    // size: {
    //   width: 1920,
    //   height: 1080,  
    // },
    size: '100%',
    ar: {
      width: 1920,
      height: 1080,
    },
  },
  ticker: {
    fps: 60,
    timingMode: 'RAF',
  },
  locale: 'it',
};
