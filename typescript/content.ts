var table = document.querySelector<HTMLTableElement>("#pageContent > div.datatable > div:nth-child(6) > table");

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
        });
        contenido.appendChild(tabla);
    }else{
        alert("la extensión no se puede cargar :(");
    }

 
}else{
    console.log("tabla no encontrada");
}