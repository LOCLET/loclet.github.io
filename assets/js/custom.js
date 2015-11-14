(function ($) {

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

})(jQuery);