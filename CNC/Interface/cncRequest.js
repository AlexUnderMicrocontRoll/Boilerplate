/**
 * Requests botnet data from CNC Server, adds it to status table.
 * 
 * @author Alex, Sai, Tobi
 */

// cnc server URI
var cncServer = "http://botnet.artificial.engineering:8080/api/Status";
var periodicReload;

var botnetData;


/**
 * Enables periodic data requests from cnc server.
 */
var enablePeriodicCNCRequest = function() {
    periodicReload = setInterval(function(){cncServerRequest();}, 10000);
    console.log("periodic cnc request: started");
};


/**
 * Disables periodic data requests from cnc server.
 * 
 */
var disablePeriodicCNCRequest = function() {
	clearTimeout(periodicReload);
	console.log("periodic cnc request: stopped");
};


/**
 * Requests botnet status data from cnc server.
 */
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
        
        sortBotnetData();
		updateStatusTable();
        console.log("cnc server bot list reloaded");
    };
};

/**
 * Clears a html table.
 */
function clearTable(table) {
    var rows = table.rows;
    var i = rows.length - 1;
    
    for( var k = i; k >= 0; k--){
        table.deleteRow(k);
    }
}

/**
 * Updates status table with botnet status data.
 */
function updateStatusTable() {
	var statusTable = document.querySelector('#status-overview-results');
    var row = null;
        
	// empty table if already filled
    if (statusTable.childElementCount > 0){
		clearTable(statusTable);
    }

	// fill table with new table rows
    for (var i = 0; i < botnetData.length; i++) {
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



    
    
    


