# Screenbot

Official Javacript SDK for Screenbot. Requires a Screenbot account and the Screenbot client.

[http://screenbot.io](http://screenbot.io)

## Installation

Requires [bower](http://bower.io)

`bower install --save screenbot`

Notable files are `distrib/screenbot.js` or `distrib/screenbot.min.js`.

## Usage

Initialize the client

```javascript
// Init with Screenbot SDK token
var sb = new Screenbot("pk_test_sdk_token_value");
```

You can manage your SDK keys on [your developer dashboard](https://app.screenbot.io/dashboard)

Run a command:

```javascript

// Show the Screenbot menu for all connected clients
sb.activate(function(err, result){
  // err has properties for the error's code and message
  if(err) return console.log('Error! Code: ' + err.code + ' Message: ' + err.message);

  // result has a url property that points to screenshot.
  console.log(result.url);
  // http://d.pr/i/zJSD
});

// Run the screenshot command for all connected clients. Same as /sb shot
sb.shot(function(err, result){
  // err has properties for the error's code and message
  if(err) return console.log('Error! Code: ' + err.code + ' Message: ' + err.message);

  // result has a url property that points to screenshot. 
  console.log(result.url);
  // http://d.pr/i/1kA2M
});

// Activate the screencast command for all connected clients. Same as /sb cast
sb.cast(function(err, result){
  // err has properties for the error's code and message
  if(err) return console.log('Error! Code: ' + err.code + ' Message: ' + err.message);

  // result has a url property that points to an screencast.
  console.log(result.url);
  // http://d.pr/i/12A5W
});

// Upload whatever is in the client clipboard. Same as /sb clip
sb.clip(function(err, result){
  // err has properties for the error's code and message
  if(err) return console.log('Error! Code: ' + err.code + ' Message: ' + err.message);

  // result has a url property that points to an annotated screenshot.
  console.log(result.url);
  // http://d.pr/f/1iTCo
});

```

To see a working example, clone the repo and open [example/index.html](https://github.com/Droplr/screenbot-js/blob/master/example/index.html) in your browser.

## License

Apache-2.0
