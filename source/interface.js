/**
 * @file Входной файл, в котором содержатся функции, отвечающие за запуск алгоритма, синхронизацию параметров и за запуск отрисовки фигур на холсте.
 */
import * as ui from "./ui.js";
import Canvas from "./canvas.js";
import GenAlgorithm from "./genalgorithm.js";

const nodes = {
    output: document.querySelector("#output"),
    original: document.querySelector("#original"),
    steps: document.querySelector("#steps"),
    raster: document.querySelector("#raster"),
    types: Array.from(document.querySelectorAll("#output [name=type]"))
}

let steps;
/**
 *
 * @param {Canvas} original - исходное изображение
 * @param {Canvas} result - новое изображение
 * @param cfg - конфигурация
 * @param steps - Количество шагов (фигур), за которые программа должна отрисовать изображение
 */
function go(original, cfg) { // и наконец сюда после onSubmit(e)
    nodes.steps.innerHTML = "";
    nodes.original.innerHTML = "";
    nodes.output.style.display = "";
    nodes.raster.innerHTML = "";
    nodes.original.appendChild(original.node);
    steps = 0;

    let genAlgorithm = new GenAlgorithm(original, cfg);
    steps = 0;

    let cfg2 = Object.assign({}, cfg, {width:cfg.scale*cfg.width, height:cfg.scale*cfg.height});
    let result = Canvas.empty(cfg2);
    result.ctx.scale(cfg.scale, cfg.scale);
    nodes.raster.appendChild(result.node);


    genAlgorithm.onStep = (step) => {
        if (step && steps < cfg.steps) {
            result.drawStep(step);
            let percent = (100*(1-step.distance)).toFixed(2);
            nodes.steps.innerHTML = `(${++steps} of ${cfg.steps}, ${percent}% similar)`;
        }
    }
    genAlgorithm.start();
}

/**
 * Запускается после всех синхронизация параметров при нажатии на клавишу Create Image, изображение предстваляется в виде URL файла, создается конфигурация алгоритма.
 */
function onSubmit(e) {
    e.preventDefault();
    let inputFile = document.querySelector("input[type=file]");
    let url = "";
    if (inputFile.files.length > 0) {
        let file = inputFile.files[0];
        url = URL.createObjectURL(file);
    }
    let cfg = ui.getConfig();
    Canvas.original(url, cfg).then(original => go(original, cfg));
}

/**
 * Запуск программы
 */
function init() {
    nodes.output.style.display = "none";
    nodes.types.forEach(input => input.addEventListener("click", syncType));
    ui.init();
    syncType();
    document.querySelector("form").addEventListener("submit", onSubmit);
}

/**
 * Синхронизация параметров из пользовательского интерфейса
 */
function syncType() {
    nodes.output.className = "";
    nodes.types.forEach(input => {
        if (input.checked) { nodes.output.classList.add(input.value); }
    });
}

init();