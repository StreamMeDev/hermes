'use strict';
const React = require('react');
const Hermes = require('./hermes');
const createDefaultStore = require('./create-default-store');
const {bindActionCreators} = require('@streammedev/flux-store');
const {changeValue} = require('./actions/value');
const {changeSelection} = require('./actions/selection');
const ifPropCall = require('./if-prop-is-func-call');
const {decrSuggestionIndex, incrSuggestionIndex, selectSuggestion, setSuggestionIndex, setSuggestions} = require('./actions/suggestions');

module.exports = React.createClass({
	displayName: 'HermesContainer',
	propTypes: {
		className: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		emptyClassName: React.PropTypes.string,
		contentClassName: React.PropTypes.string,
		flyoutClassName: React.PropTypes.string,
		flyoutElement: React.PropTypes.string,
		children: React.PropTypes.node,
		autoFocus: React.PropTypes.bool,
		value: React.PropTypes.string,
		formatValue: React.PropTypes.func,
		preventNewLines: React.PropTypes.bool,
		suggestions: React.PropTypes.array,
		loadSuggestions: React.PropTypes.func,
		clearSuggestions: React.PropTypes.func,
		renderSuggestion: React.PropTypes.func,
		getSuggestionText: React.PropTypes.func,
		onSelectSuggestion: React.PropTypes.func,
		onChangeValue: React.PropTypes.func,
		store: React.PropTypes.object
	},
	getDefaultProps: function () {
		return {
			getSuggestionText: function (suggestion) {
				return suggestion;
			}
		};
	},
	componentWillReceiveProps: function (newProps) {
		if (newProps.suggestions) {
			this.store.dispatch(setSuggestions(newProps.suggestions));
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
