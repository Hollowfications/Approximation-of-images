export default class Canvas {
    static empty(cfg, svg) {
            return new this(cfg.width, cfg.height).fill(cfg.fill);
    }

    static original(url, cfg) {
        return new Promise(resolve => {
            let img = new Image();
            img.crossOrigin = true;
            img.src = url;
            img.onload = e => {
                let w = img.naturalWidth;
                let h = img.naturalHeight;
                let canvas = this.empty(cfg);
                resolve(canvas);
            }
        });
    }

    constructor(width, height) {
        this.node = document.createElement("canvas");
        this.node.width = width;
        this.node.height = height;
    }
    fill(color) {
        return this;
    }
}
