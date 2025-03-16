"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var table = document.querySelector("#pageContent > div.datatable > div:nth-child(6) > table");
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function get_last_contest(handle, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        delay(ms);
        let url = `https://codeforces.com/api/user.rating?handle=${handle}`;
        const response = yield fetch(url);
        const data = yield response.json();
        console.log(handle, data.status);
        return data;
    });
}
if (table) {
    const names = [];
    const fila = table.rows;
    for (let i = 1; i < fila.length; i++) {
        //console.log(fila[i].innerText.split('\t')[1]);
        names.push(fila[i].innerText.split('\t')[1]);
    }
    const contenido = document.querySelector("#pageContent");
    if (contenido) {
        const tabla = document.createElement("table");
        names.forEach((name, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark">${name}</td>\n<td class="dark right">last</td>`;
            tabla.appendChild(tr);
            get_last_contest(name, index * 1000);
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
