'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const ifPropCall = require('./if-prop-is-func-call');

module.exports = createReactClass({
	displayName: 'HermesWrapper',
	propTypes: {
		onEnter: PropTypes.func,
		onShiftEnter: PropTypes.func,
		onEscape: PropTypes.func,
		onArrowDown: PropTypes.func,
		onArrowUp: PropTypes.func,
		onCtrlC: PropTypes.func,
		onCtrlA: PropTypes.func,
		onCtrlE: PropTypes.func,
		onAltB: PropTypes.func,
		onAltF: PropTypes.func,
		onKeyUp: PropTypes.func,
		onKeyDown: PropTypes.func,
		children: PropTypes.node
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
