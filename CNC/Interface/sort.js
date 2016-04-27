/**
 * Responsible for sorting of botnetData.
 * 
 * @author Alex, Sai, Tobi
 */

var botnetDataSortProp = "id";	// id/ip/workload/task
var botnetDataSortOrder = "asc"; // ascending, descending sort order

/**
 * Switches botnet data sort order between ascending and descending.
 */
var swapBotnetDataSortOrder = function() {
	if(botnetDataSortOrder === "asc") {
        botnetDataSortOrder = "desc";
    }
    else if (botnetDataSortOrder === "desc") {
        botnetDataSortOrder = "asc";
    }
    else {
		console.log("warning: status table sort order should be either asc or desc");
	}
};


/**
 * Sets sorting property and refreshes the status table.
 */
var setSorting = function(property) {
	botnetDataSortProp = property;
	
	swapBotnetDataSortOrder();
	sortBotnetData();
    updateStatusTable();
};


/**
 * Sorts botnet data appropriately.
 */
var sortBotnetData = function() {
    if(botnetDataSortOrder === "asc") {
        botnetData.sort(byPropertyAsc(botnetDataSortProp));
    }
    else if (botnetDataSortOrder === "desc") {
        botnetData.sort(byPropertyDesc(botnetDataSortProp));
    }
};


/**
 * Ascending compare function.
 * @prop prop property of the object used for comparison
 */
var byPropertyAsc = function(prop) {
    return function(a,b) {
            if (typeof a[prop] === 'string' || a[prop] instanceof String){
                //für strings localCompare
                return a[prop].localeCompare(b[prop]);
            }else{
                //sonst für nummern
                return a[prop] - b[prop];
            }
    };
};


/**
 * Descending compare function.
 * @prop prop property of the object used for comparison
 */
var byPropertyDesc = function(prop) {
    return function (a, b) {
            if (typeof a[prop] === 'string' || a[prop] instanceof String){
                //für strings localCompare
                return b[prop].localeCompare(a[prop]);
            }else{
                //sonst für nummern
                return b[prop] - a[prop];
            }
    };
};
