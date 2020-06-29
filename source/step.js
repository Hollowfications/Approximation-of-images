import * as Utility from "./utility.js";
import State from "./state.js";

/**
 * @class Шаг
 * @param shape - Форма
 * @param cfg - текущая конфигурация
 * @param alpha - альфа-канал
 */
export default class Step {
    constructor(shape, cfg) {
        this.shape = shape;
        this.cfg = cfg;
        this.alpha = cfg.alpha;

        /* эти два атрибута вычисляются во время compute() */
        this.color = "#000";
        this.distance = Infinity;
    }
    /** Применять данный шаг (step) к текущему положению (state) чтобы получить новое положение. Применять только после compute()
     * @class Шаг
     * @param state
     * @returns {State}
     */
    apply(state) {
        let newCanvas = state.canvas.clone().drawStep(this);
        return new State(state.target, newCanvas, this.distance);
    }

    /**
     * @method Найти подходящий цвет и вычислить дистанцию
     * @param state - Текущее состояние
     * @param pixels
     * @returns {Promise<Step>}
     */
    compute(state) {
        let pixels = state.canvas.node.width * state.canvas.node.height;
        let offset = this.shape.bbox;

        let imageData = {
            shape: this.shape.rasterize(this.alpha).getImageData(),
            current: state.canvas.getImageData(),
            target: state.target.getImageData()
        };

        let {color, differenceChange} = Utility.computeColorAndDifferenceChange(offset, imageData, this.alpha);
        this.color = color;
        let currentDifference = Utility.distanceToDifference(state.distance, pixels);
        if (-differenceChange > currentDifference) debugger;
        this.distance = Utility.differenceToDistance(currentDifference + differenceChange, pixels);

        return Promise.resolve(this);
    }

    /**
     * возвращает слегка изменённое положение
     * @returns {Step}
     */
    mutate() {
        let newShape = this.shape.mutate(this.cfg);
        let mutated = new this.constructor(newShape, this.cfg);
        if (this.cfg.mutateAlpha) {
            let mutatedAlpha = this.alpha + (Math.random()-0.5) * 0.08;
            mutated.alpha = Utility.clamp(mutatedAlpha, .1, 1);
        }
        return mutated;
    }
}
