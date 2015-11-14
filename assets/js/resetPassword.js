(function ($) {

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1));
        var sUrlVariables = sPageURL.split('&');
        var sParameterName;
        var i;
        for (i = 0; i < sUrlVariables.length; i++) {
            sParameterName = sUrlVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function showMessage(msg, isError) {
        if (isError) $("#rp-message").addClass("error");
        $("#rp-message").html(msg);
    }

    // E-mail validation
    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
    }

    function initiateReset(e) {
        showMessage("Senden...", false);
        e.preventDefault();

        var email = $("#rp-email").val();
        if (!isValidEmailAddress(email)) {
            showMessage("Die eingegebene Email-Adresse hat ein ungültiges Format.", true);
            return false;
        }
        var emailEncode = encodeURIComponent(email);
        var env = getUrlParameter('env');
        var url = "https://loclet-api-prod.herokuapp.com/users/" + emailEncode;
        if (env && env == 'dev')
            url = "https://loclet-api-dev.herokuapp.com/users/" + emailEncode;
        console.log('URL: ' + url);

        var data = JSON.stringify({password: null});

        $.ajax({
            method: 'PUT',
            url: url,
            data: data,
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                console.log(JSON.stringify(data));
                showMessage("Wir haben Dir eine E-Mail zum Zurücksetzen Deines Passworts gesendet. <b>Bitte überpüfe  auch Deinen Spam-Ordner.</b>");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                showMessage("Beim Zugriff auf unseren Server gab es ein Problem. Sollte das bestehen bleiben, kontaktiere bitte support@loclet.com.", true);
            }
        });
    }

    function doReset(e) {
        showMessage("Senden...", false);
        e.preventDefault();

        //Validate passwords entered
        var password = $("#rp-password").val();
        if (!password) {
            showMessage("Bitte trage ein neues Passwort ein.", true);
            return false;
        }
        password = password.trim();

        var passwordRepeated = $("#rp-password-repeated").val();
        if (!passwordRepeated) {
            showMessage("Bitte wiederhole das Passwort.", true);
            return false;
        }
        passwordRepeated = passwordRepeated.trim();

        if (password != passwordRepeated) {
            showMessage("Passwort und Passwort-Wiederholung stimmen nicht überein.", true);
            return false;
        }

        var token = window.location.hash.substr(1);
        try {
            var decoded = jwt_decode(token);
        }
        catch (err) {
            showMessage("Fehler bei der Analyse des Aufrufparameters. Dein Passwort kann nicht zurückgesetzt werden.", true);
            return false;
        }

        if (!decoded.hasOwnProperty('userId')) {
            showMessage("Diese Seite wurde nicht korrekt aufgerufen. Der übergebene Aufrufparamter konnte nicht analysiert werden.", true);
            return false;
        }

        var userId = decoded.userId;

        var env = getUrlParameter('env');
        var url = "https://loclet-api-prod.herokuapp.com/users/" + userId
        if (env && env == 'dev') {
            url = "https://loclet-api-dev.herokuapp.com/users/" + userId;
        }

        //Now as we got the userId, let's call the api to reset the password
        var putData = {
            pwResetToken: token,
            password: password
        };
        putData = JSON.stringify(putData);

        $.ajax({
            type: "PUT",
            url: url,
            data: putData,
            contentType: 'application/json',
            success: function (data, textStatus, jqXHR) {
                showMessage("Dein neues Passwort wurde übernommen.");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var message;
                if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    message = "Der Server meldet: " + jqXHR.responseJSON.message;
                } else {
                    message = "Ein Fehler ist aufgetreten. Sollte das Problem weiterhin bestehen bleiben, kontaktiere support@loclet.com";
                }
                showMessage(message, true);
            }
        });
    }

    function initDialog() {
        var token = window.location.hash.substr(1);
        if (!token) {
            //Set visibility of input fields
            $("#rp-email-div").show();
            $("#rp-password-div").hide();
            $("#rp-password-repeated-div").hide();
            $("#reset-password-form").submit(initiateReset);

            //Add passed data into input field
            var email = getUrlParameter('email');
            if (email) {
                $("#rp-email").val(email);
            }
        } else {
            var error;
            //Check if token has proper format
            try {
                var decoded = jwt_decode(token);
            }
            catch (err) {
                error = "Der übergebene Aufrufparamter konnte nicht analysiert werden. Um Dein Passwort zurück zu setzen gib hier erneut die EMail-Adresse Deines LOCLET-Kontos ein.";
            }

            if (!error) {
                if (!decoded.hasOwnProperty('userId')) {
                    error = "Der übergebene Aufrufparamter konnte nicht analysiert werden. Um Dein Passwort zurück zu setzen gib hier erneut die EMail-Adresse Deines LOCLET-Kontos ein.";
                }
            }

            if (!error) {
                //Check if token has expired
                if (decoded.exp && (decoded.exp >= Date.now())) {
                    error = "Der Bestätigungsschlüssel ist leider abgelaufen. Starte das Zurücksetzen Deines Kennworts hier erneut."
                }
            }

            if (!error) {
                $("#rp-headline").text("Gib nun ein neues Passwort für Dein LOCLET-Konto ein.")
                $("#rp-email-div").hide();
                $("#rp-password-div").show();
                $("#rp-password-repeated-div").show();
                $("#reset-password-form").submit(doReset);
            } else {
                $("#rp-email-div").show();
                $("#rp-password-div").hide();
                $("#rp-password-repeated-div").hide();
                $("#reset-password-form").submit(initiateReset);
                showMessage(error, true);
            }
        }
    }

    initDialog();

})(jQuery);