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
	let s = parts.map(function (p, i) {
		if (p === '') {
			// If the last character is a space,
			// return nbsp, aka: charCode 160
			if (i === parts.length - 1) {
				hasTrailingSpace = true;
			}
			return p;
		}

		// Highlight mentions and tags
		if ((p.charAt(0) === '#' || p.charAt(0) === '@') && p.length > 1) {
			return `<span class="hermes-content-word highlight">${p}</span>`;
		}

		// Just a normal part
		return `<span class="hermes-content-word">${p}</span>`;
	});

	// remove trailing space entry if there
	if (s[s.length - 1] === '') {
		s.pop();
	}

	// Add trailing space back on
	return s.join(' ') + (hasTrailingSpace ? nbsp : '');
}
