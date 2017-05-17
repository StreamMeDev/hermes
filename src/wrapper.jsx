'use strict';
const React = require('react');
const ifPropCall = require('./if-prop-is-func-call');
const reactCompat = require('@streammedev/react-compat');

module.exports = reactCompat.createClass({
	displayName: 'HermesWrapper',
	propTypes: {
		onEnter: reactCompat.PropTypes.func,
		onShiftEnter: reactCompat.PropTypes.func,
		onEscape: reactCompat.PropTypes.func,
		onArrowDown: reactCompat.PropTypes.func,
		onArrowUp: reactCompat.PropTypes.func,
		onCtrlC: reactCompat.PropTypes.func,
		onCtrlA: reactCompat.PropTypes.func,
		onCtrlE: reactCompat.PropTypes.func,
		onAltB: reactCompat.PropTypes.func,
		onAltF: reactCompat.PropTypes.func,
		onKeyUp: reactCompat.PropTypes.func,
		onKeyDown: reactCompat.PropTypes.func,
		children: reactCompat.PropTypes.node
	},
	render: function () {
		// don't pass unnecessary props to children: https://fb.me/react-unknown-prop
		/* eslint-disable */
		const {
			onEnter,
			onShiftEnter,
			onEscape,
			onArrowDown,
			onArrowUp,
			onCtrlC,
			onCtrlA,
			onCtrlE,
			onAltB,
			onAltF,
			onKeyUp,
			children,
			...rest
		} = this.props; 
		/* eslint-enable */
		return <div {...rest} onKeyUp={this.onKeyUp}>{children}</div>;
	},
	onKeyUp: function (e) {
		var props = this.props;
		switch (e.which) {
			case 13:
				if (e.shiftKey) {
					ifPropCall(props, 'onShiftEnter', e);
					break;
				}
				ifPropCall(props, 'onEnter', e);
				break;
			case 27:
				ifPropCall(props, 'onEscape', e);
				break;
			case 40:
				ifPropCall(props, 'onArrowDown', e);
				break;
			case 38:
				ifPropCall(props, 'onArrowUp', e);
				break;

			case 67:
				if (e.ctrlKey) {
					ifPropCall(props, 'onCtrlC', e);
					break;
				}
				/* falls through */
			case 65:
				if (e.ctrlKey) {
					ifPropCall(props, 'onCtrlA', e);
					break;
				}
				/* falls through */
			case 69:
				if (e.ctrlKey) {
					ifPropCall(props, 'onCtrlE', e);
					break;
				}
				/* falls through */
			case 66:
				if (e.altKey) {
					ifPropCall(props, 'onAltB', e);
					break;
				}
				/* falls through */
			case 70:
				if (e.altKey) {
					ifPropCall(props, 'onAltF', e);
					break;
				}
				/* falls through */
			default:
				ifPropCall(props, 'onKeyUp', e);
				break;
		}
	}
});
