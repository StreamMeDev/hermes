/* global describe, it */
var assert = require('assert');
var enzyme = require('enzyme');
var React = require('react');
var Wrapper = React.createFactory(require('../lib/wrapper'));

describe('Hermes Wrapper', function () {
	it('should render', function () {
		var el = enzyme.shallow(Wrapper());
		assert(el.is('div'));
	});
	it('should bind events', function () {
		var called = 0;
		var evts = [
			'onEnter',
			'onShiftEnter',
			'onEscape',
			'onArrowDown',
			'onArrowUp',
			'onCtrlC',
			'onCtrlA',
			'onCtrlE',
			'onAltB',
			'onAltF',
			'onKeyUp'
		];

		// Create method for each prop
		var el = enzyme.shallow(Wrapper(evts.reduce(function (obj, evt) {
			obj[evt] = function (e) {
				called++;
				switch (e.which) {
					case 13:
						if (e.shiftKey) {
							assert.equal(evt, 'onShiftEnter');
						} else {
							assert.equal(evt, 'onEnter');
						}
						break;
					case 27:
						assert.equal(evt, 'onEscape');
						break;
					case 40:
						assert.equal(evt, 'onArrowDown');
						break;
					case 38:
						assert.equal(evt, 'onArrowUp');
						break;
					case 67:
						assert.equal(evt, 'onCtrlC');
						assert(e.ctrlKey);
						break;
					case 65:
						assert.equal(evt, 'onCtrlA');
						assert(e.ctrlKey);
						break;
					case 69:
						assert.equal(evt, 'onCtrlE');
						assert(e.ctrlKey);
						break;
					case 66:
						assert.equal(evt, 'onAltB');
						assert(e.altKey);
						break;
					case 70:
						assert.equal(evt, 'onAltF');
						assert(e.altKey);
						break;
					default:
						assert.equal(evt, 'onKeyUp');
						break;
				}
			};
			return obj;
		}, {})));

		// Simulate each event
		el.simulate('keyUp', { which: 13 });
		el.simulate('keyUp', { which: 13, shiftKey: true });
		el.simulate('keyUp', { which: 27 });
		el.simulate('keyUp', { which: 40 });
		el.simulate('keyUp', { which: 38 });
		el.simulate('keyUp', { which: 67, ctrlKey: true });
		el.simulate('keyUp', { which: 65, ctrlKey: true });
		el.simulate('keyUp', { which: 69, ctrlKey: true });
		el.simulate('keyUp', { which: 66, altKey: true });
		el.simulate('keyUp', { which: 70, altKey: true });
		el.simulate('keyUp', { which: 0 });
		assert.equal(called, evts.length);
	});
});
