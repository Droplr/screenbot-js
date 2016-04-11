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

You can manage your SDK keys on [your developer dashboard](https://app.screenbot.io/dashboard).

Run a command:

```javascript

// Show the Screenbot menu for all connected clients
sb.activate(function(err, result){
  // err has properties for the error's code and message
  if(err) return console.log('Error! Code: ' + err.code + ' Message: ' + err.message);

  // result has a url property that points to the uploaded drop
  console.log(result.url);
  // http://d.pr/i/zJSD
});

// Run the screenshot command for all connected clients. Same as /sb shot
sb.shot(function(err, result){
  // err has properties for the error's code and message
  if(err) return console.log('Error! Code: ' + err.code + ' Message: ' + err.message);

  // result has a url property that points to a screenshot
  console.log(result.url);
  // http://d.pr/i/1kA2M
});

// Activate the screencast command for all connected clients. Same as /sb cast
sb.cast(function(err, result){
  // err has properties for the error's code and message
  if(err) return console.log('Error! Code: ' + err.code + ' Message: ' + err.message);

  // result has a url property that points to a screencast
  console.log(result.url);
  // http://d.pr/i/12A5W
});

// Upload whatever is in the client clipboard. Same as /sb clip
sb.clip(function(err, result){
  // err has properties for the error's code and message
  if(err) return console.log('Error! Code: ' + err.code + ' Message: ' + err.message);

  // result has a url property that points to the uploaded drop
  console.log(result.url);
  // http://d.pr/f/1iTCo
});

```

To see a working example, clone the repo and open [example/index.html](https://github.com/Droplr/screenbot-js/blob/master/example/index.html) in your browser.

## Error Codes

|Code|Message|Resolution|
|:--:|------|----------|
|1|`Screenbot isn't running`|This error occurs when the library can't connect to the Screenbot desktop app. Make sure that you're initializing the client with a valid API token. You can manage your tokens on [your developer dashboard](https://app.screenbot.io/dashboard).<br><br>Also, make sure the app is [running and connected](http://d.pr/i/BZHN). If have multiple accounts, check in the app under "Preferences" that Screenbot is signed in to the account that's [associated with your API token](http://d.pr/i/17UoA).|
|2|`No data received`|This error occurs when there is no response from the Screenbot desktop app after a command is sent. Make sure your API tokens are valid. The app itself should display a more specific error as well.|

## License

Apache-2.0
