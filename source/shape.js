/**
 * @file Файл, содержащий различные абстрактные классы фигур, из которых строится новое изображение
 */
import Canvas from "./canvas.js";
import * as Utility from "./utility.js";

/**
 *  @class Shape - абстрактный класс фигуры
 */
export class Shape {
    /**
     * Возвращает случайную точку
     * @memberOf Shape
     * @method randomPoint
     * @param width - ширина
     * @param height - высота
     * @returns {number[]} - число вершин
     */
    static randomPoint(width, height) {
        return [~~(Math.random()*width), ~~(Math.random()*height)];
    }

    /**
     * Создаёт пару переменных - ширину и высоту для текущей фигуры, чтобы в дальнейшем уже с выбранным конструктором создать таковую.
     * @memberOf Shape
     * @method create
     * @param cfg - конфигурация
     * @returns {*}
     */
    static create(cfg) {
        let ctors = cfg.shapeTypes;
        let index = Math.floor(Math.random() * ctors.length);
        let ctor = ctors[index];
        return new ctor(cfg.width, cfg.height);
    }

    /**
     *
     * @param w - ширина
     * @param h - высота
     */
    constructor(w, h) {
        this.bbox = {};
    }

    /**
     * Изменение свойств фигуры, в попытке сделать её более подходящей
     * @memberOf Shape
     * @method mutate
     * @param cfg
     * @returns {Shape}
     */
    mutate(cfg) { return this; }

    /**
     * Отображение фигуры на холсте
     * @memberOf Shape
     * @method rasterize
     * @param alpha
     * @returns {Canvas}
     */
    rasterize(alpha) {
        let canvas = new Canvas(this.bbox.width, this.bbox.height);
        let ctx = canvas.ctx;
        ctx.fillStyle = "#000";
        ctx.globalAlpha = alpha;
        ctx.translate(-this.bbox.left, -this.bbox.top);
        this.render(ctx);
        return canvas;
    }

    render(ctx) {}
}

/**
 * @class Polygon - Класс полигона
 */
class Polygon extends Shape {
    /**
     *
     * @param w - ширина
     * @param h - высота
     * @param count - число вершин у полигона
     */
    constructor(w, h, count) {
        super(w, h);
        this.points = this._createPoints(w, h, count);
        this.computeBbox();
    }

