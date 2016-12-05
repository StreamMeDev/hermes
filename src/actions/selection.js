'use strict';

export default function selectionReducer (state, action) {
	if (action.type === 'hermesChangeSelection') {
		state.selection = action.selection;
	}

	return state;
}

export function changeSelection (selection) {
	return {
		type: 'hermesChangeSelection',
		selection: selection
	};
}
