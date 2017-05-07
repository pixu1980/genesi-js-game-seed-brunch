import Game from './scripts/Classes/Game';
import config from '../configs';
import locales from '../locales';

document.addEventListener('DOMContentLoaded', () => {
  debugger;
  window.onload = new Game(config, locales);
});
