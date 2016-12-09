var React = require('react');
var ReactDOM = require('react-dom');
var Hermes = require('@streammedev/hermes');
var {createStore, bindActionCreators} = require('@streammedev/flux-store');

var el = document.getElementById('app');
var store = createStore({
	loadSuggestions: function (state, action) {
		state.suggestions = action.suggestions;
		return state;
	},
	clearSuggestions: function (state, action) {
		state.suggestions = null;
		return state;
	}
}, {});

store.subscribe(function (state, oldState, action) {
	render(state);
});

var actions = bindActionCreators({
	loadSuggestions: function loadSuggestions (term, fullText) {
		var suggestions;
		if (term.charAt(0) === '#' && term.length > 1) {
			suggestions = ['#foo', '#bar', '#baz'];
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

function render (state) {
	ReactDOM.render((
		<div>
			<h1>Hermes Example</h1>
			<Hermes
				autoFocus
				placeholder="Type in me!!"
				{...state}
				{...actions}
			/>
		</div>
	), el);
}
render();
