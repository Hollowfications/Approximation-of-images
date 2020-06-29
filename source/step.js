import * as Utility from "./utility.js";
import State from "./state.js";

/* Шаг: Форма, цвет и альфа-канал */
export default class Step {
    constructor(shape, cfg) {
        this.shape = shape;
        this.cfg = cfg;
        this.alpha = cfg.alpha;

        /* эти два атрибута вычисляются во время compute() */
        this.color = "#000";
        this.distance = Infinity;
    }
    /* применять данный шаг (step) к текущему положению (state) чтобы получить новое положение. Применять только после compute() */
    apply(state) {
        let newCanvas = state.canvas.clone().drawStep(this);
        return new State(state.target, newCanvas, this.distance);
    }

    /* найти подходящий цвет и вычислить дистанцию */
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

    /* возвращает слегка изменённое положение */
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
