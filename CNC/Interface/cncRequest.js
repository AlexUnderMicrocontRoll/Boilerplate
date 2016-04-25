/**
 * Requests botnet data from CNC Server, adds it to status table.
 * 
 * @author Alex, Sai, Tobi
 */

// cnc server URI
var cncServer = "http://botnet.artificial.engineering:8080/api/Status";
var stop_reload; // TODO rename


var botnetData;
var botnetDataSortProp = "id";
var botnetDataSortOrder = "asc"; // asc, desc


var initializePageReload = function() {
	console.log("periodic page reload started");
    stop_reload= setInterval(function(){cncServerRequest();}, 100000);
};

var Reloadstop = function() {
	clearTimeout(stop_reload);
};


var sort = function(key){
    botnetDataSortProp = key;

    if(botnetDataSortOrder === "asc") {
        botnetData.sort(byPropertyAsc(botnetDataSortProp));
        botnetDataSortOrder = "desc";
        console.log("status table sort: id descending");
    }
    else if (botnetDataSortOrder === "desc") {
        botnetData.sort(byPropertyDesc(botnetDataSortProp));
        botnetDataSortOrder = "asc";
        console.log("status table sort: id ascending");
    }
    updateStatusTable();
};

var byPropertyAsc = function(prop) {
    return function(a,b) {
            if (typeof a[prop] === 'string' || a[prop] instanceof String){
                //für strings localCompare
                return a[prop].localeCompare(b[prop]);
            }else{
                //sonst für nummern
                return a[prop] - b[prop];
            }
    };
};

var byPropertyDesc = function(prop) {
    return function (a, b) {
            if (typeof b[prop] === 'string' || b[prop] instanceof String){
                //für strings localCompare
                return b[prop].localeCompare(a[prop]);
            }else{
                //sonst für nummern
                return b[prop] - a[prop];
            }
    };
};

var cncServerRequest = function() {
    var xhr = new XMLHttpRequest();

	// TODO encoding auf UTF-8
    xhr.open("GET", cncServer, true);
    xhr.send();
	
	// error event handler
	xhr.onerror = function() {
		console.error("xhr error by GET from " + cncServer);
	};
	
	// timeout event handler
	xhr.ontimeout = function() {
		console.error("xhr timeout by GET from " + cncServer);
	};
	
	// onload event handler
    xhr.onload = function () {
		

		// try to parse response to json
        try {
			// TODO xhr.response.setCharacterEncoding("UTF-8");
            botnetData = JSON.parse(xhr.response);
        } catch (e) {
            console.error(e);
        }
        
		updateStatusTable();
        console.log("cnc server bot list reloaded");
    };
};

function clearTable(table) {
    var rows = table.rows;
    var i = rows.length-1;
    for( var k=i; k >=0; k--){
        table.deleteRow(k);
    }
}


function updateStatusTable() {
	var statusTable = document.querySelector('#status-overview-results');
    var row = null;
        
	// empty table if already filled
    if (statusTable.childElementCount > 0){
		clearTable(statusTable);
    }

	// fill table with new table rows
    for (var i = 0; i < botnetData.length; i++) {
		console.log(botnetData[i].ip);
        row = statusTable.insertRow(i);
        row.innerHTML = "<td>" + botnetData[i].id + "</td><td>" + botnetData[i].ip + "</td><td>" + botnetData[i].workload + "</td>";
            
        if(botnetData[i].task === 0) {
			// inactive, button says start
			row.innerHTML += "<td><button type=\"button\">Start</button></td>";
		} else {
			// running, button says stop
			row.innerHTML += "<td><button type=\"button\">Stop</button></td>";
		}
	}
}



    
    
    
    
    



