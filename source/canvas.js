import * as Utility from "./utility.js";

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
                cfg.width = w;
                cfg.height = h;
                cfg.scale = 1;
                let canvas = this.empty(cfg);
//                canvas.ctx = canvas.getContext("2d");
                canvas.ctx.drawImage(img, 0,0, cfg.width, cfg.height);
                resolve(canvas);
            }
        });
    }

    constructor(width, height) {
        this.node = document.createElement("canvas");
        this.node.width = width;
        this.node.height = height;
        this.ctx = this.node.getContext("2d");
    }
    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.node.width, this.node.height);
        return this;
    }
}
