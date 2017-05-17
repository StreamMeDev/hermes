'use strict';
const React = require('react');
const reactCompat = require('@streammedev/react-compat');
const Hermes = require('./hermes');
const createDefaultStore = require('./create-default-store');
const {bindActionCreators} = require('@streammedev/flux-store');
const {changeValue} = require('./actions/value');
const {changeSelection} = require('./actions/selection');
const ifPropCall = require('./if-prop-is-func-call');
const {decrSuggestionIndex, incrSuggestionIndex, selectSuggestion, setSuggestionIndex, setSuggestions} = require('./actions/suggestions');

module.exports = reactCompat.createClass({
	displayName: 'HermesContainer',
	propTypes: {
		className: reactCompat.PropTypes.string,
		placeholder: reactCompat.PropTypes.string,
		emptyClassName: reactCompat.PropTypes.string,
		contentClassName: reactCompat.PropTypes.string,
		flyoutClassName: reactCompat.PropTypes.string,
		flyoutElement: reactCompat.PropTypes.string,
		children: reactCompat.PropTypes.node,
		autoFocus: reactCompat.PropTypes.bool,
		value: reactCompat.PropTypes.string,
		formatValue: reactCompat.PropTypes.func,
		preventNewLines: reactCompat.PropTypes.bool,
		suggestions: reactCompat.PropTypes.array,
		loadSuggestions: reactCompat.PropTypes.func,
		clearSuggestions: reactCompat.PropTypes.func,
		renderSuggestion: reactCompat.PropTypes.func,
		getSuggestionText: reactCompat.PropTypes.func,
		onSelectSuggestion: reactCompat.PropTypes.func,
		onChangeValue: reactCompat.PropTypes.func,
		store: reactCompat.PropTypes.object
	},
	getDefaultProps: function () {
		return {
			getSuggestionText: function (suggestion) {
				return suggestion;
			}
		};
	},
	componentWillReceiveProps: function (newProps, oldProps) {
		if (newProps.suggestions !== oldProps.suggestions) {
			this.dispatch(setSuggestions(newProps.suggestions));
		}
	},
	getInitialState: function () {
		return {
			value: this.props.value || '',
			suggestionIndex: -1,
			lastSuggestionIndex: -1,
			suggestions: null,
			selection: null
		};
	},
	render: function () {
		return (
			<Hermes
				className={this.props.className}
				emptyClassName={this.props.emptyClassName}
				contentClassName={this.props.contentClassName}
				flyoutClassName={this.props.flyoutClassName}
				flyoutElement={this.props.flyoutElement}
				autoFocus={this.props.autoFocus}
				preventNewLines={this.props.preventNewLines}
				placeholder={this.props.placeholder}
				value={this.state.value}
				selection={this.state.selection}
				suggestionIndex={this.state.suggestionIndex}
				lastSuggestionIndex={this.state.lastSuggestionIndex}
				loadSuggestions={this.props.loadSuggestions}
				clearSuggestions={this.props.clearSuggestions}
				renderSuggestion={this.props.renderSuggestion}
				suggestions={this.state.suggestions}
				formatValue={this.state.formatValue}
				{...this.actions}
			>{this.props.children}</Hermes>
		);
	},
	componentWillMount: function () {
		// Bind action creators
		this.actions = bindActionCreators({
			onChangeSelection: changeSelection,
			setSuggestionIndex: setSuggestionIndex,
			incrSuggestionIndex: incrSuggestionIndex,
			decrSuggestionIndex: decrSuggestionIndex,
			onChangeValue: (val) => {
				ifPropCall(this.props, 'onChangeValue', val);
				return changeValue(val);
			},
			selectSuggestion: (selection) => {
				ifPropCall(this.props, 'onSelectSuggestion', selection);
				return selectSuggestion(this.props.getSuggestionText(selection));
			}
		}, this.dispatch);
	},
	componentDidMount: function () {
		this.store = this.props.store || createDefaultStore(this.state);
		this._unsubscribe = this.store.subscribe((state, oldState, action) => {
			this.setState(state);
		});
	},
	componentWillUnmount: function () {
		this._unsubscribe();
	},
	dispatch: function (action) {
		this.store.dispatch(action);
	}
});
