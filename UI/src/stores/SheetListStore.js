var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SheetListConstants = require('../constants/SheetListConstants');
var SheetListAPI = require('../utils/SheetListAPI');
var _ = require('underscore');
import lodash from 'lodash';

var _selected = null,
    _sheetList = [],
    _initCalled = false;


AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch (action.actionType) {
        case SheetListConstants.SORT_UPDATE:
            //TODO: found beter solution
            if (action.data.length) {
                lodash.remove(_sheetList, function(item) {
                    return item.status === action.data[0].status;
                });
                _sheetList = _sheetList.concat(action.data);
            }
            SheetListStore.emitChange();
            break;

        case SheetListConstants.ADD_NEW_RESPONSE:
            _sheetList.splice(0, 0, {
                id: action.data.id,
                name: action.data.name,
                status: 'active'
            });
            SheetListStore.emitChange();
            break;

        case SheetListConstants.DELETE_RESPONSE:
            lodash.remove(_sheetList, function(item) {
                return item.id === action.data;
            });
            SheetListStore.emitChange();
            break;

        case SheetListConstants.UPDATE_RESPONSE:
            var item = lodash.find(_sheetList, { id: action.data.id });
            item.name = action.data.name;
            SheetListStore.emitChange();
            break;

        case SheetListConstants.GET_ALL_RESPONSE:
            _sheetList = action.data;
            SheetListStore.emitChange();
            break;
        
        case SheetListConstants.SET_SELECTED:
            _selected = lodash.find(_sheetList, { id: action.id });
             SheetListStore.emitSelectedChange();
            break;

        default:
            return true;
    }
    return true;
});

var SheetListStore = _.extend({}, EventEmitter.prototype, {

    init: function() {
        if (_initCalled)
            return;

        _initCalled = true
        SheetListAPI.getAll();
    },

    getAll: function() {
        return _sheetList;
    },

    getSelected: function() {
        return _selected;
    },

    // Emit Change event
    emitChange: function() {
        this.emit('change');
    },

    // Add change listener
    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    // Remove change listener
    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    // Emit Change event
    emitSelectedChange: function() {
        this.emit('change_selected');
    },

    // Add change listener
    addSelectedChangeListener: function(callback) {
        this.on('change_selected', callback);
    },

    // Remove change listener
    removeSelectedChangeListener: function(callback) {
        this.removeListener('change_selected', callback);
    }




});

module.exports = SheetListStore;