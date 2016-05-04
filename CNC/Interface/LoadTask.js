/*
 mit fetch api Request
 https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
 */
//funktioniert noch nicht...fetch und promis API muss noch verstanden werden xD
var LoadTableTask = taskrequest()
{
    var myInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'json'//hoer können weitere header rein
        },
        mode: 'cors',
        cache: 'default'
    };

    var taskrequest = new Request('', myInit);
    fetch(taskrequest).then(function (response) {
        return //response.blob();
    }).then(function (response) {
        //var objectURL = URL.createObjectURL(response);
        //myImage.src = objectURL;
    });
}
