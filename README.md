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

You can manage your SDK keys on [your developer dashboard](https://app.screenbot.io/developer)

Run a command:

```javascript

// Show the Screenbot menu for all connected clients
sb.activate(function(success, result){
  // result should be shortened link to screenshot. Example: http://d.pr/i/zJSD
});

// Run the screenshot command for all connected clients. Same as /sb shot
sb.shot(function(success, result){
  // result should be shortened link to screenshot. Example: http://d.pr/i/1kA2M
});

// Activate the screencast command for all connected clients. Same as /sb cast
sb.cast(function(success, result){
  // result should be shortened link to an screencast. Example: http://d.pr/i/12A5W
});

// Upload whatever is in the client clipboard. Same as /sb clip
sb.clip(function(success, result){
  // result should be shortened link to an annotated screenshot. Example: http://d.pr/f/1iTCo
});

```

## License

Apache-2.0
