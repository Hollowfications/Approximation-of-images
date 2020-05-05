import * as ui from "./ui.js"; // интересно что можно и так
import Canvas from "./canvas.js"; //                    и так

//Зачем делать функцию сохранения, если можно просто нажать правой кнопкой мыши по готовому изображению и выбрать "сохранить"
// function save() {
//     var modal = document.getElementById("saveModal");
//     var btn = document.getElementById("saveButton");
//     var span = document.getElementsByClassName("closeSave")[0];
//
//     btn.onclick = function() {
//         modal.style.display = "block";
//     }
//
//     span.onclick = function() {
//         modal.style.display = "none";
//     }
//
//     window.onclick = function(event) {
//         if (event.target == modal) {
//             modal.style.display = "none";
//         }
//     }
// }

const nodes = {
    output: document.querySelector("#output"),
    original: document.querySelector("#original"),
    steps: document.querySelector("#steps"),
    types: Array.from(document.querySelectorAll("#output [name=type]"))
}

let steps; // Количество шагов (фигур), за которые программа должна отрисовать изображение

function go(original, cfg) { // и наконец сюда после onSubmit(e)

}
function onSubmit(e) { // потом сюда после init()
// такая дичь, проще с юрл работать
    let inputFile = document.querySelector("input[type=file]");
    let url = "";
    if (inputFile.files.length > 0) {
        let file = inputFile.files[0];
        url = URL.createObjectURL(file);
    }
    let cfg = ui.getConfig();
    Canvas.original(url, cfg).then(original => go(original, cfg));
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