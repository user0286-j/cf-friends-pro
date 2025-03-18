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
            if (result.id == undefined){
                // & caso que no exista, debemos crear uno
                chrome.storage.local.set({"id": -1});
            }else{
                // ? caso que exista, verificamos si el elemento es el actualizado
                if (result.id != data.result[-1].id){
                    // & Si son diferentes, entonces actualizamos y mandamos a resetear todo
                    reset = true;
                } 
            }
        });
        }
    }catch (error){
        // ! mandamos el error
        console.error(`Error: ${error}`);
    }
}

// Devuelve el estado
async function get_last_contest(handle: string, ms: number){
    //delay(ms);
    let url = `https://codeforces.com/api/user.rating?handle=${handle}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(handle, data.status);
    return data;
}


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
                //? Caso que exista, verificar si se debe hacer un reseteo general
                if (reset == true){
                    // & caso verdadero, pues, se reseta todo
                    let reseteo = result[name];
                    reseteo.set("reset", true);
                    chrome.storage.local.set({[name]: reseteo});
                }

            }else{
                // & caso exista, crearlo
                chrome.storage.local.set({[name]: {
                    "reset": false,
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
            tr.innerHTML = `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark">${name}</td>\n<td class="dark right">last</td>`;
            tabla.appendChild(tr);
           
        });
        contenido.appendChild(tabla);
    }else{
        alert("la extensión no se puede cargar :(");
    }

 
}else{
    console.log("tabla no encontrada");
}