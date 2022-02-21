export default class HmCanvas {
  constructor(ctx, canvasId, canvasNode) {
    this.ctx = ctx;
    this.canvasId = canvasId;
    this.chart = null;
    this.canvasNode = canvasNode;
    this._initStyle(ctx);
    this._initEvent();
    globalThis.process.env.NODE_ENV = 'production';
  }

  getContext(contextType) {
    if (contextType === '2d') {
      return this.ctx;
    }
  }

  setChart(chart) {
    this.chart = chart;
  }

  attachEvent() {
    // noop
  }

  detachEvent() {
    // noop
  }

  _initCanvas(zrender, ctx) {
    zrender.util.getContext = function () {
      return ctx;
    };

    zrender.util.$override('measureText', function (text, font) {
      ctx.font = font || '12px sans-serif';
      return ctx.measureText(text);
    });
  }

  _initStyle(ctx) {
    ctx.createRadialGradient = () => {
      return ctx.createCircularGradient(arguments);
    };
  }

  _initEvent() {
    this.event = {};
    const eventNames = [{
      wxName: 'touchstart',
      ecName: 'mousedown'
    }, {
      wxName: 'touchmove',
      ecName: 'mousemove'
    }, {
      wxName: 'touchend',
      ecName: 'mouseup'
    }, {
      wxName: 'touchend',
      ecName: 'click'
    }];

    eventNames.forEach(name => {
      this.event[name.wxName] = e => {
        const touch = e.touches[0];
        this.chart.getZr().handler.dispatch(name.ecName, {
          zrX: touch.localX,
          zrY: touch.localY
        });
      };
    });
  }

  set width(w) {
    if (this.canvasNode) this.canvasNode.width = w;
  }

  get width() {
    return this.canvasNode.getBoundingClientRect().width;
  }

  set height(h) {
    if (this.canvasNode) this.canvasNode.height = h;
  }

  get height() {
    return this.canvasNode.getBoundingClientRect().height;
  }
}
