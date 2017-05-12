require('es6-symbol/implement');
require('es6-promise').polyfill();
var React = require('react');
var ReactDOM = require('react-dom');
var Hermes = require('../../');
var {bindActionCreators} = require('@streammedev/flux-store');

var el = document.getElementById('app');

// Setup the store, use the default then add our suggestion reducers
var store = Hermes.createDefaultStore({});
store.addReducer('loadSuggestions', function (state, action) {
	state.suggestions = action.suggestions;
	return state;
});
store.addReducer('clearSuggestions', function (state, action) {
	state.suggestions = null;
	return state;
});
store.subscribe((state, oldState, action) => {
	console.log(action.type, action);
});

var actions = bindActionCreators({
	loadSuggestions: function loadSuggestions (term, fullText) {
		var suggestions;
		if (term.charAt(0) === '#' && term.length > 1) {
			suggestions = ['#sweet', '#awesome', '#fake'];
		} else if (fullText.charAt(0) === '/') {
			suggestions = ['/command', '/clear', '/whisper'];
		}
		return {
			type: 'loadSuggestions',
			term: term,
			fullText: fullText,
			suggestions: suggestions
		};
	},
	clearSuggestions: function clearSuggestions () {
		return {
			type: 'clearSuggestions'
		};
	}
}, store.dispatch);

// Just examples of using the props
function onChangeValue (val) {
	console.log('Value changed: ', val);
}
function onSelectSuggestion (suggestion) {
	console.log('Suggestion selected: ', suggestion);
}

function render (state) {
	ReactDOM.render((
		<div>
			<h1>Hermes Example</h1>
			<Hermes
				autoFocus
				placeholder="Type in me!!"
				store={store}
				{...state}
				{...actions}
				onChangeValue={onChangeValue}
				onSelectSuggestion={onSelectSuggestion}
			/>
		</div>
	), el);
}
render();
