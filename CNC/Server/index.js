var express = require('express');
var app = express();
var parser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

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
	res.send('No task id given');
});

app.get('/api/Tasks/:id', (req, res) => {
	res.send('Task id was: ' + req.params.id);
});

// api status
app.get('/api/Status', (req, res) => {
	res.send('status list');
});

app.get('/api/Status/:id', (req, res) => {
	res.send('Task id was: ' + req.params.id);
});



app.post('/Tasks/:id', (req, res) => {
	console.log('Received data', req.body);
	res.json({message: 'UPDATE Task ' + req.params.id});
});

// error handling
app.use(function(err, req, res, next) {
	res.json({message: 'NOT OK'});
});

app.listen(3000);

