//formular daten senden, das nur werte einmal pro eingabe gesendet werden kann muss noch abgefangen werden und werte muss noch validiert
//werden...
var data = function send_data(){

var result_Validate_Form = validateForm();

if(result_Validate_Form){
var id = document.forms["tasksform"]["id"].value;
var type = document.forms["tasksform"]["type"].value;
var data = document.forms["tasksform"]["data"].value;
JSON.stringify(id,type,data);
var objekt = {
	id: id,
	type: type,//type?
	data: {
		input:  data,
		output: null
	}

}
/*
var xhr2 = new XMLHttpRequest();
  xhr2.open('POST', '/server', true);
  xhr2.responseType = 'json';
	xhr2.setRequestHeader('header', 'value');
  xhr.onload = function(e) {
    if (this.status == 200) {
      console.log(this.response);
    }
  };
  xhr.send(objekt);
}*/
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
