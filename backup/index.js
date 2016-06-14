var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require("fs");
var token = '031b46cd62bda614fffd542e20346821';

app.use((req, res, next) => {
    if (isRequestHeaderValid(req)) {
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

/**
 * check Request-Header for valid Token and Content-Type
 * @param req
 * @returns {boolean}
 */
var isRequestHeaderValid = (req)=> {
    if (req.get('Token') == token) {
        if (req.get('Content-Type') == 'application/json') {
            return true;
        }
    }
    return false;
};

/**
 * Set the Response Header ( Token, Content-Type)
 * @param res
 */
var setResponseHeader = (res)=> {
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.set('Token', '031b46cd62bda614fffd542e20346821');
};
/**
 * Rsesponds with status 200 and Message OK
 * @param res
 */
var respond_OK_Like = (res)=> {
    res.status = 200;
    res.json({"message": "OK"});
};

/**
 * Respond with status 400 and message NOT_OK
 * @param res
 */
var respond_NOTOK_Like = (res)=> {
    res.status = 400;
    res.json({"message": "NOT OK"});
}

/**
 * read all Status entry's from file
 * @param err
 * @param data JSON Data from file
 */
var readAllStati = function (err, data) {
    if (err) throw err;
    status = JSON.parse(data);
};

/**
 * Searches for one Item by ID param
 * @param reqId the ID to search by inside Status.json
 * @returns {*}
 */
var searchStatusByID = (reqId)=> {
    fs.readFile('status.json', readAllStati);
    return status.filter((stat) => (stat.id == reqId) ? true : false)
};

/**
 * Update one Status entry
 * @param reqId The Id of item wich should update
 * @returns {boolean} Returns true on success.
 */
var updateStatus = (reqId)=> {
    fs.readFile('status.json', readAllStati);
    var isFound = false;
    status.forEach((item)=> {
        if (item.id == reqId) {
            isFound = true;
            item.workload = item.workload ? 0 : 1;
        }
    });

    if (isFound){
        fs.writeFile('status.json', JSON.stringify(status));
        return true;
    }else{
        return false;
    }
};

/**
 * Read all Taks from tasks.json file
 * @param err
 * @param data Jason data from file
 */
var readAllTasks = function (err, data) {
    if (err) throw err;
    tasks = JSON.parse(data);
};

/**
 * Searche for one task by id
 * @param reqId the search id
 * @returns {*}
 */
var searchTasksByID = (reqId) => {
    fs.readFile('tasks.json', readAllTasks);
    return tasks.filter((task) => (task.id == reqId) ? true : false)
};

/**
 * Returns the next available ID (maxId +1)
 * @returns {number} maxId +1
 */
var getNextFreeId = ()=>{
    var maxId =0;
    tasks.forEach((item)=> {
        if (item.id > maxId) {
            maxId = item.id;
        }
    });
    console.log ('max id is '+ maxId);
    return maxId +1;
};

/**
 * Update a found taks if Id is given. Case Id not given
 * It calculates the next available Id and creates a new
 * task entry with submitted data.
 * @param req request with the data inside body
 * @returns {boolean}
 */
var updateTask = (req) => {

    fs.readFile('tasks.json', readAllTasks);
    if (req.body.id != 0){
        tasks.forEach((item)=> {
            if (item.id == req.body.id) {
                item.type =req.body.type;
                item.data = req.body.data;
                item.data.output = "d3b07384d113alex49eaa6238ad5ff00";
            }
        });
    }else{
        var maxId = getNextFreeId();
        tasks.push({id: maxId++,
            type: req.body.type,
             data: { input: req.body.data.input, output: " ---> Zukünftige Bot Eintrage hier ! <--"}
        });

    }

    fs.writeFile('tasks.json', JSON.stringify(tasks));

    return true;

};


// GET:/api/Tasks ->> all Tasks
app.get('/api/Tasks', (req, res) => {
    fs.readFile('tasks.json', readAllTasks);
    res.json(tasks);
    res.send();
});

// GET:/api/Tasks/:id ->> one task by id
app.get('/api/Tasks/:id', (req, res) => {
    foundItem = searchTasksByID(req.params.id);
    res.send(foundItem.length < 1 ? respond_NOTOK_Like(res) : foundItem );
});

// POST:/apiTasks update one task by id set inside header
app.post('/api/Tasks', (req, res) => {
    (updateTask(req)) ? respond_OK_Like(res) : respond_NOTOK_Like(res);
});

// GET:/apiStatus .>> all status
app.get('/api/Status', (req, res) => {
    fs.readFile('status.json', readAllStati);
    res.json(status);
});

// GET:/api/Status/:id ->> get one Status by Id
app.get('/api/Status/:id', (req, res) => {
    foundItem = searchStatusByID(req.params.id);
    res.send(foundItem.length < 1 ? respond_NOTOK_Like(res) : foundItem );
});

//POST:/apiStatus -->> updates a existing Status
app.post('/api/Status', (req, res) => {
    updateStatus(req.body.id) ? respond_OK_Like(res) : respond_NOTOK_Like(res)
});

// error handling
app.use( (err, req, res, next) => respond_NOTOK_Like(res));


app.listen(3000);
