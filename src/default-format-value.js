const nbsp = String.fromCharCode(160);

module.exports = function defaultFormatValue (value) {
	// Dont process empty string
	if (!value || value === '') {
		return value;
	}
	
	const parts = value.split(' ');

	// Wrap in spans
	let s = parts.map(function (p, i) {
		if (p === '') {
			return p;
		}

		// Highlight mentions and tags
		if ((p.charAt(0) === '#' || p.charAt(0) === '@') && p.length > 1) {
			return `<span class="hermes-content-word highlight">${p}</span>`;
		}

		// Just a normal part
		return `<span class="hermes-content-word">${p}</span>`;
	});

	return s.join(' ');
};
