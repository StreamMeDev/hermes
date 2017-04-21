/* global describe, it */
var assert = require('assert');
var enzyme = require('enzyme');
var React = require('react');
var Hermes = React.createFactory(require('../lib/hermes'));
var Wrapper = require('../lib/wrapper');

describe('hermes', function () {
	it('should render', function () {
		var el = enzyme.shallow(Hermes());
		assert(el.is(Wrapper));
		assert.equal(el.find('[contentEditable]').length, 1);
		assert.equal(el.find('[contentEditable]').children().length, 0);
	});
});
