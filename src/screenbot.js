var Screenbot = (function Screenbot() {
    var _private = {
        "source"  : null, // Our EventSource connection
        "token"   : null, // Our Screenbot token
        "service" : "sdk",
        "host"    : "https://app.screenbot.io"
    };

    var _endpoint = function(command){
      return _private.host +
             "/api/services/" +
             _private.service +
             "/command?token=" +
             _private.token +
             "&text=" +
             command;
    };

    var _response_endpoint = function(channel_token){
      return _private.host +
             "/api/services/" +
             _private.service +
             "/response?channel_token=" +
             channel_token;
    };

    var _request = function(endpoint, callback){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          var response = JSON.parse(xhttp.responseText);
          callback(response.ok, response);
        } else if(xhttp.readyState === 4) {
          callback(false, xhttp.responseText);
        }
      };
      xhttp.open("GET", endpoint, true);
      xhttp.send();
    };

    var _handleError = function(args, cb){
      var err = new ScreenbotError(args);
      return cb(err);
    };

    var ScreenbotError = function(args){
      this.name = 'Screenbot Error';
      this.message = args.message || 'An error has occured';
      this.code = args.code;
      this.stack = (new Error()).stack;
    };

    ScreenbotError.prototype = Object.create(Error.prototype);
    ScreenbotError.prototype.constructor = ScreenbotError;

    // Return the constructor
    return function ScreenbotConstructor(token, args) {
        var _this = this; // Cache the `this` keyword

        _private.token = token;
        if(args && args.service) _private.service = args.service;
        if(args && args.host) _private.host = args.host;

        _this.command = function (command, cb) {
          console.log("Source: " + _private.source);

          _request(_endpoint(command), function(success, response) {
            if (!success || !response.ok) return _handleError({ code: 1, message: response.error }, cb);

            if(_private.source && _private.source.readyState !== 2) {
              _private.source.close();
            }

            _private.source = new EventSource(_response_endpoint(response.token));
            _private.source.onmessage = function(event) {
              _private.source.close();
              if(event.data === "0" || !event.data.length) return _handleError({ code: 2, message: 'No data received' }, cb);

              var result = { url: event.data };
              cb(null, result);
            };
          });
        };

        // Take a screenshot
        _this.activate = function(cb) {
          _this.command("",cb);
        };

        // Take a screenshot
        _this.shot = function(cb) {
          _this.command("shot",cb);
        };

        // Create an annotation
        _this.draw = function(cb) {
          _this.command("draw",cb);
        };

        // Create a screencast
        _this.cast = function(cb) {
          _this.command("cast",cb);
        };

        // Upload your clipboard
        _this.clip = function(cb) {
          _this.command("clip",cb);
        };

    };
}());
