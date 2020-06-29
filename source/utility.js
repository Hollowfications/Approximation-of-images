export function clamp(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

export function clampColor(x) {
    return clamp(x, 0, 255);
}

export function getScale(width, height, limit) {
    return Math.max(width / limit, height / limit, 1);
}

export function distanceToDifference(distance, pixels) {
    return Math.pow(distance*255, 2) * (3 * pixels);
}

export function differenceToDistance(difference, pixels) {
    return Math.sqrt(difference / (3 * pixels))/255;
}

export function difference(data, dataOther) {
    let sum = 0, diff;
    for (let i=0;i<data.data.length;i++) {
        if (i % 4 == 3) { continue; }
        diff = dataOther.data[i]-data.data[i];
        sum = sum + diff*diff;
    }

    return sum;
}

function computeColor(offset, imageData, alpha) {
    let color = [0, 0, 0];
    let {shape, current, target} = imageData;
    let shapeData = shape.data;
    let currentData = current.data;
    let targetData = target.data;

    let si, sx, sy, fi, fx, fy;
    let sw = shape.width;
    let sh = shape.height;
    let fw = current.width;
    let fh = current.height;
    let count = 0;

    for (sy=0; sy<sh; sy++) {
        fy = sy + offset.top;
        if (fy < 0 || fy >= fh) { continue; } /* если вне canvas по вертикали */

        for (sx=0; sx<sw; sx++) {
            fx = offset.left + sx;
            if (fx < 0 || fx >= fw) { continue; } /* если вне canvas по горизонтали */

            si = 4*(sx + sy*sw); /* локальный индекс (фигуры)  */
            if (shapeData[si+3] == 0) { continue; } /* если только уже нарисовано */

            fi = 4*(fx + fy*fw); /* глобальный индекс (полный) */
            color[0] += (targetData[fi] - currentData[fi]) / alpha + currentData[fi];
            color[1] += (targetData[fi+1] - currentData[fi+1]) / alpha + currentData[fi+1];
            color[2] += (targetData[fi+2] - currentData[fi+2]) / alpha + currentData[fi+2];

            count++;
        }
    }

    return color.map(x => ~~(x/count)).map(clampColor);
}

function computeDifferenceChange(offset, imageData, color) {
    let {shape, current, target} = imageData;
    let shapeData = shape.data;
    let currentData = current.data;
    let targetData = target.data;

    let a, b, d1r, d1g, d1b, d2r, d2b, d2g;
    let si, sx, sy, fi, fx, fy;
    let sw = shape.width;
    let sh = shape.height;
    let fw = current.width;
    let fh = current.height;

    let sum = 0;

    for (sy=0; sy<sh; sy++) {
        fy = sy + offset.top;
        if (fy < 0 || fy >= fh) { continue; } /* вне canvas по вертикали */

        for (sx=0; sx<sw; sx++) {
            fx = offset.left + sx;
            if (fx < 0 || fx >= fw) { continue; } /* вне canvas по горизонтали */

            si = 4*(sx + sy*sw);
            a = shapeData[si+3];
            if (a == 0) { continue; } /* если только уже нарисовано */

            fi = 4*(fx + fy*fw);

            a = a/255;
            b = 1-a;
            d1r = targetData[fi]-currentData[fi];
            d1g = targetData[fi+1]-currentData[fi+1];
            d1b = targetData[fi+2]-currentData[fi+2];

            d2r = targetData[fi] - (color[0]*a + currentData[fi]*b);
            d2g = targetData[fi+1] - (color[1]*a + currentData[fi+1]*b);
            d2b = targetData[fi+2] - (color[2]*a + currentData[fi+2]*b);

            sum -= d1r*d1r + d1g*d1g + d1b*d1b;
            sum += d2r*d2r + d2g*d2g + d2b*d2b;
        }
    }

    return sum;
}

export function computeColorAndDifferenceChange(offset, imageData, alpha) {
    let rgb = computeColor(offset, imageData, alpha);
    let differenceChange = computeDifferenceChange(offset, imageData, rgb);

    let color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

    return {color, differenceChange};
}

// фактически это файл инструментов, с помощью которого и будет работать генетический алгоритм






