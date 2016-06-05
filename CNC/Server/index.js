var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require("fs");
var token = '031b46cd62bda614fffd542e20346821';

app.use((req, res, next) => {
    if (validateRequestHeader(req)) {
        return next();
    }
    res.status(403).end("invalid token");
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// status array
var status;

// tasks array
var tasks;

//check Request-Header
var validateRequestHeader = (req)=> {
    if (req.get('Token') == token) {
        if (req.get('Content-Type') == 'application/json') {
            return true;
        }
    }
    return false;
};

//set Response-Header
var setResponseHeader = (res)=> {
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.set('Token', '031b46cd62bda614fffd542e20346821');
};

var respondOKLike = (res)=> {
    res.status = 200;
    console.log(res);
    res.json({message: 'OK'});
};

var respond_NOTOK_Like = (res)=> {
    res.status = 400;
    console.log(res);
    res.json({message: 'NOT OK'});
}

var statusRead = function (err, data) {
    if (err) throw err;
    status = JSON.parse(data);
};

var searchStatusByID = (reqId)=> {
    fs.readFile('status.json', statusRead);
    return status.filter((stat) => (stat.id == reqId) ? true : false)
};


var updateStatus = (reqId)=> {
    fs.readFile('status.json', statusRead);
    status.forEach((item)=> {
        if (item.id == reqId) {
            item.workload = item.workload ? 0 : 1;
        }
    });
    return JSON.stringify(status);
};

var tasksRead = function (err, data) {
    if (err) throw err;
    tasks = JSON.parse(data);
};

var searchTasksByID = (reqId) => {
    fs.readFile('tasks.json', statusRead);
    return status.filter((task) => (task.id == reqId) ? true : false)
};

var updateTask = (reqId) => {
    fs.readFile('status.json', tasksRead);
    status.forEach((item)=> {
        if (item.id == reqId) {
            item.workload = item.workload ? 0 : 1;
        }
    });
    return JSON.stringify(status);
};


app.post('/Tasks/:id', (req, res) => {
    console.log('Received data', req.body);
    res.json({message: 'UPDATE Task ' + req.params.id});
});

// api tasks array
app.get('/api/Tasks', (req, res) => {
    //res.send('No task id given');

    fs.readFile('tasks.json', tasksRead);
    res.json(tasks);
    res.send();
});

app.get('/api/Tasks/:id', (req, res) => {
    res.send('get Task id was: ' + req.params.id);
});

app.post('/Tasks/:id', (req, res) => {
    console.log('Received data', req.body);
    res.json({message: 'UPDATE Task ' + req.params.id});
});

// api status
app.get('/api/Status', (req, res) => {
    fs.readFile('status.json', statusRead);
    res.json(status);
});

app.get('/api/Status/:id', (req, res) => {
    res.send(searchStatusByID(req.params.id));
});

app.post('/api/Status', (req, res) => {
    fs.writeFile('status.json', updateStatus(req.body.id));
    respondOKLike(res);
});

// error handling
app.use(function (err, req, res, next) {
    respond_NOTOK_Like(res);
});


app.listen(3000);
