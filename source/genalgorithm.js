/**
 * @file Файл, в котором содержится как таковой генетический алгоритм.
 */
import Step from "./step.js";
import State from "./state.js";
import Canvas from "./canvas.js";
import {Shape} from "./shape.js";

export default class GenAlgorithm {
    /**
     * Основной класс алгоритма
     * @class GenAlgorithm
     * @param {Canvas} original - исходное изображение
     * @param cfg - настройки
     */
    constructor(original, cfg) {
        this.cfg = cfg;
        this.state = new State(original, Canvas.empty(cfg));
        this._steps = 0;
        this.onStep = () => {};
            }

    /**
     * Запуск алгоритма
     * @memberOf GenAlgorithm
     * @method start
     */
    start() {
        this._ts = Date.now();
        this._addShape();
    }

    /**
     * Добавляет новый примитив на холст, вызывая _findBestStep()
     * @memberOf GenAlgorithm
     * @method _addShape
     */
    _addShape() {
        this._findBestStep().then(step => this._optimizeStep(step)).then(step => {
            this._steps++;
            if (step.distance < this.state.distance) { /* лучше чем текущее состояние, чётко */
                this.state = step.apply(this.state);
                this.onStep(step);
            } else { /* хуже чем текущее состояние, в мусорку его */
                this.onStep(null);
            }
            this._continue();
        });
    }

    /**
     * @memberOf GenAlgorithm
     * @private
     */
    _continue() {
        if (this._steps < this.cfg.steps) {
            setTimeout(() => this._addShape(), 10);
        } else {
            let time = Date.now() - this._ts;
        }
    }

    /**
     * Находит самый подходящий шаг. Селекция, если пользоваться терминологией генетического алгоритма.
     * @memberOf GenAlgorithm
     * @method _findBestStep
     * @returns {Promise<unknown[]>}
     */
    _findBestStep() {
        const LIMIT = this.cfg.shapes;

        let bestStep = null;
        let promises = [];

        for (let i = 0; i < LIMIT; i++) {
            let shape = Shape.create(this.cfg);

            let promise = new Step(shape, this.cfg).compute(this.state).then(step => {
                if (!bestStep || step.distance < bestStep.distance) {
                    bestStep = step;
                }
            });
            promises.push(promise);
        }

        return Promise.all(promises).then(() => bestStep);
    }

    /**
     * Оптимизирует полученный "лучший" шаг с помощью его мутации.
     * @memberOf GenAlgorithm
     * @method _optimizeStep
     * @param {Step} step - текущий шаг
     * @returns {Promise<unknown>}
     */
    _optimizeStep(step) {
        const LIMIT = this.cfg.mutations;

        let totalAttempts = 0;
        let successAttempts = 0;
        let failedAttempts = 0;
        let resolve = null;
        let bestStep = step;
        let promise = new Promise(r => resolve = r);
            let tryMutation = () => {
                if (failedAttempts >= LIMIT) {
                    return resolve(bestStep);
                }

                totalAttempts++;
                bestStep.mutate().compute(this.state).then(mutatedStep => {
                    if (mutatedStep.distance < bestStep.distance) { /* успех */
                        successAttempts++;
                        failedAttempts = 0;
                        bestStep = mutatedStep;
                    } else { /* неудача */
                        failedAttempts++;
                    }

                    tryMutation();
                });
            }

            tryMutation();
        return promise;
    }
}
