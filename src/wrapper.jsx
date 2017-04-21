'use strict';
const React = require('react');
const ifPropCall = require('./if-prop-is-func-call');

module.exports = React.createClass({
	displayName: 'HermesWrapper',
	propTypes: {
		onEnter: React.PropTypes.func,
		onShiftEnter: React.PropTypes.func,
		onEscape: React.PropTypes.func,
		onArrowDown: React.PropTypes.func,
		onArrowUp: React.PropTypes.func,
		onCtrlC: React.PropTypes.func,
		onCtrlA: React.PropTypes.func,
		onCtrlE: React.PropTypes.func,
		onAltB: React.PropTypes.func,
		onAltF: React.PropTypes.func,
		onKeyUp: React.PropTypes.func,
		onKeyDown: React.PropTypes.func,
		children: React.PropTypes.node
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
