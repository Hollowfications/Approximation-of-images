/**
 * @file Файл, содержащий вспомогательный класс {State} State.
 */

export default class State {
    /**
     * Текущее состояние
     * @class State
     * @param {Canvas} target - следующее состояние
     * @param {Canvas} canvas - текущее состояние - в виде холста
     * @param distance - расстояние между пикселями прошлого и текущего изображений
     */
    constructor(target, canvas, distance = Infinity) {
        this.target = target;
        this.canvas = canvas;
        this.distance = (distance == Infinity ? target.distance(canvas) : distance);
    }
}
