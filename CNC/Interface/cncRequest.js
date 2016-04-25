/**
 * Requests botnet data from CNC Server, adds it to status table.
 * 
 * @author Alex, Sai, Tobi
 */

// cnc server URI
var cncServer = "http://botnet.artificial.engineering:8080/api/Status";
var stop_reload; // TODO rename


var botnetData;
var botnetDataSortType = "id";
var botnetDataSortOrder = "asc"; // asc, desc


var initializePageReload = function() {
	console.log("periodic page reload started");
    stop_reload= setInterval(function(){cncServerRequest();}, 10000);
};

var Reloadstop = function() {
	clearTimeout(stop_reload);
};

//shorter version******
var sort = function(key){
    botnetDataSortType = key;

    if(botnetDataSortOrder === "asc") {
        botnetDataSortOrder = "desc";
        console.log("status table sort: id descending");
    }
    else if (botnetDataSortOrder === "desc") {
        botnetDataSortOrder = "asc";
        console.log("status table sort: id ascending");
    }
    updateStatusTable();
};

var byPropertyDesc = function(prop) {
    return function(a,b) {
        if (a[prop] > b[prop])
            return -1;
        else if (a[prop] < b[prop])
            return 1;
        else
            return 0;
    };
};

var byPropertyAsc = function(prop) {
    return function(a,b) {
        if (a[prop] < b[prop])
            return -1;
        else if (a[prop] > b[prop])
            return 1;
        else
            return 0;
    };
};
//** shorter version

// redundant code ??? wie denkt ihr??
/*var sortIP = function() {
	botnetDataSortType = "ip";
	
	if(botnetDataSortOrder === "asc") {
		botnetDataSortOrder = "desc";
		console.log("status table sort: ip descending");
	}
	else if (botnetDataSortOrder === "desc") {
		botnetDataSortOrder = "asc";
		console.log("status table sort: ip ascending");

	}
	
	// update status table
	updateStatusTable();
};


var sortID = function() {
	botnetDataSortType = "id";
	
	if(botnetDataSortOrder === "asc") {
		botnetDataSortOrder = "desc";
		console.log("status table sort: id descending");
	}
	else if (botnetDataSortOrder === "desc") {
		botnetDataSortOrder = "asc";
		console.log("status table sort: id ascending");
	}
	
	// update status table
	updateStatusTable();
};

var sortWorkload = function() {
	botnetDataSortType = "workload";
	
	if(botnetDataSortOrder === "asc") {
		botnetDataSortOrder = "desc";
		console.log("status table sort: workload descending");
	}
	else if (botnetDataSortOrder === "desc") {
		botnetDataSortOrder = "asc";
		console.log("status table sort: workload ascending");
	}
	
	// update status table
	updateStatusTable();
};

function compareIdDesc(a,b) {
  if (a.id > b.id)
    return -1;
  else if (a.id < b.id)
    return 1;
  else 
    return 0;
};

function compareIdAsc(a,b) {
  if (a.id < b.id)
    return -1;
  else if (a.id > b.id)
    return 1;
  else 
    return 0;
};

function compareIpDesc(a,b) {
  if (a.ip > b.ip)
    return -1;
  else if (a.ip < b.ip)
    return 1;
  else 
    return 0;
};

function compareIpAsc(a,b) {
  if (a.ip < b.ip)
    return -1;
  else if (a.ip > b.ip)
    return 1;
  else 
    return 0;
};

function compareWorkloadDesc(a,b) {
  if (a.workload > b.workload)
    return -1;
  else if (a.workload < b.workload)
    return 1;
  else 
    return 0;
};

function compareWorkloadAsc(a,b) {
  if (a.workload < b.workload)
    return -1;
  else if (a.workload > b.workload)
    return 1;
  else 
    return 0;
};*/
//**************************** redundant code<----

function sortBotnetData() {
	if(botnetDataSortType === "id") {
		if(botnetDataSortOrder === "asc") {
			botnetData.sort(byPropertyAsc("id"));
		}
		else if(botnetDataSortOrder === "desc") {
			botnetData.sort(byPropertyDesc("id"));
		}
	}
	else if(botnetDataSortType === "ip") {
		if(botnetDataSortOrder === "asc") {
			botnetData.sort(byPropertyAsc("ip"));
		}
		else if(botnetDataSortOrder === "desc") {
			botnetData.sort(byPropertyDesc("ip"));
		}
	}
	else if(botnetDataSortType === "workload") {
		if(botnetDataSortOrder === "asc") {
			botnetData.sort(byPropertyAsc("workload"));
		}
		else if(botnetDataSortOrder === "desc") {
			botnetData.sort(byPropertyDesc("workload"));
		}
		
	}
}




/**
 * 
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
        
		updateStatusTable();
		
        
        
        
        console.log("cnc server bot list reloaded")
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
        
    sortBotnetData();

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



    
    
    
    
    



