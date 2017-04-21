'use strict';

module.exports = function selectionReducer (state, action) {
	if (action.type === 'changeSelection') {
		state.selection = action.selection;
	}

	return state;
};

module.exports.changeSelection = function changeSelection (selection) {
	return {
		type: 'changeSelection',
		selection: selection
	};
};
