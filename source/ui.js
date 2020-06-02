import {Triangle, Rectangle, Ellipse } from "./shape.js";

const numberFields = ["computeSize", "steps", "shapes", "alpha", "mutations"];
const boolFields = ["mutateAlpha"];
const shapeField = "shapeType";
const shapeMap = {
    "triangle": Triangle,
    "rectangle": Rectangle,
    "ellipse": Ellipse
}

function fixRange(range) {
    function sync() {
        let value = range.value;
        range.parentNode.querySelector(".value").innerHTML = value;
    }

    range.oninput = sync;
    sync();
}

export function init() {
    let ranges = document.querySelectorAll("[type=range]");
    Array.from(ranges).forEach(fixRange);
    // блокируем ползунки
}

export function getConfig() {
    let form = document.querySelector("form");
    let cfg = {};
// Ах, этот синтаксис...
    numberFields.forEach(name => {
        cfg[name] = Number(form.querySelector(`[name=${name}]`).value);
    });
    boolFields.forEach(name => {
        cfg[name] = form.querySelector(`[name=${name}]`).checked;
    });
    cfg.shapeTypes = [];
    let shapeFields = Array.from(form.querySelectorAll(`[name=${shapeField}]`)); // не ну это же просто некрасиво, ведь так?
    shapeFields.forEach(input => {
        if (!input.checked) { return; }
        cfg.shapeTypes.push(shapeMap[input.value]);
    });

    cfg.fill = "auto";

    return cfg;
}
