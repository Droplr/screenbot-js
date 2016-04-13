var ERROR_CODES = {
  CLIENT_UNAVAILABLE: { code: 1, message: 'Screenbot isn\'t running' },
  NO_DATA_RECEIVED: { code: 2, message: 'No data received' },
  PARSE_ERROR: { code: 3, message: 'Error parsing response' }
};

var Screenbot = (function Screenbot() {
  var _parseResponse = function(responseText){
    var response;
    try {
      response = JSON.parse(responseText);
    }
    catch (e) {
      return _handleError({ code: ERROR_CODES.PARSE_ERROR.code });
    }

    return response;
  };

  var _request = function(endpoint, cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        var response = _parseResponse(xhttp.responseText);
        if(response instanceof Error || !response.ok) cb(response);

        cb(null, response);
      } else if(xhttp.readyState === 4) {
        cb(_parseResponse(xhttp.responseText));
      }
    };
    xhttp.open("GET", endpoint, true);
    xhttp.send();
  };

  var _handleError = function(args){
    return new ScreenbotError(args.code, args.message);
  };

  var ScreenbotError = function(code, message){
    Error.call(this);
    this.name = 'Screenbot Error';
    this.code = code;
    this.message = message || findErrorMessage(code) || 'An error has occurred';

    function findErrorMessage(code) {
      for (var error in ERROR_CODES) {
        if (ERROR_CODES.hasOwnProperty(error)) {
          var currentError = ERROR_CODES[error];
          if(currentError.code === code) return currentError.message;
        }
      }
    }
  };

  ScreenbotError.prototype = Object.create(Error.prototype);
  ScreenbotError.prototype.constructor = ScreenbotError;

  function ScreenbotConstructor(token, args) {
    if(typeof args === 'undefined') args = {};

    this.source = null; // Our EventSource connection
    this.token = token || null; // Our Screenbot token
    this.service = args.service || 'sdk';
    this.host = args.host || 'https://app.screenbot.io';

    this.endpoint = function(command){
      return this.host +
             "/api/services/" +
             this.service +
             "/command?token=" +
             this.token +
             "&text=" +
             command;
    };

    this.response_endpoint = function(channel_token){
      return this.host +
             "/api/services/" +
             this.service +
             "/response?channel_token=" +
             channel_token;
    };
  }

  ScreenbotConstructor.prototype.command = function(command, cb) {
    console.log("Source: " + this.source);

    _request(this.endpoint(command), function(err, result) {
      if(err instanceof Error) return cb(err);
      if(err) return cb(_handleError({ code: ERROR_CODES.CLIENT_UNAVAILABLE.code, message: err.error }));
      if('connected' in result) return cb(null, { connected: result.connected });

      if(this.source && this.source.readyState !== 2) {
        this.source.close();
      }

      this.source = new EventSource(this.response_endpoint(result.token));
      this.source.onmessage = function(event) {
        this.source.close();
        if(event.data === "0" || !event.data.length) return cb(_handleError({ code: ERROR_CODES.NO_DATA_RECEIVED.code }));

        var eventData = { url: event.data };
        cb(null, eventData);
      }.bind(this);
    }.bind(this));
  };

  // Check whether the Screenbot app is running and connected
  ScreenbotConstructor.prototype.ping = function(cb) {
    this.command("ping",cb);
  };

  // Take a screenshot
  ScreenbotConstructor.prototype.activate = function(cb) {
    this.command("",cb);
  };

  // Take a screenshot
  ScreenbotConstructor.prototype.shot = function(cb) {
    this.command("shot",cb);
  };

  // Create an annotation
  ScreenbotConstructor.prototype.draw = function(cb) {
    this.command("draw",cb);
  };

  // Create a screencast
  ScreenbotConstructor.prototype.cast = function(cb) {
    this.command("cast",cb);
  };

  // Upload your clipboard
  ScreenbotConstructor.prototype.clip = function(cb) {
    this.command("clip",cb);
  };

  // Return the constructor
  return ScreenbotConstructor;
}());
