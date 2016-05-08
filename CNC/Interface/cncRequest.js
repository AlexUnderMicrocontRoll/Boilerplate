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
    periodicReload = setInterval(function(){cncServerRequest();}, 3000);
    console.log("periodic cnc request: started");
};


/**
 * Disables periodic data requests from cnc server.
 *
 */
var disablePeriodicCNCRequest = function() {
  taskrequest();
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
        row.innerHTML = "<td>" + botnetData[i].id + "</td><td>" + botnetData[i].ip + "</td><td>" + botnetData[i].workload + "</td><td>" + botnetData[i].task + "</td>";

        if(botnetData[i].workload === 0) {
			// if inactive, button says start
			row.innerHTML += "<td><button class=\"button\" type=\"button\" onclick=\"statusButtonClicked(this.id)\" id=\"statusTask_" + botnetData[i].id + "\">▶</button></td>";
		} else {
			// if running, button says stop
			row.innerHTML += "<td><button class=\"button\" type=\"button\" onclick=\"statusButtonClicked(this.id)\" id=\"statusTask_" + botnetData[i].id + "\">⏸</button></td>";
		}
	}
}

var statusButtonClicked = function(buttonId) {
	console.log("status button of id " + buttonId + " clicked");

	for (var i = 0; i < botnetData.length; i++) {
        if("statusTask_" + botnetData[i].id === buttonId) {
			if (botnetData[i].workload === 0) { // task is inactive
				console.log(botnetData[i].id + " is inactive, activating");
				document.getElementById(buttonId).innerHTML = "<i>activating...</i>";
				statusTaskOperation(botnetData[i].id, "start");
			}
			else { // task is active
				console.log(botnetData[i].id + " is active, deactivating");
				document.getElementById(buttonId).innerHTML = "<i>deactivating...</i>";
				statusTaskOperation(botnetData[i].id, "stop");
			}
        }
	}
}


var statusTaskOperation = function(taskID, action) {
	// TODO testen wenn weniger Leute auf CNC
	console.log("id " + taskID + ": sending " + action + " to cnc server");
	var xhr = new XMLHttpRequest();

    xhr.open("POST", cncServer);
    xhr.responseType = "json";
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.setRequestHeader("Token", "031b46cd62bda614fffd542e20346821");

	if(action === "stop") {
		var task = {
			"id": taskID,
			"status": false
		};
	}
	else if(action === "start") {
		var task = {
			"id": taskID,
			"status": true
		};
	}

	console.log(task);

    xhr.send(JSON.stringify(task));
}
