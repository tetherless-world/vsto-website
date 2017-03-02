/**
 * Created by westp on 2/27/17.
 */
function loadData() {
    console.log("I am here");
    var request = getQueryVariable("select");
    console.log("request 1 = " + request);
    if(!request) request="instrument";
    console.log("request 2 = " + request);

    if(request == "instrument") {
        console.log("making request");
        // ajax call to get the instruments
        // success parse the json
        // fail display error
        $.ajax("http://localhost:8080/instruments", {
            type: "get",
            dataType: "json",
            success: function(data, status) {
                console.log(JSON.stringify(data));
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("query failed " + JSON.stringify(xhr));
            }
        });
    }
}

