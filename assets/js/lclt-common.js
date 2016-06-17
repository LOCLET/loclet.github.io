'use strict';

/**
 * A collection of common utility functions to be shared across different parts
 * of the LOCLET website, exposed in the global scope as `LCLT`.
 *
 * Namespace pattern taken from http://stackoverflow.com/a/881611/3601658
 * (keeping things simple for now).
 */

window.LCLT = new function LCLT() {

    var self = this;

    /**
     * Retrieves the API URL of a specific endpoint (for the current
     * environment, as specified by the optional query parameter `env` in the
     * current page context).
     *
     * @param {string} endpoint desired endpoint (**must** include a leading
     *        slash)
     * @return {string} the full endpoint URL
     */
    this.getApiUrl = function getApiUrl(endpoint) {
        var env = self.getQueryArg('env');
        var baseUrl = 'https://loclet-api-prod.herokuapp.com';
        switch (env) {
            case 'beta':
                baseUrl = 'https://loclet-api-beta.herokuapp.com';
                break;
            case 'dev':
            case 'local':
                baseUrl = 'https://loclet-api-dev.herokuapp.com';
                break;
        }
        return baseUrl + endpoint;
    };


    /**
     * Retrieves a single parameter from the URL query string of the current
     * page. Assumes the parameters are separated with ampersands and does not
     * handle advanced cases like multiple values per key. URL-decodes the
     * resulting value by default.
     *
     * NB: This is quite inefficient, so don't use it in loops etc.
     *
     * @param {string} name key of the parameter to retrieve
     * @param {boolean} [raw] when `true`, the value is **not** URL-decoded
     * @returns {string|boolean|undefined} the requested parameter when
     *          available, `undefined` if it isn't, or `true` in the special
     *          case where the key is present in the query string without a
     *          value
     */
    this.getQueryArg = function getQueryArg(name, raw) {
        var tokens = window.location.search.substring(1).split('&');
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i].split('=');
            if (token[0] === name) {
                // return true for "flags" without a value (e.g. b in '?a=1&b'),
                // otherwise the given value
                if (token[1] === undefined) return true;
                return raw ? token[1] : decodeURIComponent(token[1]);
            }
        }
    };

    /**
     * Retrieves the API access token of the currently logged-in user.
     *
     * @returns {string|undefined} the access token or `undefined` when no user
     *          is currently logged in
     */
    this.getUserToken = function getUserToken() {
        var user = Cookies.getJSON('loginUser');
        if (typeof user === 'object' && user !== null) {
            return user.token;
        }
    };

    /**
     * Performs an authenticated LOCLET API call, expecting the API access token
     * to be available in a cookie. The call is executed in the environment
     * specified by the query parameter `env` in the current page context.
     *
     * @param {object} options parameters for the API call
     * @param {string} [options.method] HTTP method to use (`GET` by default)
     * @param {string} options.endpoint API endpoint to invoke; must start with
     *        a slash
     * @param {function} callback Node-style error-first callback; in case of an
     *        error, the returned error object *may* contain an additional
     *        message from the server in a `serverMsg` property
     */
    this.apiCall = function apiCall(options, callback) {
        var method = options.method || 'GET';
        var token = this.getUserToken();
        return $.ajax({
            type: method,
            url: this.getApiUrl(options.endpoint),
            headers: {Authorization: 'Bearer ' + token},
            success: function onSuccess(res, textStatus, jqXHR) {
                return callback(null, res);
            },
            error: function onError(jqXHR, textStatus, errorThrown) {
                var msg = textStatus;
                if (typeof errorThrown === 'string') {
                    msg += ': ' + errorThrown;
                }
                var err = new Error(msg);
                if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    err.serverMsg = jqXHR.responseJSON.message;
                }
                return callback(err);
            },
        });
    };

    /**
     * Convenience function for GET API calls.
     * @see apiCall
     */
    this.apiGet = function apiGet(endpoint, callback) {
        return this.apiCall({endpoint: endpoint}, callback);
    };

    /**
     * Convenience function for POST API calls.
     * @see apiCall
     */
    this.apiPost = function apiPost(endpoint, callback) {
        return this.apiCall({method: 'POST', endpoint: endpoint}, callback);
    };
};
