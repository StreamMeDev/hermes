'use strict';

export default function valueReducer (state, action) {
	if (action.type === 'changeValue') {
		state.value = action.value;
		state.suggestionIndex = -1;
	}

	return state;
}

export function changeValue (value) {
	return {
		type: 'changeValue',
		value: value
	};
}
