/**
 * @file Файл, отвечающий за отрисовку всех объектов на абстрактном холсте.
 */
import * as Utility from "./utility.js";

/**
 * Заливка фигуры/холста подходящим цветом из Utility.clampColor()
 * @param {Canvas} canvas
 * @returns {string}
 */
function getFill(canvas) {
    let data = canvas.getImageData();
    let w = data.width;
    let h = data.height;
    let d = data.data;
    let rgb = [0, 0, 0];
    let count = 0;
    let i;

    for (let x=0; x<w; x++) {
        for (let y=0; y<h; y++) {
            if (x > 0 && y > 0 && x < w-1 && y < h-1) { continue; }
            count++;
            i = 4*(x + y*w);
            rgb[0] += d[i];
            rgb[1] += d[i+1];
            rgb[2] += d[i+2];
        }
    }

    rgb = rgb.map(x => ~~(x/count)).map(Utility.clampColor);
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * @class Canvas - Класс, отвечающий за отрисовку изображений, абстрактный холст
 */
 export default class Canvas {
/**
* @param width - ширина холста
* @param height - высота холста
*/
    constructor(width, height) {
        this.node = document.createElement("canvas");
        this.node.width = width;
        this.node.height = height;
        this.ctx = this.node.getContext("2d");
        this._imageData = null;
    }
    /**
     * @memberOf Canvas
     * Создаёт пустой холст
     * @param cfg - текущие параметры
     * @returns {Canvas}
     */
    static empty(cfg) {
            return new this(cfg.width, cfg.height).fill(cfg.fill);
    }

    /**
     * @memberOf Canvas
     * Создаёт холст для исходного изображение
     * @param url - исходное изображение в виде URL ссылки
     * @param cfg - текущие параметры
     * @returns {Promise<unknown>}
     */
    static original(url, cfg) {

        return new Promise(resolve => {
            let img = new Image();
            img.crossOrigin = true;
            img.src = url;
            img.onload = e => {
                let w = img.naturalWidth;
                let h = img.naturalHeight;
                let computeScale = Utility.getScale(w, h, cfg.computeSize);
                cfg.width = w / computeScale;
                cfg.height = h / computeScale;
                cfg.scale = 1;
                let canvas = this.empty(cfg);
                canvas.ctx.drawImage(img, 0, 0, cfg.width, cfg.height);
                if (cfg.fill == "auto") { cfg.fill = getFill(canvas); }
                resolve(canvas);
            }
        });
    }




    /**
     * @memberOf Canvas
     * Создаёт копию холста
     * @returns {Canvas}
     */
    clone() {
        let otherCanvas = new this.constructor(this.node.width, this.node.height);
        otherCanvas.ctx.drawImage(this.node, 0, 0);
        return otherCanvas;
    }

    /**
     * @memberOf Canvas
     * Заполняет холст цветом. Цвет настраивается в пользовательском интерфейсе
     * @param color
     * @returns {Canvas}
     */
    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.node.width, this.node.height);
        return this;
    }

    /**
     * @memberOf Canvas
     * Возвращает изображение с холста
     * @returns {null}
     */
    getImageData() {
        if (!this._imageData) {
            this._imageData = this.ctx.getImageData(0, 0, this.node.width, this.node.height);
        }
        return this._imageData;
    }

    /**
     * @memberOf Canvas
     * Определяет различие в целом между двумя изображениями
     * @param {Canvas} otherCanvas
     * @returns {number}
     */
    difference(otherCanvas) {
        let data = this.getImageData();
        let dataOther = otherCanvas.getImageData();

        return Utility.difference(data, dataOther);
    }

    /**
     * @memberOf Canvas
     *Определяет разницу в расстоянии между пикселями одного изображение и другого
     * @param {Canvas} otherCanvas
     * @returns {*}
     */
    distance(otherCanvas) {
        let difference = this.difference(otherCanvas);
        return Utility.differenceToDistance(difference, this.node.width*this.node.height);
    }

    /**
     * @memberOf Canvas
     * Отрисовка следующего на очереди шага
     * @param {Step} step
     * @returns {Canvas}
     */
    drawStep(step) {
        this.ctx.globalAlpha = step.alpha;
        this.ctx.fillStyle = step.color;
        step.shape.render(this.ctx);
        return this;
    }
}


