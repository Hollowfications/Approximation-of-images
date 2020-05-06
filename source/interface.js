import * as ui from "./ui.js"; // интересно что можно и так
import Canvas from "./canvas.js"; //                    и так

const nodes = {
    output: document.querySelector("#output"),
    original: document.querySelector("#original"),
    steps: document.querySelector("#steps"),
    types: Array.from(document.querySelectorAll("#output [name=type]"))
}

let steps; // Количество шагов (фигур), за которые программа должна отрисовать изображение

function go(original, cfg) { // и наконец сюда после onSubmit(e)
    nodes.steps.innerHTML = "";
    nodes.original.innerHTML = "";

    nodes.output.style.display = "";
    nodes.original.appendChild(original.node);
    steps = 0;
}
function onSubmit(e) { // потом сюда после init()
    e.preventDefault(); // чушь
    let inputFile = document.querySelector("input[type=file]");
    let url = "";
    if (inputFile.files.length > 0) {
        let file = inputFile.files[0];
        url = URL.createObjectURL(file);
    }
    let cfg = ui.getConfig();
    Canvas.original(url, cfg).then(original => go(original, cfg)); // какие-то новые фишки, похоже на connect'ы из Qt5
}

function init() { // то есть здесь
    nodes.output.style.display = "none";
    nodes.types.forEach(input => input.addEventListener("click", syncType));
    ui.init();
    syncType();
    document.querySelector("form").addEventListener("submit", onSubmit);
}
function syncType() {
    nodes.output.className = "";
    nodes.types.forEach(input => {
        if (input.checked) { nodes.output.classList.add(input.value); }
    });
}

init(); // запуск идёт отсюда