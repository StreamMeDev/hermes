'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const Hermes = require('./hermes');
const createDefaultStore = require('./create-default-store');
const {bindActionCreators} = require('@streammedev/flux-store');
const {changeValue} = require('./actions/value');
const {changeSelection} = require('./actions/selection');
const ifPropCall = require('./if-prop-is-func-call');
const {decrSuggestionIndex, incrSuggestionIndex, selectSuggestion, setSuggestionIndex, setSuggestions} = require('./actions/suggestions');

module.exports = createReactClass({
	displayName: 'HermesContainer',
	propTypes: {
		className: PropTypes.string,
		placeholder: PropTypes.string,
		emptyClassName: PropTypes.string,
		contentClassName: PropTypes.string,
		flyoutClassName: PropTypes.string,
		flyoutElement: PropTypes.string,
		children: PropTypes.node,
		autoFocus: PropTypes.bool,
		value: PropTypes.string,
		formatValue: PropTypes.func,
		preventNewLines: PropTypes.bool,
		suggestions: PropTypes.array,
		loadSuggestions: PropTypes.func,
		clearSuggestions: PropTypes.func,
		renderSuggestion: PropTypes.func,
		getSuggestionText: PropTypes.func,
		onSelectSuggestion: PropTypes.func,
		onChangeValue: PropTypes.func,
		store: PropTypes.object
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
