$(document).ready(function() {

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

    function showMessage(isFbMessage, msg, isError){
        var element = $('#lg-messageCredentials');
        if(isFbMessage){
            element = $('#lg-messageFb');
        }
        if(isError){
            element.addClass("error");
        }
        var msgHtml = isError ? "<p class='error'>" : "<p>";
        msgHtml +=  msg + "<br /><br /> </p>";
        element.html(msgHtml);
    };

    function loginOrSignupWithFacebook(fbResponse, callback){location
        var env = getUrlParameter('env');
        var url = "https://loclet-api-prod.herokuapp.com/users";
        if(env && (env == 'dev' || env == 'local') ){
            url = "https://loclet-api-dev.herokuapp.com/users";
        }

        var fbToken;
        if(fbResponse && fbResponse.authResponse && fbResponse.authResponse.accessToken){
            fbToken = fbResponse.authResponse.accessToken;
        }
        if(!fbToken){
            return(false, "Anmeldeinformationen von Facebook inkorrekt");
        }

        $.ajax({
            type: "POST",
            url: url,
            data: {
               fbToken: fbToken
            },
            success: function(  user,  textStatus,  jqXHR ) {
                if(textStatus == 'success'){
                    storeUserToCookie(user);
                    window.location.replace("user.html" + window.location.search);
                }
            },
            error: function(  jqXHR,  textStatus,  errorThrown ){
                showMessage(true, "Fehler bei der Anmeldung mit Facebook", true);
            }
        });
    };

    function makeBaseAuth(user, pass) {
        var tok = user + ':' + pass;
        var hash = btoa(tok);
        return "Basic " + hash;
    };

    function loginWithCredentials(e){
        e.preventDefault();
        showMessage(false, "Anmelden...", false);
        showMessage(true, "", false);

        var username = $('#lg-username').val();
        var password = $('#lg-password').val();

        if(username.length == 0){
            showMessage(false, "Bitte gib einen Nutzernamen ein", true);
            return false;
        }

        if(password.length == 0){
            showMessage(false, "Bitte gib ein Passwort ein", true);
            return false;
        }

        var env = getUrlParameter('env');
        var url = "https://loclet-api-prod.herokuapp.com/authorizations";
        if(env && (env == 'dev' || env == 'local') ){
            url = "https://loclet-api-dev.herokuapp.com/authorizations";
        }

        var auth = makeBaseAuth(username, password);

        $.ajax({
            url: url,
            //contentType: 'application/json',

            method: 'POST',
            cache: false,
            headers: {
                'Authorization': auth
            },
            success: function(data) {
                console.log("login success:",data);
                var token = data;
                if(data.hasOwnProperty('token')){ //Support latest format of api result
                    token = data.token;
                }
                getLoginUserFromToken(token, function(user){
                    if(!user){
                        showMessage(false, 'Fehler bei der Anmeldung', true);
                        return;
                    }
                    storeUserToCookie(user);
                    window.location.replace("user.html" + window.location.search);
                });
            }.bind(this),
            error: function(xhr, status, err) {
               if( err == 'Unauthorized'){
                   showMessage(false, 'Nutzername oder Passwort ist ungültig', true);
               } else {
                   showMessage(false, 'Fehler bei der Anmeldung', true);
               }
            }.bind(this)
        });
    };

    function getLoginUserFromToken(token, callback){
        var env = getUrlParameter('env');
        var url = "https://loclet-api-prod.herokuapp.com/users/me";
        if(env && (env == 'dev' || env == 'local') ){
            url = "https://loclet-api-dev.herokuapp.com/users/me";
        }

        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Bearer '+token
            },
            method: 'GET',
            cache: true,
            success: function(data) {
                data.token = token;
                return callback(data);
            }.bind(this),
            error: function(xhr, status, err) {
                return callback();
            }.bind(this)
        });


    };

    function storeUserToCookie(user){
        //Only extract and store a few attributes
        var cookieUser = {};
        if( user.avatarPath) cookieUser.avatarPath = user.avatarPath;
        if( user.name) cookieUser.name = user.name;
        if( user.email) cookieUser.email = user.email;
        if( user.token) cookieUser.token = user.token;

        var env = getUrlParameter('env');
        var domain = '.loclet.com';
        if(env && env == 'local'){
            domain = '';
        }

        Cookies.set('loginUser', cookieUser, { domain: domain });
        //Cookies.set('loginUser', cookieUser);
    }

    $('#lg-fbLogin').css( 'cursor', 'pointer' );

    $('#lg-fbLogin').on('click', function() {
        showMessage(true, "Anmelden...", false);
        showMessage(false, "", false);
        FB.login(function(response) {
            // handle the response
           if(response && response.status && response.status === 'connected' && response.authResponse && response.authResponse.accessToken){
               loginOrSignupWithFacebook(response, function(res, error){
                   if(!res){
                       showMessage(error, true);
                   }
               });
           }
        }, {scope: 'public_profile,email,user_friends'});

    });

    $("#login-form").submit(loginWithCredentials);
    
});