    /**
     * Отрисовка линий полигона, затем их дальнейшая заливка с помощью fill()
     * @memberOf Polygon
     * @method render
     * @param ctx
     */
    render(ctx) {
        ctx.beginPath();
        this.points.forEach(([x, y], index) => {
            if (index) {
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Изменение свойств полигона, в попытке сделать его более подходящим
     * @memberOf Polygon
     * @method mutate
     * @param cfg - конфигурация
     * @returns {Polygon}
     */
    mutate(cfg) {
        let clone = new this.constructor(0, 0);
        clone.points = this.points.map(point => point.slice());

        let index = Math.floor(Math.random() * this.points.length);
        let point = clone.points[index];

        let angle = Math.random() * 2 * Math.PI;
        let radius = Math.random() * 20;
        point[0] += ~~(radius * Math.cos(angle));
        point[1] += ~~(radius * Math.sin(angle));

        return clone.computeBbox();
    }

    computeBbox() {
        let min = [
            this.points.reduce((v, p) => Math.min(v, p[0]), Infinity),
            this.points.reduce((v, p) => Math.min(v, p[1]), Infinity)
        ];
        let max = [
            this.points.reduce((v, p) => Math.max(v, p[0]), -Infinity),
            this.points.reduce((v, p) => Math.max(v, p[1]), -Infinity)
        ];

        this.bbox = {
            left: min[0],
            top: min[1],
            width: (max[0]-min[0]) || 1,
            height: (max[1]-min[1]) || 1
        };

        return this;
    }

    /**
     * Создание случайных точек для треугольника
     * @memberOf Polygon
     * @method createPoints
     * @param w - ширина
     * @param h - высота
     * @param count - количество точек
     * @returns {number[]} - массив точек
     */
    _createPoints(w, h, count) {
        let first = Shape.randomPoint(w, h);
        let points = [first];

        for (let i=1;i<count;i++) {
            let angle = Math.random() * 2 * Math.PI;
            let radius = Math.random() * 20;
            points.push([
                first[0] + ~~(radius * Math.cos(angle)),
                first[1] + ~~(radius * Math.sin(angle))
            ]);
        }
        return points;
    }

}

/**
 * @class Trianle - класс треугольника, использует методы из родителя Polygon
 */
export class Triangle extends Polygon {
    constructor(w, h) {
        super(w, h, 3);
    }
}

/**
 * @class Rectangle - класс прямоугольника, почти все методы из Polygon переписаны
 */
export class Rectangle extends Polygon {
    /**
     *
     * @param w - ширина
     * @param h - высота
     */
    constructor(w, h) {
        super(w, h, 4);
    }

    /**
     * Изменение прямоугольника в попытке сделать его лучше
     * @memberOf Rectangle
     * @method mutate
     * @param cfg
     * @returns {Polygon}
     */
    mutate(cfg) {
        let clone = new this.constructor(0, 0);
        clone.points = this.points.map(point => point.slice());

        let amount = ~~((Math.random()-0.5) * 20);

        switch (Math.floor(Math.random()*4)) {
            case 0: /* left */
                clone.points[0][0] += amount;
                clone.points[3][0] += amount;
                break;
            case 1: /* top */
                clone.points[0][1] += amount;
                clone.points[1][1] += amount;
                break;
            case 2: /* right */
                clone.points[1][0] += amount;
                clone.points[2][0] += amount;
                break;
            case 3: /* bottom */
                clone.points[2][1] += amount;
                clone.points[3][1] += amount;
                break;
        }

        return clone.computeBbox();
    }

    /**
     * Создание случайных точек на сетке пикселей.
     * @memberOf Rectangle
     * @method _createPoints

     * @param w - ширина
     * @param h - высота
     * @param count - число точек
     * @returns {number[][]}
     */
    _createPoints(w, h, count) {
        let p1 = Shape.randomPoint(w, h);
        let p2 = Shape.randomPoint(w, h);

        let left = Math.min(p1[0], p2[0]);
        let right = Math.max(p1[0], p2[0]);
        let top = Math.min(p1[1], p2[1]);
        let bottom = Math.max(p1[1], p2[1]);

        return [
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom]
        ];
    }
}

/**
 * @class Ellipse() - класс эллипса
 */
export class Ellipse extends Shape {
    /**
     *
     * @param w - ширина
     * @param h - высота
     */
    constructor(w, h) {
        super(w, h);

        this.center = Shape.randomPoint(w, h);
        this.rx = 1 + ~~(Math.random() * 20);
        this.ry = 1 + ~~(Math.random() * 20);

        this.computeBbox();
    }

    /**
     *  @memberOf Ellipse
     * @private
     */
    render(ctx) {
        ctx.beginPath();
        ctx.ellipse(this.center[0], this.center[1], this.rx, this.ry, 0, 0, 2*Math.PI, false);
        ctx.fill();
    }

    /**
     * Изменение эллипса в попытке сделать его лучше
     * @memberOf Ellipse
     * @method mutate
     * @param cfg
     * @returns {Ellipse}
     */
    mutate(cfg) {
        let clone = new this.constructor(0, 0);
        clone.center = this.center.slice();
        clone.rx = this.rx;
        clone.ry = this.ry;

        switch (Math.floor(Math.random()*3)) {
            case 0:
                let angle = Math.random() * 2 * Math.PI;
                let radius = Math.random() * 20;
                clone.center[0] += ~~(radius * Math.cos(angle));
                clone.center[1] += ~~(radius * Math.sin(angle));
                break;

            case 1:
                clone.rx += (Math.random()-0.5) * 20;
                clone.rx = Math.max(1, ~~clone.rx);
                break;

            case 2:
                clone.ry += (Math.random()-0.5) * 20;
                clone.ry = Math.max(1, ~~clone.ry);
                break;
        }

        return clone.computeBbox();
    }
    computeBbox() {
        this.bbox = {
            left: this.center[0] - this.rx,
            top: this.center[1] - this.ry,
            width: 2*this.rx,
            height: 2*this.ry
        }
        return this;
    }
}