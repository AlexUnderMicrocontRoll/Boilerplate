/**
 * Created by alexanderschaaf on 28.03.16.
 */

console.log("wtf");
var oReq = new XMLHttpRequest();
oReq.open("GET", "http://botnet.artificial.engineering:8080/api/Status",true);
oReq.responseType = "text";
oReq.send();
oReq.onload = function(e) {
    if (this.status == 200) {
        var bb = new Text();
    }
};



function addRow() {
    var table = document.getElementById("status-overview");
    var tbody = document.createElement("TBODY");
    var trow = document.createElement("TR");
    var tcolumn = document.createElement("TD");

    tbody.setAttribute("id","tbody");
    trow.setAttribute("id","trow");
    tcolumn.setAttribute("id","tcolumn");

    trow.appendChild(tcolumn);
    tbody.appendChild(trow);
    table.appendChild(tbody);

}

