import enableInlineVideo from 'iphone-inline-video';

const globalOptions = {
  crossOrigin: 'anonymous',
  preload: 'auto',
  playsinline: true,
  totalProgress: 100,
  autoPlay: false,
  autoPlayTimeout: 10000
};
const attrMaps = ['preload', 'loop', 'controls', 'muted', 'autoplay', 'poster', 'width', 'height'];
class VideoLoader {
  constructor (el, options = {}, env = {}) {
    this.el = el;
    this.options = Object.assign({}, globalOptions, options);
    this.env = env;
    this._progress = 0;
    this.startVideoFlag = false;
    this.canplayFlag = false;
    }
}