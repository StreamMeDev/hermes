# Hermes

[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg)](https://github.com/JedWatson/happiness)

Messages like you have never seen them before

![Hermes Example](https://raw.githubusercontent.com/StreamMeDev/hermes/master/hermes.gif)

## Install

```
$ npm install --save @streammedev/hermes
```

## Basic Usage

```javascript
var ReactDom = require('react-dom');
var Hermes = require('@streamme/hermes');

ReactDom.render(<Hermes 
	autoFocus
	placeHolder="Get your message across..."
	suggestions={[/* your array of suggestions, updated when loadSuggestions is called */]}
	loadSuggestions={function (term, fullText) {
		// Get from your server,
		// or whereever you get them,
		// term is the current word
		// fullText is the full input value
	}}
	clearSuggestions={function () {
		// clear your suggestion list
	}}
/>, document.getElementById('app'));
```

## Advanced Usage

The package exposes all of the internal parts, so you can compose them together in your application however you like.

*More to come on this.*

## Contributing

Contributions are welcome. Please see our guidelines in [CONTRIBUTING.md](contributing.md)
