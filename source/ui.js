/**
 * @file Файл, в котором содержатся функции для работы с пользовательским интерфейсом.
 */
import {Triangle, Rectangle, Ellipse } from "./shape.js";

const numberFields = ["computeSize", "steps", "shapes", "alpha", "mutations"];
const boolFields = ["mutateAlpha"];
const fillField = "fill";
const shapeField = "shapeType";
const shapeMap = {
    "triangle": Triangle,
    "rectangle": Rectangle,
    "ellipse": Ellipse
}

/**
    Фиксирует текущие настройки
*/
function fixRange(range) {
    function sync() {
        let value = range.value;
        range.parentNode.querySelector(".value").innerHTML = value;
    }

    range.oninput = sync;
    sync();
}

/**
 * Запуск
 */
export function init() {
    let ranges = document.querySelectorAll("[type=range]");
    Array.from(ranges).forEach(fixRange);
    /** блокируем ползунки */
}

/**
 * Возвращает текущую конфигурацию
 * @returns {{}}
 */
export function getConfig() {
    let form = document.querySelector("form");
    let cfg = {};
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

    let fillFields = Array.from(form.querySelectorAll(`[name=${fillField}]`));
    fillFields.forEach(input => {
        if (!input.checked) { return; }

        switch (input.value) {
            case "auto": cfg.fill = "auto"; break;
            case "fixed": cfg.fill = form.querySelector("[name='fill-color']").value; break;
        }
    });
    return cfg;
}
