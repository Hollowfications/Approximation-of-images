export default class State {
    constructor(target, canvas, distance = Infinity) {
        this.target = target;
        this.canvas = canvas;
        this.distance = (distance == Infinity ? target.distance(canvas) : distance);
    }
}
