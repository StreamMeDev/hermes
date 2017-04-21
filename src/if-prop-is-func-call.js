// I hate myself for doing this, but here is a helper function...
module.exports = function ifPropCall (props, name, ...args) {
	if (typeof props[name] === 'function') {
		props[name](...args);
	}
};
