var express = require('express');
var app = express();
var parser = require('body-parser');
var cors = require('cors');
var fs = require("fs");

app.use(cors());
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

// status array
var status;

// tasks array
var tasks;

var statusRead = function (err, data) {
    if (err) throw err;

    console.log("statusRead: " + data);

    status = JSON.parse(data);
};



var tasksRead = function (err, data) {
    if (err) throw err;

    console.log("tasksRead: " + data);

    tasks = JSON.parse(data);
};
var findById = function () {
    return fruit.name === 'cherries';
}

app.post('/Tasks/:id', (req, res) => {
    console.log('Received data', req.body);
    res.json({message: 'UPDATE Task ' + req.params.id});
});


// botnet page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// api tasks array 
app.get('/api/Tasks', (req, res) => {
    //res.send('No task id given');

    fs.readFile('tasks.json', tasksRead);
    res.json(tasks);
    res.send();
});

app.get('/api/Tasks/:id', (req, res) => {
    res.send('Task id was: ' + req.params.id);
});

// api status
app.get('/api/Status', (req, res) => {
    fs.readFile('status.json', statusRead);

    res.json(status);

    res.send();
});

app.get('/api/Status/:id', (req, res) => {
    fs.readFile('status.json', statusRead);
    res.send( status.filter((status) => (status.id == req.params.id)? true :false ))
});

app.post('/api/Status/:id', (req, res) => {
    res.send('Status id was: ' + req.params.id);
});


app.post('/Tasks/:id', (req, res) => {
    console.log('Received data', req.body);
    res.json({message: 'UPDATE Task ' + req.params.id});
});

// error handling
app.use(function (err, req, res, next) {
    res.json({message: 'NOT OK'});
});


app.listen(3000);

