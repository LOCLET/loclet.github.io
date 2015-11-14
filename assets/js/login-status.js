(function ($) {

    //--------------------------------------------
    // Facebook login state

    $.getScript('//connect.facebook.net/de_DE/sdk.js', function () {
        FB.init({
            appId: '1467545976875896',
            version: 'v2.4'
        });
        FB.getLoginStatus(function (response) {
            if (response.status && response.status === 'connected' && response.authResponse && response.authResponse.accessToken) {
                //Someone is obviously logged in, check who
            }
        });
    });

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1));
        var sUrlVariables = sPageURL.split('&');
        var sParameterName;
        for (var i = 0; i < sUrlVariables.length; i++) {
            sParameterName = sUrlVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    // //Check login state and adjust navbar accordingly
    var loginUser = Cookies.getJSON('loginUser');
    if (loginUser && loginUser.name) {
        //User is logged in --> adapt navbar
        var userName = loginUser.name;
        var env = getUrlParameter('env');
        if (env && (env == 'local' || env == 'dev')) {
            userName = userName + ' (dev)';
        }
        $('#menu').append('<li><a href="http://www.loclet.com/user.html' + window.location.search +
            '" title="Dein Nutzeraccount">' + userName + '</a></li>');
    } else {
        $('#menu').append('<li><a href="http://www.loclet.com/login.html' + window.location.search +
            '" title="Anmelden">Anmelden</a></li>');
    }

})(jQuery);