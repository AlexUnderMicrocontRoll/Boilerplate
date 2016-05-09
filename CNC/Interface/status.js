/**
 * Requests botnet data from CNC Server, adds it to status table.
 *
 * @author Alex, Sai, Tobi
 */


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
			row.innerHTML += "<td><button class=\"button\" type=\"button\" onclick=\"statusButtonClicked(this.id)\" id=\"statusQueue_" + botnetData[i].id + "\">▶</button></td>";
		} else {
			// if running, button says stop
			row.innerHTML += "<td><button class=\"button\" type=\"button\" onclick=\"statusButtonClicked(this.id)\" id=\"statusQueue_" + botnetData[i].id + "\">⏸</button></td>";
		}
	}
}

/**
 * Start/stop button is clicked, appropriate start/stop operation is called
 */
var statusButtonClicked = function(buttonId) {
	console.log("status button of id " + buttonId + " clicked");

	for (var i = 0; i < botnetData.length; i++) {
        if("statusQueue_" + botnetData[i].id === buttonId) {
			if (botnetData[i].workload === 0) { 
				// task is inactive
				console.log(botnetData[i].id + " is inactive, activating");
				document.getElementById(buttonId).innerHTML = "<i>activating...</i>";
				statusQueueOperation(botnetData[i].id, "start");
			}
			else { 
				// task is active
				console.log(botnetData[i].id + " is active, deactivating");
				document.getElementById(buttonId).innerHTML = "<i>deactivating...</i>";
				statusQueueOperation(botnetData[i].id, "stop");
			}
        }
	}
}

/**
 * Start/stop given task
 */
var statusQueueOperation = function(taskID, action) {
	console.log("id " + taskID + ": sending " + action + " to cnc server");
	
	var xhr = cncXMLHttpRequest("POST", cncServerStatusURL);

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
	
	xhr.onload = function() {
		xhr.response.setCharacterEncoding = "utf-8";
        if (this.status == 200) {
            if (xhr.response.message === "OK") {
                console.log("task queue operation: successfull");
			}
            else {
				console.log("task queue operation: not successfull");
			}
        }
    };

	console.log(task);

    xhr.send(JSON.stringify(task));
}
