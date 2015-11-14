$(document).ready(function () {

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

    //----------------------------------------------

    // Mailchimp
    $('#newsletter-form').ajaxChimp({
        callback: showNewsletterSubscribeResult,
        url: 'http://loclet.us3.list-manage.com/subscribe/post?u=7ac7f0895cb6bc04f37df8a22&id=4d101a1d7e'
    });

    function showNewsletterSubscribeResult(resp) {
        console.log(resp);
        $("#mc-email").removeClass("error");
        if (resp.result === 'success') {
            $(".subscribe-message").html('<i class="fa fa-check"></i> Wir haben Dir eine Bestätigungsemail gesendet.').fadeIn().css("color", "#29b94f");
        }
        else {
            var msg = resp.msg.split("-")[1];
            $(".subscribe-message").html('<i class="fa fa-warning"></i> E-Mail-Adresse ungültig oder bereits registriert.').fadeIn().css("color", "#ef4b4b");
            $("#mc-email").addClass("error");
        }
    }

    $('#fbbutton').on('click', function () {
        FB.login(function (response) {
            // handle the response
            console.log(JSON.stringify(response));
        }, {scope: 'public_profile,email,user_friends'});

    });

    $('#fblogout').on('click', function () {
        FB.logout(function (response) {
            // Person is now logged out
            console.log(JSON.stringify(response));
        });

    });

    //---------------------------------------------

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

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

        $('.navbar-ex1-collapse').append("<li><a href='http://www.loclet.com/user.html" + window.location.search + "' title='Dein Nutzeraccount'>" + userName + "</a></li>");
    } else {
        $('.navbar-ex1-collapse').append("<li><a href='http://www.loclet.com/login.html" + window.location.search + "' title='Anmelden'>Anmelden</a></li>");
    }


});