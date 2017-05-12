# Hermes

[![NPM Version](https://img.shields.io/npm/v/@streammedev/hermes.svg)](https://npmjs.org/package/@streammedev/hermes)
[![NPM Downloads](https://img.shields.io/npm/dm/@streammedev/hermes.svg)](https://npmjs.org/package/@streammedev/hermes)
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
var Hermes = require('@streammedev/hermes');

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

## Options

| Prop Name | Default | Description |
| --------- | ------- | ----------- |
| `className` | "hermes" | The container classname |
| `placeholder` | undefined | Placeholder text to insert |
| `contentClassName` | "hermes-content" | Classname for the contenteditable |
| `emptyClassName` | "hermes-empty" | A classname added when the field is empty |
| `flyoutClassName` | "" | A classname to add to the suggestions flyout |
| `flyoutElement` | "ol" | A classname to add to the suggestions flyout |
| `children` | undefined | Children to add inside the container |
| `autoFocus` | false | Autofocus the field on render |
| `value` | "" | The initial input value |
| `formatValue` | "" | A function which formats the value display (see example) |
| `preventNewLines` | false | Will prevent new lines in the input |
| `suggestions` | null | An array of suggestions to show the user |
| `loadSuggestions` | undefined | A function to load suggestions |
| `clearSuggestions` | undefined | A function to clear the suggestions |
| `renderSuggestion` | undefined | A function to custom render the suggestions items |
| `getSuggestionText` | identity function | A function to get the suggestion text from the selected suggestion item |
| `onSelectSuggestion` | undefined | A function to call when a suggestion is selected |
| `onChangeValue` | undefined | A function to call when the value changes |
| `store` | undefined | A redux compatible store like [@streammedev/flux-store](https://github.com/StreamMeDev/flux-store)|

## Example

There is a working example, picutred in the gif above.  Here is how to run it:

```
$ git clone git@github.com:StreamMeDev/hermes.git && cd hermes/examples/basic
$ npm install
$ node index.js
```

Then visit [http://localhost:1337](http://localhost:1337/).

## Advanced Usage

The package exposes all of the internal parts, so you can compose them together in your application however you like.

*More to come on this.*

## Contributing

Contributions are welcome. Please see our guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)
