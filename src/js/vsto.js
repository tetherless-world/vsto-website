/**
 * Created by westp on 2/19/17.
 */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

function clearAll() {
    $("#vsto-home").hide();
    $("#vsto-data").hide();
    $("#vsto-communities").hide();
    $("#vsto-about").hide();
    $("#vsto-login").hide();

    $("#nav-home").attr("class", "notselected");
    $("#nav-data").attr("class", "notselected");
    $("#nav-communities").attr("class", "notselected");
    $("#nav-about").attr("class", "notselected");
    $("#nav-login").attr("class", "notselected");
}
function goHome() {
    clearAll();
    $(document).prop('title', 'Virtual Solar Terrestrial Observatory');
    $("#vsto-home").show();
    $("#nav-home").attr("class", "selected");
}

function goToData() {
    clearAll();
    $(document).prop('title', 'Access VSTO Data');
    $("#vsto-data").show();
    $("#nav-data").attr("class", "selected");
}

function goToCommunities() {
    clearAll();
    $(document).prop('title', 'VSTO Communities');
    $("#vsto-communities").show();
    $("#nav-communities").attr("class", "selected");
}

function goToAbout() {
    clearAll();
    $(document).prop('title', 'VSTO Communities');
    $("#vsto-about").show();
    $("#nav-about").attr("class", "selected");
}

function goToLoginout() {
    clearAll();
    $(document).prop('title', 'VSTO Data Login / Logout');
    $("#vsto-login").show();
    $("#nav-login").attr("class", "selected");
}

function goToTab(show) {
    if(window.location.pathname.indexOf("index") == -1) {
        var qsShow = "";
        if(show) qsShow = "?show=" + show;
        window.location.replace(props.rootDir + "/index" + qsShow);
    } else {
        var showTab = show;
        if (!show) showTab = getQueryVariable("show");
        switch (showTab) {
            case "home":
                goHome();
                break;
            case "data":
                goToData();
                break;
            case "communities":
                goToCommunities();
                break;
            case "about":
                goToAbout();
                break;
            case "login":
                goToLoginout();
                break;
            default:
                goHome();
                break;
        }
    }
}

$(document).ready(function() {
    $("#navbar").css("background-image", 'url("' + props.rootDir + '/images/header.jpg")');
});
