/**
 * TaskTabelle laden, Request an Server
 */


/**
 * Get tasks data from server.
 */
function taskRequest() {
    var xhr = cncXMLHttpRequest("GET", cncServerTasksURL);

    // onload event handler
    xhr.onload = function () {
		xhr.response.setCharacterEncoding = "utf-8";
		taskData = xhr.response;
        updateTaskTable();
    };

    xhr.send();
}

/**
 * Fill the tasks table.
 */
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
        row.innerHTML = "<td>" + taskData[i].id + "</td><td>" + taskData[i].type + "</td><td>" + taskData[i].data.input + "</td><td>" + taskData[i].data.output + "</td>";
    }

}

/**
 * Jump to the tasks page bottom.
 */
function scrollDown(){
    var taskTable = document.querySelector('#task-overview');
    window.scrollTo(0,taskTable.scrollHeight);
}

/**
 * Jump to the tasks page top.
 */
function scrollUp(){
    window.scrollTo(0,0);
}


/**
 * Delete a task on cnc.
 * WARNING: defunc
 */
var taskDelete = function(taskId) {
	console.log("task delete: id=" + taskId);
	
	var delData = {
		id: taskId,
		action: "delete"
	};
	
	var xhr = cncXMLHttpRequest("POST", cncServerTasksURL);
	
	xhr.onload = function() {
		xhr.response.setCharacterEncoding = "utf-8";
		
		if (this.status == 200) {
            if (xhr.response.message === "OK") {
                console.log("task delete: successfull");
			}
            else {
				console.log("task delete: not successfull");
			}
        }
	};
	
	console.log("task delete: sending " + JSON.stringify(delData));
	
	xhr.send(JSON.stringify(delData));
}


/**
 * Submit a new task to cnc using form element parameters.
 */
var tasksSubmitNewTask = function() {
	// get form values
	var taskId = document.getElementById("input_id").value;
	var taskData = document.getElementById("input_data").value;
	var taskType = document.getElementById("input_type").value;
	
	// validate task data
	if(taskData === "") {
		alert("Data must be set");
		
		return
	}
	
	
	var postData = {
		//id: parseInt(taskId),
		type: taskType,
		data: {
			input: taskData,
		}
	};
	
	console.log("task submit: id=" + taskId + " data=" + taskData + " type=" + taskType);
	
	var xhr = cncXMLHttpRequest("POST", cncServerTasksURL);
	
	xhr.onload = function() {
		xhr.response.setCharacterEncoding = "utf-8";
		
        if (this.status == 200) {
            if (xhr.response.message === "OK") {
                console.log("task submit: successfull");
                alert("task submit: successfull");
			}
            else {
				console.log("task submit: not successfull");
				alert("task submit: not successfull");
			}
        }
    };

	console.log("task submit: sending " + JSON.stringify(postData));
	
	xhr.send(JSON.stringify(postData));
}
