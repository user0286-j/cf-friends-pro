"use strict";
var table = document.querySelector("#pageContent > div.datatable > div:nth-child(6) > table");
if (table) {
    var names = [];
    var fila = table.rows;
    for (var i = 1; i < fila.length; i++) {
        console.log(fila[i].innerText.split('\t')[1]);
        names.push(fila[i].innerText.split('\t')[1]);
    }
    var contenido = document.querySelector("#pageContent");
    if (contenido) {
        var tabla_1 = document.createElement("table");
        names.forEach(function (name, index) {
            var tr = document.createElement("tr");
            tr.innerHTML = "<td class=\"dark left\">".concat(index, "</td>\n<td style=\"text-align:left;\" class=\"dark\">").concat(name, "</td>\n<td class=\"dark right\">last</td>");
            tabla_1.appendChild(tr);
        });
        contenido.appendChild(tabla_1);
    }
    else {
        alert("la extensión no se puede cargar :(");
    }
}
else {
    console.log("tabla no encontrada");
}
