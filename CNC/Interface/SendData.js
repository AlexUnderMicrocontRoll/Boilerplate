//-	Start/stop button mit „Postrequest“
//status(start/stop) muss noch abgefragt werden damit beim stop nicht gesendet wird 
start_stop_button = function Postrequest_Task(button_id){
/*
//wohin gesendet wird muss noch festgelegt werden und wie der header sein soll
if (status=='0'){
	var xhr2 = new XMLHttpRequest();
	xhr2.open('POST', '/server', true);
	xhr2.setRequestHeader('header', 'value');
	xhr2.responseType = 'text';
	xhr2.onload = function(e) {
	if (this.status == 200) {
	console.log(this.response);
	 }
	};
 xhr2.send(objekt);
 }
*/
	for (var i=0;i<document.getElementsByTagName('TD').length; i++){
		if (button_id==document.getElementsByTagName("TD")[i].textContent){
			var id= document.getElementsByTagName("TD")[i+1].textContent;
			var ip= document.getElementsByTagName("TD")[i+2].textContent;
			var workload=document.getElementsByTagName("TD")[i+3].textContent;
			var objekt = {
				id: 'id',
				ip: 'ip',
			  workload:'workload'
			};

		}
	}
};


//formular daten senden, das nur werte einmal pro eingabe gesendet werden kann muss noch abgefangen werden und werte muss noch validiert
//werden
var data = function send_data(){

var id = document.forms["tasks_form"]["id"].value;
var type = document.forms["tasks_form"]["type"].value;
var data = document.forms["tasks_form"]["data"].value;
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
};

/*
function validateForm() {
  //hier plausibilitäts prüfung machen wenn zeit ist
    var x = document.forms["myForm"]["fname"].value;
    if (x == null || x == "") {
        alert("Name must be filled out");
        return false;
    }
}
*/
