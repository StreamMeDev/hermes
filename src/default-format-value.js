const nbsp = String.fromCharCode(160);

export default function defaultFormatValue (v) {
	// Dont process empty string
	if (!v || v === '') {
		return v;
	}

	// A flag for the presence of a trailing space
	let hasTrailingSpace = false;

	// Replace non-breaking spaces before spliting
	const parts = v.replace(nbsp, ' ').split(' ');

	// Wrap in spans
	const s = parts.map(function (p, i) {
		// If the last character is a space,
		// return nbsp, aka: charCode 160
		if (i === parts.length - 1 && p === '') {
			hasTrailingSpace = true;
		}
		if (p === '') {
			return p;
		}

		// Highlight mentions and tags
		if ((p.charAt(0) === '#' || p.charAt(0) === '@') && p.length > 1) {
			return `<span class="hermes-content-word highlight">${p}</span>`;
		}

		// Just a normal part
		return `<span class="hermes-content-word">${p}</span>`;
	}).filter(function (p) {
		// remove trailing space entry if there
		return p !== '';
	});

	// Add trailing space back on
	return s.join(' ') + (hasTrailingSpace ? nbsp : '');
}
