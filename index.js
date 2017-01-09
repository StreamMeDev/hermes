module.exports = require('./lib').HermesContainer;
module.exports.Hermes = require('./lib/hermes').Hermes;
module.exports.HermesWrapper = require('./lib/wrapper').HermesWrapper;

// Export actions
var selection = require('./lib/actions/selection');
module.exports.selectionReducer = selection.default;
module.exports.changeSelection = selection.changeSelection;

var suggestions = require('./lib/actions/suggestions');
module.exports.suggestionsReducer = suggestions.default;
module.exports.selectSuggestion = suggestions.selectSuggestion;
module.exports.setSuggestions = suggestions.setSuggestions;
module.exports.setSuggestionIndex = suggestions.setSuggestionIndex;
module.exports.decrSuggestionIndex = suggestions.decrSuggestionIndex;
module.exports.incrSuggestionIndex = suggestions.incrSuggestionIndex;

var value = require('./lib/actions/value');
module.exports.valueReducer = value.default;
module.exports.changeValue = value.changeValue;
