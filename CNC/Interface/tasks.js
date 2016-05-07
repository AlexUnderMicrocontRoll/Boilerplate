//TaskTabelle laden, Request an Server
var taskData;
function taskrequest() {

    var xhr2 = new XMLHttpRequest();

    xhr2.open('GET', 'http://botnet.artificial.engineering:8080/api/tasks', true);
    xhr2.setRequestHeader('Token', '031b46cd62bda614fffd542e20346821');
    xhr2.setRequestHeader('Content-Type', 'application/json');
    xhr2.responseType = 'json';
    // onload event handler
    xhr2.onload = function () {
        // try to parse response to json
        try {
            xhr2.response.setCharacterEncoding = "utf-8";
            taskData = xhr2.response;
        } catch (e) {
            console.error(e);
        }
        console.log(taskData);
    };

    xhr2.send();
    updateTaskTable();
};

function updateTaskTable() {
    var taskTable = document.querySelector('#task-overview-results');
    var row = null;

    // empty table if already filled
    if (taskTable.childElementCount > 0) {
        clearTable(taskTable);
    }

    // fill table with new table rows
    for (var i = 0; i < taskData.length; i++) {
        row = taskTable.insertRow(i);
        row.innerHTML = "<td>" + taskData[i].id + "</td><td>" + taskData[i].type + "</td><td>" + taskData[i].input + "</td><td>" + taskData[i].output + "</td>";
    }
}
