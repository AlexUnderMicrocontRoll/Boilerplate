//Formular validieren und senden an Server mit konfigurierten Header + token
function sendDataToServer(){

	var result_Validate_Form = validateForm();

	if(result_Validate_Form){
				var id = document.forms["taskform"]["id"].value;
				var type = document.forms["taskform"]["type"].value
				var data = document.forms["taskform"]["data"].value;

				var objekt = JSON.stringify({'id': id, 'type': type, data: {'input':  data, 'output': null}});

				var xhr2 = new XMLHttpRequest();
				xhr2.open('POST', 'http://botnet.artificial.engineering:8080/api/tasks', true);
				xhr2.setRequestHeader('Token', '031b46cd62bda614fffd542e20346821');
				xhr2.send(objekt);

				xhr2.onreadystatechange = function() {
				console.log(xhr2.readyState);
				console.log(xhr2.status);
    			if (xhr2.readyState == 4 && xhr2.status == 200) {
      			alert("funktioniert");
    				}
  				};

					
				console.log(xhr2.responseText);

	}
};

function validateForm() {
	var form_Value = false;
	//var id = document.forms["tasksform"]["id"].value;
	var data = document.forms["taskform"]["data"].value;

	/*
	Falls Plausibilitätsprüfung von IP verlangt wird.
    if (!id.match('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')) {
        alert("Bitte ID richtig eingeben");
        return false;
    }
	*/
		if (data == null || data == "") {
				alert("Keine Daten vorhanden, Bitte Daten eingeben");
		}else{
			form_Value=true;
			alert('Validierung erfolgreich');
		}
		return form_Value;
};
