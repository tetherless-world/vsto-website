/**
 * Created by westp on 2/27/17.
 */
function loadData(nextSelection) {
    if (!nextSelection) {
        clearAll();
        $("#nav-data").attr("class", "selected");
        sessionStorage.removeItem("alreadySelected");
        nextSelection = getQueryVariable("select");
    }
    $("#instrument-list").hide();
    $("#year-list").hide();
    $("#month-list").hide();
    $("#day-list").hide();
    $("#parameter-list").hide();
    $("#opendap-list").hide();

    console.log("nextSelection 1 = " + nextSelection);
    if (!nextSelection) nextSelection = "instrument";
    console.log("nextSelection 2 = " + nextSelection);

    var qs = "";
    var ndays = 0;
    var startYear = 0;
    var startMonth = 0;
    var startDay = 0;
    var endpoint = null;
    var current = '<div id="data-title" class="data-title">Current Selection</div>';
    var alreadySelected = JSON.parse(sessionStorage.getItem("alreadySelected"));
    if (alreadySelected) {
        $.each(alreadySelected, function (i, item) {
            qs += "&" + item.queryString.name + "=";
            values = item.queryString.values;
            var first = true;
            $.each(values, function (j, value) {
                if (!first) qs += ",";
                first = false;
                qs += value;
            });
            if(item.queryString.name == "ndays") {
                ndays = item.queryString.values[0];
            } else if(item.queryString.name == "year") {
                startYear = item.queryString.values[0];
            } else if(item.queryString.name == "month") {
                startMonth = item.queryString.values[0];
            } else if(item.queryString.name == "day") {
                startDay = item.queryString.values[0];
            }
            current += '<p class="current-item"><span class="current-title">' + item.display.name + '</span>: ' + item.display.values[0] + '</p>';
        });
        $("#current-selection").empty().append(current).show();
    }

    if(nextSelection == "instrument") {
        sessionStorage.setItem("selecting","instrument");
        console.log("making request");
        // ajax call to get the instruments
        // success parse the json
        // fail display error
        endpoint = "http://localhost:8080/instruments" + qs;
        console.log("endpoint = " + endpoint);
        $("#loading").show();
        $.ajax(endpoint, {
            type: "get",
            dataType: "json",
            success: function(data, status) {
                $("#loading").hide();
                console.log(JSON.stringify(data));
                var instruments = data.instruments;
                if(instruments) {
                    var html = '<div id="data-title" class="data-title">Select an Instrument</div>';
                    $.each(instruments, function(i, item) {
                       html += '<div id="instrument-div"><input type="radio" name="instrument" class="instrument-item" id="' + item.kinst + '"/><label for="' + item.kinst + '">' + item.kinst + ' - ' + item.name + ' - ' + item.class + '</label></div>';
                    });
                    $("#instrument-list").empty().append(html).show();
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                $("#loading").hide();
                console.error("query failed " + JSON.stringify(xhr));
                $("#request-error").empty().text("Request for the instrument list has failed, please try again later").show();
            }
        });
    } else if(nextSelection == "year") {
        sessionStorage.setItem("selecting","year");
        endpoint = "http://localhost/~westp/rstfl/catalog.php?system=cedar&request=years" + qs;
        console.log("endpoint = " + endpoint);
        $("#loading").show();
        $.ajax(endpoint, {
            type: "get",
            dataType: "text",
            success: function(data, status) {
                $("#loading").hide();
                var html = '<div id="data-title" class="data-title">Select a Year</div>';
                html += '<select class="option-items" size="5" name="years" id="years" required>';
                var years = data.split('\n');
                $.each(years, function (i, year) {
                    if (year != "") {
                        html += '<option class="option-item" id="' + year + '" value="' + year + '">' + year + '</option>';
                    }
                });
                html += '</select>';
                $("#year-list").empty().append(html).show();
            },
            error: function(xhr, textStatus, errorThrown) {
                $("#loading").hide();
                console.error("query failed " + JSON.stringify(xhr));
                $("#request-error").empty().text("Request for the list of years has failed, please try again later").show();
            }
        });
    } else if(nextSelection == "month") {
        sessionStorage.setItem("selecting","month");
        endpoint = "http://localhost/~westp/rstfl/catalog.php?system=cedar&request=months" + qs;
        console.log("endpoint = " + endpoint);
        $("#loading").show();
        $.ajax(endpoint, {
            type: "get",
            dataType: "text",
            success: function(data, status) {
                $("#loading").hide();
                var html = '<div id="data-title" class="data-title">Select a Month</div>';
                html += '<select class="option-items" size="5" name="months" id="months" required>';
                var months = data.split('\n');
                $.each(months, function (i, month) {
                    if (month != "") {
                        html += '<option class="option-item" id="' + month + '" value="' + month + '">' + month + '</option>';
                    }
                });
                html += '</select>';
                $("#month-list").empty().append(html).show();
            },
            error: function(xhr, textStatus, errorThrown) {
                $("#loading").hide();
                console.error("query failed " + JSON.stringify(xhr));
                $("#request-error").empty().text("Request for the list of months has failed, please try again later").show();
            }
        });
    } else if(nextSelection == "day") {
        sessionStorage.setItem("selecting","day");
        endpoint = "http://localhost/~westp/rstfl/catalog.php?system=cedar&request=days" + qs;
        console.log("endpoint = " + endpoint);
        $("#loading").show();
        $.ajax(endpoint, {
            type: "get",
            dataType: "text",
            success: function(data, status) {
                $("#loading").hide();
                var html = '<div id="data-title" class="data-title">Select a Day</div>';
                html += '<select class="option-items" size="5" name="days" id="days" required>';
                var days = data.split('\n');
                $.each(days, function (i, day) {
                    if (day != "") {
                        html += '<option class="option-item" id="' + day + '" value="' + day + '">' + day + '</option>';
                    }
                });
                html += '</select>';
                html += '<div id="num-days-title" class="data-title">Enter number of days</div>';
                html += '<input id="num-days" class="num-days" type="number" min="1" max="365" required/>';
                $("#day-list").empty().append(html).show();
            },
            error: function(xhr, textStatus, errorThrown) {
                $("#loading").hide();
                console.error("query failed " + JSON.stringify(xhr));
                $("#request-error").empty().text("Request for the list of months has failed, please try again later").show();
            }
        });
    } else if(nextSelection == "opendap") {
        sessionStorage.setItem("selecting","opendap");
        // get the startdateid
        // add the ndays to that
        // getFileList
        // given the list of files build the opendap URL's for das, dds, data, flat, tab, stream
        endpoint = "http://localhost/~westp/rstfl/catalog.php?system=cedar&request=dateid" + qs;
        console.log("endpoint = " + endpoint);
        $("#loading").show();
        $.ajax(endpoint, {
            type: "get",
            dataType: "text",
            success: function(data, status) {
                $("#loading").hide();
                console.log("success");
                var dateids = data.split('\n');
                if(dateids.length == 0) {
                    console.error("no dateid was returned " + data);
                } else {
                    var startdateid = parseInt(dateids[0]);
                    console.log("startdateid = " + startdateid);
                    var enddateid = startdateid + parseInt(ndays);
                    console.log("enddateid = " + enddateid);
                    qs += "&startdateid=" + startdateid + "&enddateid=" + enddateid;
                    endpoint = "http://localhost/~westp/rstfl/catalog.php?system=cedar&request=files" + qs;
                    console.log("endpoint = " + endpoint);
                    $("#loading").show();
                    $.ajax(endpoint, {
                        type: "get",
                        dataType: "text",
                        success: function (data, status) {
                            $("#loading").hide();
                            var startDate = new Date();
                            startDate.setYear(startYear);
                            startDate.setMonth(startMonth);
                            startDate.setDate(startDay);
                            console.log("startDate = ", startDate);
                            var endDate = startDate;
                            endDate.setDate(endDate.getDate() + parseInt(ndays));
                            console.log("endDate = ", endDate);
                            var html = '<div id="data-title" class="data-title">Select an Instrument</div>';
                            var firstFile = true;
                            var containers = "";
                            var constraints = "";
                            var files = data.split('\n');
                            $.each(files, function (i, file) {
                                if (file != "") {
                                    if(!firstFile) {
                                        containers += ",";
                                        constraints += ",";
                                    }
                                    firstFile = false;
                                    containers += file;
                                    constraints += file + '.constraint=date(' + startYear + '|' + twoDigit(startMonth) + twoDigit(startDay) + '|0|0|' + endDate.getFullYear() + '|' + twoDigit(endDate.getMonth()) + twoDigit(endDate.getDate()) + '|2359|5999)';
                                }
                            });
                            var start = "http://cedarweb.vsp.ucar.edu/opendap?request=define+d+as+" + containers;
                            var withConstraints = start + "+with+" + constraints;
                            var end = "+for+d;";
                            var das = start + ";get+das" + end;
                            var dds = withConstraints + ";get+dds" + end;
                            var dods = withConstraints + ";get+dods" + end;
                            var flat = withConstraints + ";get+flat" + end;
                            var tab = withConstraints + ";get+tab" + end;
                            var info = withConstraints + ";get+info" + end;
                            var stream = withConstraints + ";get+stream" + end;
                            html += '<p><a target="opendap" href="' + das + '">DAS</a> - Data Attributes</p>'
                            html += '<p><a target="opendap" href="' + dds + '">DDS</a> - Data Structure</p>'
                            html += '<p><a target="opendap" href="' + dods + '">DATA</a> - Data</p>'
                            html += '<p><a target="opendap" href="' + flat + '">FLAT</a> - Flat ascii</p>'
                            html += '<p><a target="opendap" href="' + tab + '">TAB</a> - Tab delimited ascii</p>'
                            html += '<p><a target="opendap" href="' + stream + '">STREAM</a> - Data streamed directly</p>'
                            html += '<p><a target="opendap" href="' + info + '">INFO</a> - Data information</p>'
                            $("#opendap-list").empty().append(html).show();
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $("#loading").hide();
                            console.error("query failed " + JSON.stringify(xhr));
                            $("#request-error").empty().text("Request for the list of files has failed, please try again later").show();
                        }
                    });
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                $("#loading").hide();
                console.error("query failed " + JSON.stringify(xhr));
                $("#request-error").empty().text("Request for the starting date id failed, please try again later").show();
            }
        });
    } else if(nextSelection == "parameter") {
        sessionStorage.setItem("selecting","parameter");
    } else {
        sessionStorage.removeItem("selecting");
        console.error("Requesting an invalid type " + request);
        $("#request-error").empty().text("The request " + request + " that you have made is invalid.").show();
    }
}

function continueOn() {
    var queryString = null;
    var display = null;
    var values = [];
    var displays = [];
    switch(sessionStorage.getItem("selecting")) {
        case "instrument":
            var checked = $("#instrument-list input:checked");
            if(checked.length == 0) {
                console.error("No instrument selections were made");
                $("#request-error").empty().text("Please select at least one instrument to proceed.").show();
            } else {
                $.each(checked, function(i, item) {
                    values.push(item.id);
                    displays.push(jQuery('label[for=' + item.id + ']').html());
                });
                queryString = {name: "kinst", values: values};
                display = {name: "Instruments", values: displays};
            }
            break;
        case "year":
            var year = $("#year-list option:selected");
            if(year.length == 0) {
                console.error("No year has been selected");
                $("#request-error").empty().text("Please select a year to proceed.").show();
            } else {
                year = year[0];
                queryString = {name: "year", values: [year.id]};
                display = {name: "Year", values: [year.id]};
            }
            break;
        case "month":
            var month = $("#month-list option:selected");
            if(month.length == 0) {
                console.error("No month has been selected");
                $("#request-error").empty().text("Please select a month to proceed.").show();
            } else {
                month = month[0];
                queryString = {name: "month", values: [month.id]};
                display = {name: "Month", values: [month.id]};
            }
            break;
        case "day":
            var day = $("#day-list option:selected");
            var ndays = $("#num-days").val();
            if(day.length == 0) {
                console.error("No day has been selected");
                $("#request-error").empty().text("Please select a day to proceed.").show();
            } else if(!ndays) {
                console.error("Number of days has not been entered");
                $("#request-error").empty().text("Please the number of days you want data for.").show();
            } else {
                day = day[0];
                queryString = {name: "day", values: [day.id]};
                display = {name: "Day", values: [day.id]};
                var newItem = {selection: sessionStorage.getItem("selecting"), queryString: queryString, display: display};
                var addSelected = JSON.parse(sessionStorage.getItem("alreadySelected"));
                addSelected.unshift(newItem);
                sessionStorage.setItem("alreadySelected", JSON.stringify(addSelected));
                queryString = {name: "ndays", values: [ndays]};
                display = {name: "Num Days", values: [ndays]};
            }
            break;
        default:
            break;
    }
    if(queryString) {
        var newItem = {selection: sessionStorage.getItem("selecting"), queryString: queryString, display: display};
        if (sessionStorage.getItem("alreadySelected")) {
            var addSelected = JSON.parse(sessionStorage.getItem("alreadySelected"));
            addSelected.unshift(newItem);
            sessionStorage.setItem("alreadySelected", JSON.stringify(addSelected));
        } else {
            var newSelected = [newItem];
            sessionStorage.setItem("alreadySelected", JSON.stringify(newSelected));
        }
        console.log("alreadySelected = " + sessionStorage.getItem("alreadySelected"));
        gotoNextSelection();
    } else if(sessionStorage.getItem("selecting") != "opendap") {
        console.error("Failed to handle current selection " + sessionStorage.getItem("selecting"));
        $("#request-error").empty().text("We have encountered a problem handling your request.").show();
    } else {
        gotoNextSelection();
    }
}

function gotoNextSelection() {
    var currentSelection = sessionStorage.getItem("selecting");
    var nextSelection = null;
    var alreadySelected = null;
    switch(currentSelection) {
        case "instrument":
            nextSelection = "year";
            break;
        case "year":
            nextSelection = "month";
            break;
        case "month":
            nextSelection = "day";
            break;
        case "day":
            nextSelection = "opendap";
            break;
        case "opendap":
            nextSelection = "parameter";
            alreadySelected = JSON.parse(sessionStorage.getItem("alreadySelected"));
            $.each(alreadySelected, function(i, item) {
               if(item.selection == "parameter") {
                   nextSelection = null;
               }
            });
            break;
        case "parameter":
            nextSelection = "instrument";
            alreadySelected = JSON.parse(sessionStorage.getItem("alreadySelected"));
            $.each(alreadySelected, function(i, item) {
                if(item.selection == "instrument") {
                    nextSelection = null;
                }
            });
            break;
        default:
            console.error("No place to continue to. Continue button should have not been available");
            $("#request-error").empty().text("We have encountered a problem handling your request.").show();
            break;
    }
    if(nextSelection) loadData(nextSelection);
}

function goBack() {
    // pop the action stack to see where to go back to
    // if there's nothing then re-display the data tab on index
    // pop the already selected stack and redisplay the already selected div
    // pop the query string stack
    var addSelected = JSON.parse(sessionStorage.getItem("alreadySelected"));
    console.log("alreadySelected before = " + JSON.stringify(addSelected));
    if(!addSelected || addSelected.length < 1) cancelSelect();
    else {
        var lastSelected = addSelected.shift();
        console.log("alreadySelected after = " + JSON.stringify(addSelected));
        $("#" + sessionStorage.getItem("selecting") + "-list").empty().hide();
        sessionStorage.setItem("selecting", lastSelected.selection);
        sessionStorage.setItem("alreadySelected", JSON.stringify(addSelected));
        if(lastSelected.selection == "day") {
            lastSelected = addSelected.shift();
            console.log("alreadySelected after = " + JSON.stringify(addSelected));
            $("#" + sessionStorage.getItem("selecting") + "-list").empty().hide();
            sessionStorage.setItem("selecting", lastSelected.selection);
            sessionStorage.setItem("alreadySelected", JSON.stringify(addSelected));
        }
        loadData(lastSelected.selection);
    }
}

function cancelSelect() {
    sessionStorage.removeItem("alreadySelected");
    $("#current-selection").empty();
    $("#instrument-list").empty();
    $("#year-select").empty();
    $("#month-select").empty();
    $("#day-select").empty();
    $("#parameter-select").empty();
    $("#opendap-select").empty();
    goToTab('data');
}

function twoDigit(num) {
    return (num < 10? "0"+num:num);
}
