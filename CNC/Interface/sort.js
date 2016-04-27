/**
 * Created by AlouScha on 27.04.16.
 */

var sort = function (key) {

    botnetDataSortProp = key;

    if (botnetDataSortOrder === "asc") {
        botnetData.sort(byPropertyAsc(botnetDataSortProp));
        botnetDataSortOrder = "desc";
        console.log("status table sort: id descending");
    }else if (botnetDataSortOrder === "desc") {
        botnetData.sort(byPropertyDesc(botnetDataSortProp));
        botnetDataSortOrder = "asc";
        console.log("status table sort: id ascending");
    }

    updateStatusTable();
};

var byPropertyAsc = function (prop) {

    return function (a, b) {
        if (typeof a[prop] === 'string' || a[prop] instanceof String) {
            //für strings localCompare
            return a[prop].localeCompare(b[prop]);
        } else {
            //sonst für nummern
            return a[prop] - b[prop];
        }
    };
};

var byPropertyDesc = function (prop) {
    return function (a, b) {
        if (typeof a[prop] === 'string' || a[prop] instanceof String) {
            //für strings localCompare
            return b[prop].localeCompare(a[prop]);
        } else {
            //sonst für nummern
            return b[prop] - a[prop];
        }
    };
};