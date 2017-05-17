'use strict';
const React = require('react');
const debounce = require('debounce');
const Flyout = require('@streammedev/flyout');
const HermesWrapper = require('./wrapper');
const defaultFormatValue = require('./default-format-value');
const ifPropCall = require('./if-prop-is-func-call');
const reactCompat = require('@streammedev/react-compat');
const selection = typeof window !== 'undefined' ? require('selection-range') : () => {};
const nbsp = String.fromCharCode(160);
const zws = String.fromCharCode(8203);
// Track which placeholder css rules have been added for the hermes instances, see below
const cssRules = {};

module.exports = reactCompat.createClass({
	displayName: 'Hermes',
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
		onChangeValue: reactCompat.PropTypes.func,

		selection: reactCompat.PropTypes.object,
		onChangeSelection: reactCompat.PropTypes.func,

		preventNewLines: reactCompat.PropTypes.bool,

		suggestions: reactCompat.PropTypes.array,
		loadSuggestions: reactCompat.PropTypes.func,
		clearSuggestions: reactCompat.PropTypes.func,
		renderSuggestion: reactCompat.PropTypes.func,
		suggestionIndex: reactCompat.PropTypes.number,
		lastSuggestionIndex: reactCompat.PropTypes.number,
		selectSuggestion: reactCompat.PropTypes.func,
		decrSuggestionIndex: reactCompat.PropTypes.func,
		incrSuggestionIndex: reactCompat.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			className: 'hermes',
			contentClassName: 'hermes-content',
			emptyClassName: 'hermes-empty',
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
				className={this.props.className + (!this.props.value || this.props.value === '' ? ' ' + this.props.emptyClassName : '')}
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
					ref={reactCompat.refSet(this, 'input')}
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
		//  .hermes-empty .hermes-content:not(:focus):before { content:attr(placeholder); }
		//
		// Only adds the rule once per unique className
		if (!cssRules[this.props.contentClassName]) {
			document.styleSheets[0].insertRule(`.${this.props.emptyClassName} .${this.props.contentClassName}:not(:focus):before { content:attr(placeholder); }`, 0);
		}

		// Manage focus, because autoFocus property doesnt work on contenteditable
		if (this.props.autoFocus) {
			// If we are empty and trying to autofocus, it will not
			// focus unless there is some content, add the zero-width space.
			// Timeout to ensure it happens after the first few updates,
			// otherwise focus can get stolen by a change in selection.
			// Using selection because in some cases `focus` still
			// doesn't seem to work.
			setTimeout(() => {
				if (!this.props.value || this.props.value === '') {
					reactCompat.refGet(this, 'input').textContent = zws;
				}
				selection(reactCompat.refGet(this, 'input'), this.props.selection || {});
			});
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
				reactCompat.refGet(this, 'input').textContent = zws;
			}

			// Set the new seleciton
			selection(reactCompat.refGet(this, 'input'), this.props.selection);
		} else if (valChanged) {
			// If we selected a suggestion, but it was
			// of the same length, then the selection
			// doesnt change, but the value does, and the
			// cursor gets reset to the start of the input,
			// so set it here to fix that
			selection(reactCompat.refGet(this, 'input'), this.props.selection);
		} else if (shouldFocus) {
			reactCompat.refGet(this, 'input').focus();
			// If selection is not at the start, set it
			if (this.props.selection && this.props.selection.end !== 0) {
				selection(reactCompat.refGet(this, 'input'), this.props.selection);
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
	onEscape: function (e) {
		this.clearSuggestions();
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

		// Fix for IE where the onInput event is not fired.  Compares
		// the value with the input value and fires the onChangeValue
		// if it is different on each keyup
		this.updateValue();
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
		// On input, update the selection and the value
		this.updateSelection();
		this.updateValue();
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

	onBlur: function () {
		this.clearSuggestions();
		this.updateValue();
	},

	clearSuggestions: function () {
		ifPropCall(this.props, 'clearSuggestions');
	},

	selectSuggestion: function (index) {
		index = index || this.props.suggestionIndex;
		ifPropCall(this.props, 'selectSuggestion', this.props.suggestions[index]);
	},

	loadSuggestions: function () {
		ifPropCall(this.props, 'loadSuggestions', getSelectedNode().textContent, reactCompat.refGet(this, 'input').textContent);
	},

	updateSelection: function () {
		var sel = selection(reactCompat.refGet(this, 'input'));
		if (selectionChanged(this.props.selection, sel)) {
			ifPropCall(this.props, 'onChangeSelection', sel);
		}
	},

	updateValue: function () {
		// Remove the zero width space if thats all thats there
		// @NOTE search this file for "zws" to see where its added
		var cleanInput = reactCompat.refGet(this, 'input').textContent.replace(zws, '');
		if (cleanInput !== this.props.value) {
			ifPropCall(this.props, 'onChangeValue', cleanInput);
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
	if (prevSel === null && sel === null) {
		return false;
	}
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
