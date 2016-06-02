'use strict';

/**
 * The `sso.html` page serves as a bridge between Discourse (expected to be at
 * `https://forum.loclet.com`) and the website/content editor login mechanism.
 *
 * If no user is currently logged in, the client is redirected to the login
 * page, which (after a successful login) redirects back here, preserving any
 * SSO-related query parameters. If login information is already available (in
 * a cookie), that step is skipped.
 * The code below then sends the SSO nonce provided by Discourse to the LOCLET
 * API server, which returns the corresponding signed user data. Finally, the
 * client is redirected to the Discourse SSO login endpoint, including that user
 * data in the query string again.
 *
 * A more detailed explanation of the process can be found here:
 * https://meta.discourse.org/t/official-single-sign-on-for-discourse/13045
 */

$(document).ready(function () {

    var token = LCLT.getUserToken();
    if (!token) {
        // redirect to login page
        window.location.replace('login.html' + window.location.search);
        return;
    }
    // retrieve signed user data
    var payload = LCLT.getQueryArg('sso', true);
    var sig = LCLT.getQueryArg('sig', true);
    var url = '/users/me?resultType=full&dssoPayload=' + payload + '&dssoSig=' + sig;
    LCLT.apiGet(url, function callback(err, user) {
        $('#spinner').hide();
        if (err) {
            var msg = 'Fehler beim Abrufen der Zugangsdaten für das Forum.';
            if (err.serverMsg) {
                msg += '<br />Server sagt: <em>' + err.serverMsg + '</em>';
            }
            $('#errorMsg').html(msg);
            return;
        }
        // yay! redirect back to forum
        window.location.replace('https://forum.loclet.com/session/sso_login?' +
            'sso=' + user.dssoPayload + '&sig=' + user.dssoSig);
    });
});
