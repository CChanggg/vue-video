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
  
  init () {
    if (!this.el) throw new Error('video ele is not defined');
    const self = this;
    if (this.options.src) {
      this.el.setAttribute('src', this.options.src);
      this.el.load();
    }
    attrMaps.forEach(attr => {
      if (this.options[attr]) {
        this.el.setAttribute(attr, this.options[attr]);
      }
    });
    // ios fullscreen
    if (this.options.playsinline) {
      this.el.setAttribute('playsinline', this.options.playsinline);
      this.el.setAttribute('webkit-playsinline', this.options.playsinline);
      this.el.setAttribute('x5-playsinline', this.options.playsinline);
      this.el.setAttribute('x5-video-player-type', 'h5');
      this.el.setAttribute('x5-video-player-fullscreen', false);
      enableInlineVideo(this.el);
    } else {
      this.el.setAttribute('x5-video-player-fullscreen', true);
    }
    // autoplay
    if (this.options.autoplay) {
      if (this.env.isWX) {
        document.addEventListener('WeixinJSBridgeReady', () => {
          this.play();
          if (!this.startVideoFlag) {
            this.el.pause();
          }
        });
        this.play();
        if (!this.startVideoFlag) {
          this.el.pause();
        }
      }

      setTimeout(() => {
        if (!this.startVideoFlag) {
          if (this.options.videoPlayTimeout) {
            this.options.videoPlayTimeout();
          }
          if (window.owl) {
            window.owl('sendManualMetric', 'video-timeout');
          }
        }
      }, this.options.autoPlayTimeout);
    }
    // cross origin
    if (this.options.crossOrigin !== '') {
      this.el.crossOrigincd = this.options.crossOrigin;
      this.el.setAttribute('crossOrigin', this.options.crossOrigin);
    }
    const canPlayFn = self.canPlayFn = e => {
      if (self.options.progress) {
        self.options.progress(self.options.totalProgress);
      }
      if (!self.canplayFlag) {
        self.canplayFlag = true;
      }
      self.el.removeEventListener('canplay', canPlayFn);
      if (self.timer) {
        clearInterval(self.timer);
      }
    };
    this.el.addEventListener('canplay', canPlayFn);
    if (this.options.onFullscreenchange) {
      this.el.addEventListener('webkitfullscreenchange', event => {
        let fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
        this.options.onFullscreenchange(!!fullscreenElement);
      });
    }

    this.el.addEventListener('error', e => {
      if (e.target.error) {
        this.catchError(e.target.error);
      }
    });
    if (this.el.readyState > 3) {
      canPlayFn();
    }
    this.timer = setInterval(() => {
      if (this.canplayFlag) {
        this._progress = 100;
        this.startVideoFlag = true;
      } else {
        this._progress = parseInt(this.getProgress());
      }
      if (this.options.progress) {
        this.options.progress(this._progress);
      }
    }, 100);
  }

  getProgress () {
    let end = 0;
    try {
      if (this.env.isAndroid) {
        end = this.el.buffered.length ? this.el.buffered.end(0) : 0;
        end = this.el.duration ? parseInt(parseInt(end * 1000 + 1) / 10 / this.el.duration) : 0;
      } else {
        if (this._progress > (this.options.totalProgress * 0.8)) {
          this._progress += (this.options.totalProgress * 0.003);
        } else if (this._progress > (this.options.totalProgress * 0.5)) {
          this._progress += (this.options.totalProgress * 0.01);
        } else {
          this._progress += (this.options.totalProgress * 0.02);
        }
        end = this._progress;
      }
      if (this.el.currentTime) {
        end = this.options.totalProgress;
      }
    } catch (e) {
      console.log(e);
      end = this._progress;
    }
    if (end === this.options.totalProgress) {
      this.canPlayFn();
    }
    return end;
  }

  play () {
    try {
      const p = this.el.play();
      if (!this.options.playsinline) {
        this.requestFullscreen();
      }
      if (p) {
        p.catch(e => {
          console.log(e);
        });
      }
    } catch (e) {
      this.catchError(e);
    }
  }
  catchError (e) {
    if (this.options.catchError) {
      this.options.catchError(e);
    } else {
      console.log(e);
    }
  }
  pause () {
    try {
      this.el.pause();
    } catch (e) {
      this.catchError(e);
    }
  }

  requestFullscreen () {
    const element = this.el;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullScreen();
    } else if (element.webkitEnterFullScreen) {
      element.webkitEnterFullScreen();
    }
  }
}
export default VideoLoader;