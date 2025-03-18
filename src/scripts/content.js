"use strict";
// ^ iniciamos los datos
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let reset = false;
var table = document.querySelector("#pageContent > div.datatable > div:nth-child(6) > table");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // verificar el último contest 
        const url = "https://codeforces.com/api/contest.list";
        const response = yield fetch(url);
        const data = yield response.json();
        // verifica la data está disponible
        try {
            // ? verificamos si se obtuvo correctamente los datos
            if (data.status != "OK") {
                // ! Caso que no exista, mandamos error
                throw new Error("Could not be obtained the list contest");
            }
            else {
                // ? verificamos primeramente si existe la variable id
                chrome.storage.local.get(["id"]).then((result) => {
                    if (result.id == undefined) {
                        // & caso que no exista, debemos crear uno
                        chrome.storage.local.set({ "id": -1 });
                    }
                    else {
                        // ? caso que exista, verificamos si el elemento es el actualizado
                        if (result.id != data.result[-1].id) {
                            // & Si son diferentes, entonces actualizamos y mandamos a resetear todo
                            reset = true;
                        }
                    }
                });
            }
        }
        catch (error) {
            // ! mandamos el error
            console.error(`Error: ${error}`);
        }
    });
}
// Devuelve el estado
function get_last_contest(handle, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        //delay(ms);
        let url = `https://codeforces.com/api/user.rating?handle=${handle}`;
        const response = yield fetch(url);
        const data = yield response.json();
        console.log(handle, data.status);
        return data;
    });
}
// * Acá sacamos los nombres de los amigos de los usuarios
if (table) {
    const names = [];
    const fila = table.rows;
    for (let i = 1; i < fila.length; i++) {
        //console.log(fila[i].innerText.split('\t')[1]);
        // & Agregamos los nombres en un arreglo
        names.push(fila[i].innerText.split('\t')[1]);
    }
    /*
        * Antes de insertar, debo asegurar que los elementos estén
        & caso no exista, debo crearlo, y en caso sí existe, debo poner el valor de reset
    */
    names.forEach((name, index) => {
        // ? verificamos que existe elemento
        chrome.storage.local.get([name]).then((result) => {
            if (result[name]) {
                //? Caso que exista, verificar si se debe hacer un reseteo general
                if (reset == true) {
                    // & caso verdadero, pues, se reseta todo
                    let reseteo = result[name];
                    reseteo.set("reset", true);
                    chrome.storage.local.set({ [name]: reseteo });
                }
            }
            else {
                // & caso exista, crearlo
                chrome.storage.local.set({ [name]: {
                        "reset": false,
                        "contestname": "void", // TODO Esto lo hago después creo
                        "rating": 0
                    } });
            }
        });
    });
    const contenido = document.querySelector("#pageContent");
    if (contenido) {
        const tabla = document.createElement("table");
        names.forEach((name, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark">${name}</td>\n<td class="dark right">last</td>`;
            tabla.appendChild(tr);
        });
        contenido.appendChild(tabla);
    }
    else {
        alert("la extensión no se puede cargar :(");
    }
}
else {
    console.log("tabla no encontrada");
}
