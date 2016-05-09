/**
 * cnc connection handling.
 *
 * @author Alex, Sai, Tobi
 */
 
 // cnc server URI
var cncServer = "http://botnet.artificial.engineering:8080/api";
var cncServerStatusURL = cncServer + "/Status";
var cncServerTasksURL = cncServer + "/Tasks";

// used for periodic reloads of status table
var periodicReload;
var periodicReloadDelay = 5000;

// contains status table data
var botnetData;

// contains task table data
var taskData;

// group token (very secret) ;-)
var token =  '031b46cd62bda614fffd542e20346821';


/**
 * Create a xhr object with required headers.
 */
var cncXMLHttpRequest = function(httpMethod, cncURL) {
	var xhr = new XMLHttpRequest();
    xhr.open(httpMethod, cncURL, true);
    
	xhr.setRequestHeader('Token', token);
	xhr.setRequestHeader('Content-Type','application/json');
	xhr.responseType = 'json';

	// error event handler
	xhr.onerror = function() {
		console.error(xhr.statusText);
	};

	// timeout event handler
	xhr.ontimeout = function() {
		console.error(xhr.statusText);
	};

	return xhr;
}

/**
 * Enables periodic data requests from cnc server.
 */
var enablePeriodicCNCRequest = function() {
    periodicReload = setInterval(function(){cncServerRequest();}, periodicReloadDelay);
    console.log("periodic cnc request: started");
};


/**
 * Disables periodic data requests from cnc server.
 *
 */
var disablePeriodicCNCRequest = function() {
	taskRequest();
	clearTimeout(periodicReload);
	console.log("periodic cnc request: stopped");
};


/**
 * Requests botnet status data from cnc server.
 */
var cncServerRequest = function() {
	var xhr = cncXMLHttpRequest("GET", cncServerStatusURL);

	// onload event handler
    xhr.onload = function() {
		xhr.response.setCharacterEncoding = "utf-8";
		botnetData = xhr.response;
	
        sortBotnetData();
        updateStatusTable();
        console.log("cnc server bot list reloaded");
    };
    
	xhr.send();
};
