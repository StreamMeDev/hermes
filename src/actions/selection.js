'use strict';

export default function selectionReducer (state, action) {
	if (action.type === 'changeSelection') {
		state.selection = action.selection;
	}

	return state;
}

export function changeSelection (selection) {
	return {
		type: 'changeSelection',
		selection: selection
	};
}
