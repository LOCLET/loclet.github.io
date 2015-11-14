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

    function showMessage(msg, isError){
            if(isError){
                $("#emailConfirmationFeedback").addClass("error");
            }
            var msgHtml = isError ? "<p class='error'>" : "<p>";
            msgHtml +=  msg + "<br /><br /> </p>";
            $("#emailConfirmationFeedback").html(msgHtml);
    };

    function confirmEmail(){
        var token = window.location.hash.substr(1);

        if(!token){
            showMessage("Diese Seite wurde nicht korrekt aufgerufen. Die Email-Adresse konnte aufgrund eines fehlenden Aufrufparameters nicht bestätigt werden.", true);
            return false;
        }

        try {
            var decoded = jwt_decode(token);
        }
        catch(err) {
            showMessage("Diese Seite wurde nicht korrekt aufgerufen. Der übergebene Aufrufparamter konnte nicht analysiert werden.", true);
            return false;
        }
        if( !decoded.hasOwnProperty('userId')){
            showMessage("Diese Seite wurde nicht korrekt aufgerufen. Der übergebene Aufrufparamter konnte nicht analysiert werden.", true);
            return false;
        }
        var userId = decoded.userId;

        //Check if token has expired
        if(decoded.exp && (decoded.exp >= Date.now())){
            showMessage("Der Bestätigungsschlüssel ist leider abgelaufen. Bitte trage deine Email-Adresse erneut in der App ein.", true);
            return false;
        }

        //Now as we got the userId, let's call the api to confirm the email address
        var putData = {
            emailConfirmToken: token
        };
        putData = JSON.stringify(putData);

        var env = getUrlParameter('env');
        var url = "https://loclet-api-prod.herokuapp.com/users/" + userId;
        if(env && env == 'dev'){
            url = "https://loclet-api-dev.herokuapp.com/users/" + userId;
        }


        $.ajax({
            type: "PUT",
            url: url,
            data: putData,
            contentType: 'application/json',
            success: function( data, textStatus, jqXHR){
                //ToDo: TEST!!
                showMessage("Deine Email-Adresse wurde bestätigt!");
            },
            error: function( jqXHR,  textStatus,  errorThrown){
                showMessage("Bei der Bestätigung Deiner Email-Adresse ist leider ein Fehler aufgetreten. Bitte trage Dein Email-Adresse erneut in der App ein.", true);
            }
        });

    }


    confirmEmail();


       
      
 
});
