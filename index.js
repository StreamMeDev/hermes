'use strict';

module.exports = require('./lib');
module.exports.Hermes = require('./lib/hermes');
module.exports.HermesWrapper = require('./lib/wrapper');
module.exports.createDefaultStore = require('./lib/create-default-store');

// Export actions
var selection = require('./lib/actions/selection');
module.exports.selectionReducer = selection;
module.exports.changeSelection = selection.changeSelection;

var suggestions = require('./lib/actions/suggestions');
module.exports.suggestionsReducer = suggestions;
module.exports.selectSuggestion = suggestions.selectSuggestion;
module.exports.setSuggestions = suggestions.setSuggestions;
module.exports.setSuggestionIndex = suggestions.setSuggestionIndex;
module.exports.decrSuggestionIndex = suggestions.decrSuggestionIndex;
module.exports.incrSuggestionIndex = suggestions.incrSuggestionIndex;

var value = require('./lib/actions/value');
module.exports.valueReducer = value;
module.exports.changeValue = value.changeValue;
