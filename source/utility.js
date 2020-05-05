export function clamp(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

export function clampColor(x) {
    return clamp(x, 0, 255);
}

function getScale(width, height, limit) {
    return Math.max(width / limit, height / limit, 1);
}

export function distanceToDifference(distance, pixels) {
    return Math.pow(distance*255, 2) * (3 * pixels);
}

export function differenceToDistance(difference, pixels) {
    return Math.sqrt(difference / (3 * pixels))/255;
}

// фактически это файл инструментов, с помощью которого и будет работать генетический алгоритм






