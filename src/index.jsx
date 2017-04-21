'use strict';
import React, {PropTypes} from 'react';
import {Hermes} from './hermes';
import createDefaultStore from './create-default-store';
import {bindActionCreators} from '@streammedev/flux-store';
import {changeValue} from './actions/value';
import {changeSelection} from './actions/selection';
import {decrSuggestionIndex, incrSuggestionIndex, selectSuggestion, setSuggestionIndex} from './actions/suggestions';

export const HermesContainer = React.createClass({
	displayName: 'HermesContainer',
	propTypes: {
		className: PropTypes.string,
		placeholder: PropTypes.string,
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
		getSuggestionText: PropTypes.func,
		store: PropTypes.object
	},
	getDefaultProps: function () {
		return {
			getSuggestionText: function (suggestion) {
				return suggestion;
			}
		};
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
				autoFocus={this.props.autoFocus}
				placeholder={this.props.placeholder}
				value={this.state.value}
				selection={this.state.selection}
				suggestionIndex={this.state.suggestionIndex}
				lastSuggestionIndex={this.state.lastSuggestionIndex}
				loadSuggestions={this.props.loadSuggestions}
				clearSuggestions={this.props.clearSuggestions}
				suggestions={this.state.suggestions}
				formatValue={this.state.formatValue}
				{...this.actions}
			/>
		);
	},
	componentWillMount: function () {
		// Bind action creators
		this.actions = bindActionCreators({
			onChangeValue: changeValue,
			onChangeSelection: changeSelection,
			setSuggestionIndex: setSuggestionIndex,
			incrSuggestionIndex: incrSuggestionIndex,
			decrSuggestionIndex: decrSuggestionIndex,
			selectSuggestion: (selection) => {
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
