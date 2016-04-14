/*! screenbot v0.1.0 - 2016-04-14 
 *  License: Apache-2.0 */
var Screenbot = (function Screenbot() {
  // Error codes
  var CLIENT_UNAVAILABLE = { code: 1, message: 'Screenbot isn\'t running' },
      NO_DATA_RECEIVED = { code: 2, message: 'No data received' },
      PARSE_ERROR = { code: 3, message: 'Error parsing response' };

  // These commands available as methods
  var COMMANDS = [
    'ping', // Check whether the Screenbot app is running and connected
    [ 'activate', '' ], // Take a screenshot (aliased)
    'shot', // Take a screenshot
    'draw', // Create an annotation
    'cast', // Create a screencast
    'clip' // Upload your clipboard
  ];

  function _generateCurriedCommand(command) {
    return function(cb) { this.command(command, cb); };
  }

  function _parseResponse(responseText){
    var response;
    try {
      response = JSON.parse(responseText);
      if(!response.ok) return new ScreenbotError(CLIENT_UNAVAILABLE, response);
    }
    catch (e) {
      return new ScreenbotError(PARSE_ERROR);
    }
    return response;
  }

  function _request(endpoint, cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        var response = _parseResponse(xhttp.responseText);
        if(response instanceof Error) cb(response);
        cb(null, response);
      } else if(xhttp.readyState === 4) {
        // Return an error if the status is not 200 and there is nothing in the response
        if(xhttp.responseText === "") return cb(new ScreenbotError(NO_DATA_RECEIVED));
      }
    };
    xhttp.open("GET", endpoint, true);
    xhttp.send();
  }

  function ScreenbotError(args, originalException){
    Error.call(this);
    this.name = 'Screenbot Error';
    this.code = args.code;
    this.message = args.message || 'An error has occurred';
    this.originalException = originalException;
  }

  ScreenbotError.prototype = Object.create(Error.prototype);
  ScreenbotError.prototype.constructor = ScreenbotError;

  function ScreenbotConstructor(token, args) {
    if(typeof args === 'undefined') args = {};

    this.source = null; // Our EventSource connection
    this.token = token || null; // Our Screenbot token
    this.service = args.service || 'sdk';
    this.host = args.host || 'https://app.screenbot.io';
  }

  ScreenbotConstructor.prototype._endpoint = function(command){
    return this.host +
           "/api/services/" +
           this.service +
           "/command?token=" +
           this.token +
           "&text=" +
           command;
  };

  ScreenbotConstructor.prototype._response_endpoint = function(channel_token){
    return this.host +
           "/api/services/" +
           this.service +
           "/response?channel_token=" +
           channel_token;
  };

  ScreenbotConstructor.prototype._setEventSourceTimer = function(){
    return setTimeout(function(){
      this.source.close();
    }.bind(this), 2000);
  };

  ScreenbotConstructor.prototype.command = function(command, cb) {
    console.log("Source: " + this.source);

    _request(this._endpoint(command), function(err, result) {
      if(err) return cb(err);
      // Return response for 'ping' command
      if('connected' in result) return cb(null, { connected: result.connected });

      if(this.source && this.source.readyState !== 2) {
        this.source.close();
      }

      this.source = new EventSource(this._response_endpoint(result.token));
      var timeoutID = this._setEventSourceTimer();

      this.source.onmessage = function(event) {
        clearTimeout(timeoutID);
        this.source.close();

        if(event.data === "0" || !event.data.length) return cb(new ScreenbotError(NO_DATA_RECEIVED));

        var eventData = { url: event.data };
        cb(null, eventData);
      }.bind(this);
    }.bind(this));
  };

  // Export each command's method
  COMMANDS.forEach(function(cmd) {
    if(cmd instanceof Array)
      ScreenbotConstructor.prototype[cmd[0]] = _generateCurriedCommand(cmd[1]);
    else
      ScreenbotConstructor.prototype[cmd] = _generateCurriedCommand([cmd]);
  });

  // Return the constructor
  return ScreenbotConstructor;
}());
