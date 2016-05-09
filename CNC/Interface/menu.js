/**
 * Sidemenu active entry highlighting.
 */


/**
 * Highlight status entry when active.
 */
var menuActiveStatusEntry = function() {
	document.getElementById("menu_status").style.backgroundColor = "#2ecc71";
	document.getElementById("menu_tasks").style.backgroundColor = "#2980b9";
}

/**
 * Highlight tasks entry when active.
 */
var menuActiveTasksEntry = function() {
	document.getElementById("menu_tasks").style.backgroundColor = "#2ecc71";
	document.getElementById("menu_status").style.backgroundColor = "#2980b9";
}

/**
 * Jump to statuts anchor.
 */
var menuGotoStatus = function() {
	menuActiveStatusEntry();
	
	// go to #status on page load
	window.location.href = "#status";
}
