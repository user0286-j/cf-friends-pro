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
// ^ declaramos colores
var rango;
(function (rango) {
    rango["unrated"] = "#000000";
    rango["newbie"] = "#cccccc";
    rango["pupil"] = "#78ff77";
    rango["specialist"] = "#78ddbb";
    rango["expert"] = "#aaaaff";
    rango["cm"] = "#ff88ff";
    rango["master"] = "#ffcc88";
    rango["im"] = "#ffbb55";
    rango["grandmaster"] = "#ffbb55";
    rango["igm"] = "#ff3333";
    rango["lgm"] = "#ff3333";
    rango["winner"] = "#ffffff";
})(rango || (rango = {}));
function getcolor(rating) {
    if (rating === 0) {
        return rango.unrated;
    }
    else if (rating < 1200) {
        return rango.newbie;
    }
    else if (rating < 1400) {
        return rango.pupil;
    }
    else if (rating < 1600) {
        return rango.specialist;
    }
    else if (rating < 1900) {
        return rango.expert;
    }
    else if (rating < 2100) {
        return rango.cm;
    }
    else if (rating < 2300) {
        return rango.master;
    }
    else if (rating < 2400) {
        return rango.im;
    }
    else if (rating < 2600) {
        return rango.grandmaster;
    }
    else if (rating < 3000) {
        return rango.igm;
    }
    else if (rating < 4000) {
        return rango.lgm;
    }
    return rango.winner;
}
class contenidoTr {
    constructor(id = 0, nombre = "", change = "last", rating = 0) {
        this.id = id;
        this.nombre = nombre;
        this.change = change;
        this.rating = rating;
    }
    toString() {
        return `<td class="dark left">
                    ${this.id}
                </td>\n

                <td style="text-align:left;" class="dark">
                    <a href="${"./profile/" + this.nombre}" style="color:${getcolor(this.rating)}; text-decoration:none">
                        <b>${this.nombre}</b>
                    </a>
                </td>\n

                <td class="dark right">
                    ${this.rating}
                </td>
                
                <td class="dark right" style = "border-left: 1px solid #e4e4e4">
                    ${this.change}
                </td>
                `;
    }
}
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
                    console.log("hola mundo", result.id);
                    if (result.id == undefined) {
                        // & caso que no exista, debemos crear uno
                        console.log("no existe");
                        chrome.storage.local.set({ "id": -1 });
                    }
                    // ? caso que exista, verificamos si el elemento es el actualizado
                    if (result.id != data.result[0].id) {
                        console.log("Actualizar los datos");
                        console.log(data.result[0].id);
                        chrome.storage.local.set({ "id": data.result[0].id });
                        // & Si son diferentes, entonces actualizamos y mandamos a resetear todo
                        reset = true;
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
// ~ Devuelve el estado
// TODO Debo de verificar todo está ok
function get_last_contest(handle, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        //delay(ms);
        let url = `https://codeforces.com/api/user.rating?handle=${handle}`;
        const response = yield fetch(url);
        const data = yield response.json();
        console.log(handle, data.status);
        if (data.status == "OK") {
            return data.result[data.result.length - 1];
        }
        else {
            // ! regresamos un error
            return null;
        }
        //return data.result[-1];
    });
}
function crear_tabla() {
    return __awaiter(this, void 0, void 0, function* () {
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
                        console.log(`${name} existe`, reset);
                        //? Caso que exista, verificar si se debe hacer un reseteo general
                        if (reset == true) {
                            // & caso verdadero, pues, se reseta todo
                            let reseteo = result[name];
                            console.log(reseteo);
                            reseteo.reset = true;
                            console.log(reseteo);
                            chrome.storage.local.set({ [name]: reseteo });
                        }
                    }
                    else {
                        console.log(`${name} no existe`);
                        // & caso exista, crearlo
                        chrome.storage.local.set({ [name]: {
                                "reset": true,
                                "contestname": "void", // TODO Esto lo hago después creo
                                "change": 0,
                                "rating": 0
                            } });
                    }
                });
            });
            const contenido = document.querySelector("#pageContent");
            if (contenido) {
                const div = document.createElement("div");
                div.classList.add("datatable");
                const tabla = document.createElement("table");
                const tbody = document.createElement("tbody");
                names.forEach((name, index) => {
                    const tr = document.createElement("tr");
                    let contenido_tr = new contenidoTr(index, name);
                    // tr.innerHTML = `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark"><a href="${"./profile/" + name}"><b>${name}</b></a></td>\n<td class="dark right">last</td>`;
                    tr.innerHTML = contenido_tr.toString();
                    try {
                        chrome.storage.local.get([name]).then((result) => {
                            // ? revisamos si existe 
                            //console.log(result[""]);
                            if (result[name]["reset"] == true) {
                                // & mandamos a actualizar
                                get_last_contest(name, 100).then((results) => {
                                    if (results) {
                                        const contest = results["contestName"];
                                        const nRating = results["newRating"] - results["oldRating"];
                                        const ratingn = results["newRating"];
                                        console.log("hola", name, nRating);
                                        console.log(results["newRating"]);
                                        contenido_tr = new contenidoTr(index, name, nRating, ratingn);
                                        tr.innerHTML = contenido_tr.toString();
                                        //tr.innerHTML =  `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark"><a style=""; href="${"./profile/" + name}"><b>${name}</b></a></td>\n<td class="dark right">${nRating}</td>`;
                                        let cambio = result[name];
                                        cambio.change = nRating;
                                        cambio.reset = false;
                                        cambio.contestname = contest;
                                        cambio.rating = ratingn;
                                        chrome.storage.local.set({ [name]: cambio });
                                    }
                                    else {
                                        throw new Error("No se pudo acceder al sistema");
                                    }
                                });
                            }
                            else {
                                console.log("datos guardados");
                                contenido_tr = new contenidoTr(index, name, result[name]["change"], result[name]["rating"]);
                                tr.innerHTML = contenido_tr.toString();
                                //tr.innerHTML =  `<td class="dark left">${index}</td>\n<td style="text-align:left; color:${getcolor(result[name]["rating"])};" class="dark"><a href="${"./profile/" + name}"><b>${name}</b></a></td>\n<td class="dark right">${result[name]["change"]}</td>`;
                            }
                        });
                    }
                    catch (error) {
                        // ! Mandamos el error que no se pudo cargar
                        contenido_tr = new contenidoTr(index, name);
                        tr.innerHTML = contenido_tr.toString();
                        //tr.innerHTML =  `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark"><a href="${"./profile/" + name}"><b>${name}</b></a></td>\n<td class="dark right">last</td>`;
                        //tabla.appendChild(tr);
                        console.error(`Error: ${error}`);
                    }
                    tbody.appendChild(tr);
                    tabla.appendChild(tbody);
                    div.appendChild(tabla);
                });
                contenido.appendChild(div);
            }
            else {
                alert("la extensión no se puede cargar :(");
            }
        }
        else {
            console.log("tabla no encontrada");
        }
        table === null || table === void 0 ? void 0 : table.style.setProperty("display", "none");
    });
}
function ejecutar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield init();
        yield crear_tabla();
    });
}
ejecutar();
