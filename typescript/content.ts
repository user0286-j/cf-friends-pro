var table = document.querySelector<HTMLTableElement>("#pageContent > div.datatable > div:nth-child(6) > table");

function init(){
    // obtener ID
    let id: number;
    // TODO verificar que exista datos almacenados
    chrome.storage.local.get(["id"]).then((result) => {
        if (result.id == undefined){
            console.log("No se encuentra id, se creará uno por defecto");
            chrome.storage.local.set({"id": -1});
            id = -1;
        }else{
            id = result.id;
            console.log(`Id ${id}`);
        }
    });

    // obtener dato del último contest
    
    

}

function delay(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function get_last_contest(handle: string, ms: number){
    delay(ms);
    let url = `https://codeforces.com/api/user.rating?handle=${handle}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(handle, data.status);
    return data;
}

init();

if (table){

    const names: string[] = [];
    const fila = table.rows;
    for (let i: number = 1; i < fila.length; i++){
        //console.log(fila[i].innerText.split('\t')[1]);
        names.push(fila[i].innerText.split('\t')[1]);
    }

    const contenido = document.querySelector<HTMLDivElement>("#pageContent");
    if (contenido){
        
        const tabla = document.createElement("table");
        names.forEach((name: string, index: number) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td class="dark left">${index}</td>\n<td style="text-align:left;" class="dark">${name}</td>\n<td class="dark right">last</td>`;
            tabla.appendChild(tr);
            //get_last_contest(name, index*1000); //FIXME que no sejecute al mismo tiempo

        });
        contenido.appendChild(tabla);
    }else{
        alert("la extensión no se puede cargar :(");
    }

 
}else{
    console.log("tabla no encontrada");
}