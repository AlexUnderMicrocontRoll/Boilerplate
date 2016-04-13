/**
 * Created by alexanderschaaf on 28.03.16.
 */
var initialize = function() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://botnet.artificial.engineering:8080/api/Status", true);
    xhr.send();


    xhr.onload = function () {

        var data = null;

        try {
            data = JSON.parse(xhr.response);
        } catch (e) {
            console.error(e);
        }

        if (this.status == 200) {
            console.log(data[0].ip);
        }

        var table = document.querySelector('#status-overview tbody');
        var row = null;
        for (var i = 0; i < data.length; i++) {
            row = table.insertRow(i);

            row.innerHTML = "<td>" + data[i].id + "</td><td>" + data[i].ip + "</td><td>" + data[i].task + "</td><td>" + data[i].workload + "</td>"
        }
    };
};

    
    
   
    
    
    
    
    



