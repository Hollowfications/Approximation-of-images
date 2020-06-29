/**
 *
 */
export default class State {
    /**
     *
     * @param target
     * @param canvas
     * @param distance
     */
    constructor(target, canvas, distance = Infinity) {
        this.target = target;
        this.canvas = canvas;
        this.distance = (distance == Infinity ? target.distance(canvas) : distance);
    }
}
