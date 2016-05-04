//TaskTabelle laden, Request an Server
function taskrequest(){

  var xhr2 = new XMLHttpRequest();

  xhr2.open('GET', 'http://botnet.artificial.engineering:8080/api/tasks',true);
  xhr2.setRequestHeader('Token', '031b46cd62bda614fffd542e20346821');
  xhr2.setRequestHeader('Content-Type','application/json');
  xhr2.responseType = 'json';
  // onload event handler
    xhr2.onload = function () {
		// try to parse response to json
        try {
			// TODO xhr.response.setCharacterEncoding("UTF-8");
            taskData = JSON.parse(xhr2.response);
        } catch (e) {
            console.error(e);
        }
        console.log(taskData);
    };

  xhr2.send();
};
