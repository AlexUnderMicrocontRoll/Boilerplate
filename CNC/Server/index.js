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


// status array
var status;

// tasks array
var tasks;



var jsonResponse = function(res, json) {
	//set Response header field Content-Type
	res.set('Content-Type', 'application/json; charset=utf-8');
	//sends Json response
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
 * Update one Status entry
 * @param reqId The Id of item wich should update
 * @returns {boolean} Returns true on success.
 */
var updateStatus = (reqBody)=> {
	var isFound = false;

	status.forEach((item) => {
        if (item.id == reqBody.id) {
            isFound = true;
            item.workload = reqBody.status === true ? 1 : 0;
        }
    });

    if (isFound) {
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
	console.log("Update task" + req.body.id);
	
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
        
    } else {
		// req.body.id is given, modify task
		var hasModified = false;
		tasks.forEach( (task) => {
			if(task.id == req.body.id) {
				console.log("task found" + task);
				task.type = req.body.type;
				task.data.input = req.body.data.input;
				//task.data.output = req.body.data.output;

				fs.writeFile('tasks.json', JSON.stringify(tasks));
				console.log("before return");
				hasModified = true;
				
			}
			
		});
		
		return hasModified;
		
    }

   
};


// GET:/api/Tasks ->> all Tasks
app.get('/api/Tasks', (req, res) => {
    console.log("tasks GET: /api/Tasks");

    jsonResponse(res, tasks);
});

// GET:/api/Tasks/:id ->> one task by id
app.get('/api/Tasks/:id', (req, res) => {
	console.log("tasks: /api/Tasks/:id " + req.params.id);

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

// POST:/apiTasks update one task by id set inside header
app.post('/api/Tasks', (req, res) => {
	console.log("tasks POST: /api/Tasks/");

	if(isRequestHeaderValid(req) && updateTask(req)) {
		respondOk(res);
	}
	else {
		respondNotOk(res);
	}
});


// GET:/apiStatus -> all status
app.get('/api/Status', (req, res) => {
	console.log("status GET: /api/Status/");
    jsonResponse(res, status);
});


// GET:/api/Status/:id -> get one Status by Id
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


//POST:/apiStatus -->> updates a existing Status
app.post('/api/Status', (req, res) => {
	console.log("status POST: /api/Status/");

	if(isRequestHeaderValid(req)) {

		 updateStatus(req.body) ? respondOk(res) : respondNotOk(res)
	}
	else {
		respondNotOk(res);
	}
});


// error handling
app.use( (err, req, res, next) => {
	console.log(err);
	respondNotOk(res);
	});


var readStatus = function() {
	console.log("status: reading status.json");

	fs.readFile(STATUS_FILE, function (err, data)
	{
		if (err) throw err;
		status = JSON.parse(data);
	});
}

var readTasks = function() {
	console.log("tasks: reading tasks.json");
	fs.readFile(TASKS_FILE, function (err, data)
	{
		if (err) throw err;
		tasks = JSON.parse(data);
	});
}



app.get('/api', (req, res) => {
	res.send("Hello cnc server");
})

var server = app.listen(3000, function() {
	readStatus();
	readTasks();

	
	var host = server.address().address;
	var port = server.address().port;

	console.log("cnc server listening at http://%s:%s", host, port);
});
