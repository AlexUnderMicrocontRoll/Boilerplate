/**
 * Created by alexanderschaaf on 28.03.16.
 */

console.log("wtf");
var oReq = new XMLHttpRequest();
oReq.open("GET", "http://botnet.artificial.engineering:8080/api/Status",true);
oReq.responseType = "json";
oReq.send();
oReq.onload = function() {
    if (this.status == 200) {
        console.log(this.response);
    }
};


