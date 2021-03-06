/**
 * @file Файл, содержащий вспомогательный класс {Step} Step.
 */
import * as Utility from "./utility.js";
import State from "./state.js";

export default class Step {
    /**
     * Класс абстрактного текущего шага
     * @class Step
     * @param {Shape} shape - Форма
     * @param cfg - текущая конфигурация
     */
    constructor(shape, cfg) {
        this.shape = shape;
        this.cfg = cfg;
        this.alpha = cfg.alpha;

        /* эти два атрибута вычисляются во время compute() */
        this.color = "#000";
        this.distance = Infinity;
    }
    /**
     * Применяmь данный шаг (step) к текущему положению (state) чтобы получить новое положение. Применяется после compute()
     * @memberOf Step
     * @method apply
     * @param state
     * @returns {State}
     */
    apply(state) {
        let newCanvas = state.canvas.clone().drawStep(this);
        return new State(state.target, newCanvas, this.distance);
    }

    /**
     * Найти подходящий цвет и вычислить дистанцию
     * @memberOf Step
     * @method compute
     * @param {State} state - Текущее состояние
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
     * Возвращает слегка изменённое положение
     * @memberOf Step
     * @method mutate
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
