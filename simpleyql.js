/*
 * SimpleYQL
 *
 * A wrapper for YQL that currently just attempts to simplify the process
 * of fetching HTML content from URLs
 *
 * Example usage:
 *
 * SimpleYQL.debug = true;
 *
 * url = "http://www.google.com"
 *
 * // Query: select * from html where url='http://www.google.com'
 * SimpleYQL.get(url, function(results) {
 *   results // { body: ... }
 * });
 *
 * // Query: select * from html where url='http://www.google.com' and xpath='//input[@name="btnI"]'
 * SimpleYQL.get(url, '//input[@name="btnI"]', function(results) {
 *   results.input.value // "I'm Feeling Lucky"
 * });
 *
 * // Query: select value from html where url='http://www.google.com' and xpath='//input[@name=\"btnI\"]'
 * SimpleYQL.get(url, {what: 'value', xpath: '//input[@name="btnI"]'}, function(results) {
 *   // Same deal, but this only has the value attribute in the result set
 *   results.input.value // "I'm Feeling Lucky"
 * });
 *
 *
 * @requires jQuery
 *
 * Copyright 2010, Raine Virta
 * Released under MIT license
 */

SimpleYQL = function() {
  var yql_base_uri = "http://query.yahooapis.com/v1/public/yql";

  var helpers = {
    toQueryString: function(obj) {
      var parts = [];
      for(var each in obj) if (obj.hasOwnProperty(each)) {
        parts.push(encodeURIComponent(each) + '=' + encodeURIComponent(obj[each]));
      }
      return parts.join('&');
    },

    toURI: function(baseURI, queryString) {
      if (arguments.length > 1) {
        return [baseURI, helpers.toQueryString(queryString)].join("?");
      } else {
        return baseURI;
      }
    }
  };

  return {
    debug: false,
    helpers: helpers,
    get: function(url, opts, callback) {
      var options = {
        xpath: null,
        what: '*'
      };

      var type = typeof opts;
      // opts is the callback function
      if (type == 'function') {
        callback = opts;

      // opts is XPath location
      } else if (type == 'string') {
        options.xpath = opts;

      } else if (type == 'object') {
        jQuery.extend(options, opts);
      }

      var query = "select " + options.what + " from html where url='" + url + "'";

      if (options.xpath) {
        query += " and xpath='" + options.xpath + "'";
      }

      var params = {
        q: query,
        diagnostics: 'false',
        format: 'json'
      };

      if (this.debug) {
        console.debug(params);
      };

      var uri = helpers.toURI(yql_base_uri, params) + "&callback=?";
      jQuery.getJSON(uri, function(data) {
        callback(data.query.results);
      });
    }
  }
}();
