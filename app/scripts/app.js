import Game from './Game';
import config from '../config';
import locales from '../locales';

document.addEventListener('DOMContentLoaded', () => {
  // debugger;
  window.onload = new Game(config.environment, config.manifests, locales);
});
