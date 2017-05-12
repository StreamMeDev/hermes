'use strict';

module.exports = function valueReducer (state, action) {
	if (action.type === 'changeValue') {
		state.value = action.value;
		state.suggestionIndex = -1;
	}

	return state;
};

module.exports.changeValue = function changeValue (value) {
	return {
		type: 'changeValue',
		value: value
	};
};
