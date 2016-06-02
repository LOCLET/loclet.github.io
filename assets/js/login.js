'use strict';

$(document).ready(function () {

    function getApiUrl(endpoint) {
        var env = getUrlParameter('env');
        var baseUrl = 'https://loclet-api-prod.herokuapp.com';
        if (env === 'dev' || env === 'local') {
            baseUrl = 'https://loclet-api-dev.herokuapp.com';
        }
        return baseUrl + endpoint;
    }

    function postLoginRedirect() {
        var target = getUrlParameter('sso') ? 'sso.html' : 'user.html';
        window.location.replace(target + window.location.search);
    }

    function getUrlParameter(sParam) {
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
    }

    function showMessage(isFbMessage, msg, isError) {
        var element = $('#lg-messageCredentials');
        if (isFbMessage) {
            element = $('#lg-messageFb');
        }
        if (isError) {
            element.addClass('error');
        }
        var msgHtml = isError ? '<p class="error">' : '<p>';
        msgHtml += msg + '<br /><br /> </p>';
        element.html(msgHtml);
    }

    function loginOrSignupWithFacebook(fbResponse, callback) {
        var fbToken;
        if (fbResponse && fbResponse.authResponse &&
            fbResponse.authResponse.accessToken) {
            fbToken = fbResponse.authResponse.accessToken;
        }
        if (!fbToken) {
            return 'Anmeldeinformationen von Facebook inkorrekt';
        }
        $.ajax({
            type: 'POST',
            url: getApiUrl('/users'),
            data: {fbToken: fbToken},
            success: function (user, textStatus, jqXHR) {
                if (textStatus === 'success') {
                    storeUserToCookie(user);
                    postLoginRedirect();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showMessage(true, 'Fehler bei der Anmeldung mit Facebook', true);
            },
        });
    }

    function makeBaseAuth(user, pass) {
        return 'Basic ' + btoa(user + ':' + pass);
    }

    function loginWithCredentials(e) {
        e.preventDefault();
        showMessage(false, 'Anmelden...', false);
        showMessage(true, '', false);
        var username = $('#lg-username').val();
        var password = $('#lg-password').val();
        if (username.length === 0) {
            showMessage(false, 'Bitte gib einen Nutzernamen ein', true);
            return false;
        }
        if (password.length === 0) {
            showMessage(false, 'Bitte gib ein Passwort ein', true);
            return false;
        }
        $.ajax({
            url: getApiUrl('/authorizations'),
            method: 'POST',
            cache: false,
            headers: {Authorization: makeBaseAuth(username, password)},
            success: function (data) {
                getLoginUserFromToken(data.token, function (user) {
                    if (!user) {
                        showMessage(false, 'Fehler bei der Anmeldung', true);
                        return;
                    }
                    storeUserToCookie(user);
                    postLoginRedirect();
                });
            }.bind(this),
            error: function (xhr, status, err) {
                if (err === 'Unauthorized') {
                    showMessage(false, 'Nutzername oder Passwort ist ungültig', true);
                }
                else {
                    showMessage(false, 'Fehler bei der Anmeldung', true);
                }
            }.bind(this),
        });
    }

    function getLoginUserFromToken(token, callback) {
        $.ajax({
            url: getApiUrl('/users/me'),
            headers: {Authorization: 'Bearer ' + token},
            method: 'GET',
            cache: true,
            success: function (data) {
                data.token = token;
                return callback(data);
            }.bind(this),
            error: function (xhr, status, err) {
                return callback();
            }.bind(this),
        });
    }

    function storeUserToCookie(user) {
        // only extract and store a few attributes
        var cookieUser = {};
        if (user.avatarPath) cookieUser.avatarPath = user.avatarPath;
        if (user.name) cookieUser.name = user.name;
        if (user.email) cookieUser.email = user.email;
        if (user.token) cookieUser.token = user.token;
        var domain = getUrlParameter('env') === 'local' ? '' : '.loclet.com';
        Cookies.set('loginUser', cookieUser, {domain: domain});
    }

    $('#lg-fbLogin').css('cursor', 'pointer');

    $('#lg-fbLogin').on('click', function () {
        showMessage(true, 'Anmelden...', false);
        showMessage(false, '', false);
        FB.login(function (response) {
            if (response && response.status === 'connected' &&
                response.authResponse && response.authResponse.accessToken) {
                loginOrSignupWithFacebook(response, function (res, error) {
                    if (!res) {
                        showMessage(error, true);
                    }
                });
            }
        }, {scope: 'public_profile,email,user_friends'});
    });

    $('#login-form').submit(loginWithCredentials);
});
