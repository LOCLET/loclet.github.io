(function ($) {

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1));
        var sURLVariables = sPageURL.split('&');
        var sParameterName;
        for (var i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function showMessage(isFbMessage, msg, isError) {
        var element = $('#lg-messageCredentials');
        if (isFbMessage) {
            element = $('#lg-messageFb');
        }
        if (isError) {
            element.addClass("error");
        }
        var msgHtml = isError ? "<p class='error'>" : "<p>";
        msgHtml += msg + "<br /><br /> </p>";
        element.html(msgHtml);
    }

    function getLoginUserFromToken(token, callback) {
        var env = getUrlParameter('env');
        var url = "https://loclet-api-prod.herokuapp.com/users/me?resultType=full";
        if (env && (env == 'dev' || env == 'local')) {
            url = "https://loclet-api-dev.herokuapp.com/users/me?resultType=full";
        }

        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            method: 'GET',
            cache: true,
            success: function (data) {
                data.token = token;
                return callback(data);
            }.bind(this),
            error: function (xhr, status, err) {
                return callback();
            }.bind(this)
        });
    }

    function userCanEdit(user) {
        //Check if user already hast created loclets (regardless of pen)
        if (user.hasOwnProperty('created') && user.created.length > 0) {
            return true;
        }
        //Check for pen
        if (user.hasOwnProperty('inventory')) {
            for (var i = 0; i < user.inventory.length; i++) {
                if (user.inventory[i].hasOwnProperty('id') && user.invetory[i].id === 'pen') {
                    return true;
                }
            }
        }
        return false;
    }

    //Get information for logged in user
    var user = Cookies.getJSON('loginUser');
    if (!user || !user.token) {
        //No one logged in --> refer to login page
        window.location.replace('login.html' + window.location.search);
        return;
    }
    getLoginUserFromToken(user.token, function (loginUser) {
        if (!loginUser) {
            window.location.replace('login.html' + window.location.search);
            return;
        }
        //Add user information to page
        var cdn = "http://cdn.loclet.com/";
        var avatar = cdn + user.avatarPath;

        $('#usr-information').append("<img height='256' width='256'src='" + avatar + "'>");
        $('#usr-information').append('<h3>' + user.name + '</h3>');

        //Check if user is eligible to editor
        if (userCanEdit(loginUser)) {
            $('#us-editor').html('<a style="margin-top: 20px" href="./editor/' + window.location.search +'">Meine Loclets</a>');
        }
    });

    var env = getUrlParameter('env');
    var domain = '.loclet.com';
    if (env && env == 'local') {
        domain = '';
    }
    $('#usr-logout').on('click', function () {
        Cookies.remove('loginUser', {domain: domain});
        window.location.replace('login.html' + window.location.search);
    });

})(jQuery);