const numberFields = ["steps", "shapes", "mutations"];
const shapeField = "shapeType";
const shapeMap = {
    "triangle": 1,
    "rectangle": 2,
    "ellipse": 3,
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

export function showResult(raster) {
// когда-нибудь
}

export function getConfig() {
    let form = document.querySelector("form");
    let cfg = {};
// Ах, этот синтаксис...
    numberFields.forEach(name => {
        cfg[name] = Number(form.querySelector(`[name=${name}]`).value);
    });

    cfg.shapeTypes = [];
    let shapeFields = Array.from(form.querySelectorAll(`[name=${shapeField}]`)); // не ну это же просто некрасиво, ведь так?
    shapeFields.forEach(input => {
        if (!input.checked) { return; }
        cfg.shapeTypes.push(shapeMap[input.value]);
        // сначала нужно сделать сами полигоны, круги, треугольники и квадраты
    });

    cfg.fill = "#ffffff";

    return cfg;
}
