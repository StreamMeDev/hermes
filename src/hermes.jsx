'use strict';
import React, {PropTypes} from 'react';
import debounce from 'debounce';
import Flyout from '@streammedev/flyout';
import {HermesWrapper} from './wrapper';
import defaultFormatValue from './default-format-value';
import ifPropCall from './if-prop-is-func-call';
const selection = typeof window !== 'undefined' ? require('selection-range') : () => {};
const nbsp = String.fromCharCode(160);
const zws = String.fromCharCode(8203);
// Track which placeholder css rules have been added for the hermes instances, see below
const cssRules = {};

export const Hermes = React.createClass({
	displayName: 'Hermes',
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
		onChangeValue: PropTypes.func,

		selection: PropTypes.object,
		onChangeSelection: PropTypes.func,

		preventNewLines: PropTypes.bool,

		suggestions: PropTypes.array,
		loadSuggestions: PropTypes.func,
		clearSuggestions: PropTypes.func,
		renderSuggestion: PropTypes.func,
		suggestionIndex: PropTypes.number,
		lastSuggestionIndex: PropTypes.number,
		selectSuggestion: PropTypes.func,
		decrSuggestionIndex: PropTypes.func,
		incrSuggestionIndex: PropTypes.func
	},
	getDefaultProps: function () {
		return {
			className: 'hermes',
			contentClassName: 'hermes-content',
			flyoutElement: 'ol',
			formatValue: defaultFormatValue,
			preventNewLines: false,
			suggestionIndex: -1,
			lastSuggestionIndex: -1,
			selection: {start: 0, end: 0},
			renderSuggestion (suggestion, selected) {
				return <li key={suggestion} className={selected ? 'selected' : ''}>{suggestion}</li>;
			}
		};
	},
	render: function () {
		return (
			<HermesWrapper
				className={this.props.className}
				onEscape={this.onEscape}
				onEnter={this.onEnter}
				onArrowUp={this.onArrowUp}
				onArrowDown={this.onArrowDown}
				onKeyUp={this.onKeyUp}
				onCtrlC={this.onCtrlC}
				onCtrlA={this.onCtrlA}
				onCtrlE={this.onCtrlE}
			>
				<div
					contentEditable
					ref={this.inputRef}
					className={this.props.contentClassName}
					onInput={this.onInput}
					placeholder={this.props.placeholder}
					dangerouslySetInnerHTML={{__html: this.props.formatValue(this.props.value)}}
					onKeyDown={this.onKeyDown}
					onBlur={this.onBlur}
					onMouseDown={this.onMouseDown}
				/>
				{this.props.children}
				{this.props.suggestions && this.props.suggestions.length ? (
					<Flyout
						element={this.props.flyoutElement}
						className={this.props.flyoutClassName}
						open={!!this.props.suggestions.length}
						onClose={this.clearSuggestions}
					>
						{this.props.suggestions.map((suggestion, i) => {
							var node = this.props.renderSuggestion(suggestion, i === this.props.suggestionIndex);

							// Add click and hover handlers
							node = React.cloneElement(node, {
								onClick: () => {
									this.selectSuggestion(i);
								},
								onMouseOver: () => {
									ifPropCall(this.props, 'setSuggestionIndex', i);
								},
								onMouseOut: () => {
									// Only reset it if it looks like no other action changed it
									if (this.props.suggestionIndex === i) {
										ifPropCall(this.props, 'setSuggestionIndex', this.props.lastSuggestionIndex, false);
									}
								}
							});

							return node;
						})}
					</Flyout>
				) : false}
			</HermesWrapper>
		);
	},

	componentDidMount: function () {
		// Debounce the loadSuggestions method
		this.loadSuggestions = debounce(this.loadSuggestions, 250);

		// Adds a line of css to the first stylesheet on the page to get
		// the placeholder text to work correctly.  The css looks like:
		//
		//   .hermes-content:empty:not(:focus):before { content:attr(placeholder); }
		//
		// Only adds the rule once per unique className
		if (!cssRules[this.props.contentClassName]) {
			document.styleSheets[0].insertRule(`.${this.props.contentClassName}:empty:not(:focus):before { content:attr(placeholder); }`, 0);
		}

		// Manage focus, because autoFocus property doesnt work on contenteditable
		if (this.props.autoFocus) {
			this.input.focus();
		} else {
			this.input.blur();
		}
	},

	componentDidUpdate: function (prevProps) {
		var selChanged = selectionChanged(prevProps.selection, this.props.selection);
		var valChanged = this.props.value !== prevProps.value;
		var isEmpty = !this.props.value || this.props.value === '';
		var endsInSpace = this.props.value && this.props.value[this.props.value.length - 1] === nbsp;
		var shouldFocus = !prevProps.autoFocus && this.props.autoFocus;

		// Update the selection if it has changed
		if (selChanged) {
			// When its an empty string
			// use a zero-width space charaacter,
			// this fixes the focus issues around
			// contentEditable with no text content
			if (isEmpty) {
				this.input.textContent = zws;
			}

			// Set the new seleciton
			selection(this.input, this.props.selection);
		} else if (valChanged) {
			// If we selected a suggestion, but it was
			// of the same length, then the selection
			// doesnt change, but the value does, and the
			// cursor gets reset to the start of the input,
			// so set it here to fix that
			selection(this.input, this.props.selection);
		} else if (shouldFocus) {
			this.input.focus();
			// If selection is not at the start, set it
			if (this.props.selection && this.props.selection.end !== 0) {
				selection(this.input, this.props.selection);
			}
		}

		// do this after setting the selection
		var atEnd = atEndOfNode();

		// If the value has changed or the selection has
		// changed and is the end of the current word, load the suggestions
		// getting the node first protects agains when the browser clears the selection
		// node out, happens when you select all and delete.
		if (!isEmpty && !endsInSpace && (valChanged || selChanged)) {
			this.loadSuggestions();
		} else if (this.props.suggestions && this.props.suggestions.length && ((selChanged && !atEnd) || isEmpty || endsInSpace)) {
			this.clearSuggestions();
		}
	},

	inputRef: function (ref) {
		this.input = ref;
	},

	onKeyDown: function (e) {
		// The formatting here is crazy, what I was trying to
		// get across what the grouping of statements for the
		// different parts of this, and the minifier will make
		// it smaller and drop the extra stuff
		if (
			// don't do anything on Enter press when preventing newlines
			(e.which === 13 && this.props.preventNewLines) ||
			(
				// If we have suggestions
				this.props.suggestions && this.props.suggestions.length &&
				// Dont do anything if its an arrow up/down or enter
				(e.which === 40 || e.which === 38 || e.which === 13)
			)
		) {
			e.preventDefault();
		}
	},

	onEnter: function (e) {
		// When no suggestion selected, enter submits the change
		if (this.props.suggestionIndex === -1) {
			return ifPropCall(this.props, 'onSubmit', e);
		}

		// We have suggestions, and one is selected,
		// dispatch the selection event
		this.selectSuggestion();
	},

	onKeyUp: function () {
		this.updateSelection();
	},

	onCtrlC: function () {
		ifPropCall(this.props, 'onChangeValue', '');
	},

	onCtrlA: function () {
		ifPropCall(this.props, 'onChangeSelection', {
			start: 0,
			end: 0
		});
	},

	onCtrlE: function () {
		ifPropCall(this.props, 'onChangeSelection', {
			start: this.props.value.length,
			end: this.props.value.length
		});
	},

	onInput: function (e) {
		// On input, update the value and the selection
		this.updateSelection();

		// Remove the zero width space if thats all thats there
		// @NOTE search this file for "zws" to see where its added
		ifPropCall(this.props, 'onChangeValue', this.input.textContent.replace(zws, ''));
	},

	onMouseDown: function () {
		// If we mouse down inside the input, then
		// whereever we mouseup we should update
		// the selection range
		var mouseup = function (e) {
			window.removeEventListener('mouseup', mouseup);
			// set a timeout because the selection is not actually
			// updated here, but it is by "nextTick"
			setTimeout(function () {
				this.updateSelection();
			}.bind(this));
		}.bind(this);
		window.addEventListener('mouseup', mouseup);
	},

	onArrowUp: function (e) {
		// If we dont have suggestions, just update selection
		if (!this.props.suggestions || !this.props.suggestions.length) {
			return this.updateSelection();
		}

		// When we have suggestions, prevent default
		// so the cursor doesnt move, then update
		// the selected index
		e.preventDefault();
		ifPropCall(this.props, 'decrSuggestionIndex');
	},

	onArrowDown: function (e) {
		// If we dont have suggestions, just update selection
		if (!this.props.suggestions || !this.props.suggestions.length) {
			return this.updateSelection();
		}

		// When we have suggestions, prevent default
		// so the cursor doesnt move, then update
		// the selected index
		e.preventDefault();
		ifPropCall(this.props, 'incrSuggestionIndex');
	},

	clearSuggestions: function () {
		ifPropCall(this.props, 'clearSuggestions');
	},

	selectSuggestion: function (index) {
		index = index || this.props.suggestionIndex;
		ifPropCall(this.props, 'selectSuggestion', this.props.suggestions[index]);
	},

	loadSuggestions: function () {
		ifPropCall(this.props, 'loadSuggestions', getSelectedNode().textContent, this.input.textContent);
	},

	updateSelection: function () {
		var sel = selection(this.input);
		if (selectionChanged(this.props.selection, sel)) {
			ifPropCall(this.props, 'onChangeSelection', sel);
		}
	}
});

function getSelectedNode () {
	var sel = window.getSelection();
	// No node selected
	if (!sel.focusNode) {
		return null;
	}
	return sel.getRangeAt(0).commonAncestorContainer;
}

function selectionChanged (prevSel, sel) {
	return !prevSel || !sel || prevSel.start !== sel.start || prevSel.end !== sel.end;
}

function atEndOfNode (node) {
	node = node || getSelectedNode();
	if (!node) {
		return false;
	}
	var sel = selection(node);

	// trim trailing zero width spaces
	var text = node.textContent;
	text = text.replace(zws, '');

	return sel.end === sel.start && sel.end === text.length;
}
