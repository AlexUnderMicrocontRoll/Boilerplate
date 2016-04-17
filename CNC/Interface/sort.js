/**
 * Created by alexanderschaaf on 17.04.16.
 */
var xhr = new XMLHttpRequest();
var arr = null;
xhr.open("GET", "http://botnet.artificial.engineering:8080/api/Status", true);
xhr.send();


xhr.onload = function () {

    var data = null;

    try {
        data = JSON.parse(xhr.response);
    } catch (e) {
        console.error(e);
    }

    if (this.status == 200) {
        console.log(data[0].ip);
    }
    arr = data;
};

$(function() {
    $('#status-overview th').click(function() {
        var id = $(this).attr('id');
        var asc = (!$(this).attr('asc')); // switch the order, true if not set

        // set asc="asc" when sorted in ascending order
        $('#status-overview th').each(function() {
            $(this).removeAttr('asc');
        });
        if (asc) $(this).attr('asc', 'asc');

        sortResults(id, asc);
    });

    showResults();
});

function sortResults(prop, asc) {
    arr = arr.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]);
        else return (b[prop] > a[prop]);
    });
    showResults();
}

function showResults () {
    var html = '';
    for (var e in arr) {
        html += '<tr>'
            +'<td>'+arr[e].id+'</td>'
            +'<td>'+arr[e].ip+'</td>'
            +'<td>'+arr[e].workload+'</td>'
            +'<td>'+arr[e].task+'</td>'
            +'</tr>';
    }
    $('#status-overview-results').html(html);
}