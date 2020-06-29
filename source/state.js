/**
 *
 * @param target - следующее состояние
 * @param canvas - текущее состояние - в виде холста
 * @param distance - расстояние между пикселями прошлого и текущего изображений
 */
export default class State {

    constructor(target, canvas, distance = Infinity) {
        this.target = target;
        this.canvas = canvas;
        this.distance = (distance == Infinity ? target.distance(canvas) : distance);
    }
}
