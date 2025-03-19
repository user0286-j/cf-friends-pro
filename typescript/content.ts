// ^ iniciamos los datos

let reset = false;
var table = document.querySelector<HTMLTableElement>("#pageContent > div.datatable > div:nth-child(6) > table");

async function init() {
    // verificar el último contest 
    const url = "https://codeforces.com/api/contest.list";
    const response = await fetch(url);
    const data = await response.json();
    // verifica la data está disponible
    try{
        // ? verificamos si se obtuvo correctamente los datos
        if (data.status != "OK"){
            // ! Caso que no exista, mandamos error
            throw new Error("Could not be obtained the list contest");
        }else{
            // ? verificamos primeramente si existe la variable id
            chrome.storage.local.get(["id"]).then((result) => {
                console.log("hola mundo", result.id);
                if (result.id == undefined){
                    // & caso que no exista, debemos crear uno
                    console.log("no existe");
                    chrome.storage.local.set({"id": -1});
                }
                // ? caso que exista, verificamos si el elemento es el actualizado
                if (result.id != data.result[0].id){
                    console.log("Actualizar los datos");
                    console.log(data.result[0].id);
                    chrome.storage.local.set({"id": data.result[0].id});
                    // & Si son diferentes, entonces actualizamos y mandamos a resetear todo
                    reset = true;
                } 
                
            });
        }
    }catch (error){
        // ! mandamos el error
        console.error(`Error: ${error}`);
    }
}

// ~ Devuelve el estado
// TODO Debo de verificar todo está ok
async function get_last_contest(handle: string, ms: number){
    //delay(ms);
    let url = `https://codeforces.com/api/user.rating?handle=${handle}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(handle, data.status);
    if (data.status == "OK"){
        return data.result[data.result.length -1];
    }else{
        // ! regresamos un error
        return null;
    }
    //return data.result[-1];
}



async function crear_tabla(){
    // * Acá sacamos los nombres de los amigos de los usuarios
    if (table){

        const names: string[] = [];
        const fila = table.rows;
        for (let i: number = 1; i < fila.length; i++){
            //console.log(fila[i].innerText.split('\t')[1]);
            // & Agregamos los nombres en un arreglo
            names.push(fila[i].innerText.split('\t')[1]);
        }

        /*
            * Antes de insertar, debo asegurar que los elementos estén
            & caso no exista, debo crearlo, y en caso sí existe, debo poner el valor de reset
        */

        names.forEach((name: string, index: number) => {
            // ? verificamos que existe elemento
            chrome.storage.local.get([name]).then((result) => {
                if (result[name]){
                    console.log(`${name} existe`, reset);
                    //? Caso que exista, verificar si se debe hacer un reseteo general
                    if (reset == true){
                        // & caso verdadero, pues, se reseta todo
                        let reseteo = result[name];
                        console.log(reseteo);
                        reseteo.reset = true;
                        console.log(reseteo);
                        chrome.storage.local.set({[name]: reseteo});
                    }

                }else{
                    console.log(`${name} no existe`);
                    // & caso exista, crearlo
                    chrome.storage.local.set({[name]: {
                        "reset": true,
                        "contestname": "void", // TODO Esto lo hago después creo
                        "rating": 0
                    }});
                }
            });
        });

        const contenido = document.querySelector<HTMLDivElement>("#pageContent");
        if (contenido){
            
            const tabla = document.createElement("table");
            names.forEach((name: string, index: number) => {
                const tr = document.createElement("tr");

                try{
                    chrome.storage.local.get([name]).then((result) => {
                        // ? revisamos si existe 
                        //console.log(result[""]);
                        if (result[name]["reset"] == true){
                            // & mandamos a actualizar
                            get_last_contest(name, 100).then((results) => {
                                if (results){
                                    const contest = results["contestName"];
                                    const nRating = results["newRating"];
                                    console.log("hola", name, nRating);
                                    console.log(results["newRating"]);
                                    tr.innerHTML =  `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark">${name}</td>\n<td class="dark right">${results["newRating"]}</td>`;
                                    let cambio = result[name];
                                    cambio.rating = nRating;
                                    cambio.reset = false;
                                    cambio.contestname = contest;
                                    chrome.storage.local.set({[name]: cambio});
                                }else{
                                    throw new Error("No se pudo acceder al sistema");
                                }
                            });
                        }else{
                            console.log("datos guardados");
                            tr.innerHTML =  `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark">${name}</td>\n<td class="dark right">${result[name]["rating"]}</td>`;
                        }
                    });
                }catch(error){
                    // ! Mandamos el error que no se pudo cargar
                    console.error(`Error: ${error}`);
                    tr.innerHTML =  `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark">${name}</td>\n<td class="dark right">last</td>`;
                }
                tabla.appendChild(tr);
            });
            contenido.appendChild(tabla);
        }else{
            alert("la extensión no se puede cargar :(");
        }

    
    }else{
        console.log("tabla no encontrada");
    }
}

async function ejecutar(){
    await init();
    await crear_tabla();
}

ejecutar();
