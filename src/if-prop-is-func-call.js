// I hate myself for doing this, but here is a helper function...
export default function ifPropCall (props, name, ...args) {
	if (typeof props[name] === 'function') {
		props[name](...args);
	}
}
