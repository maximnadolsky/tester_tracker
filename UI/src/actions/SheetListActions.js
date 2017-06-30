var AppDispatcher = require('../dispatcher/AppDispatcher');
var SheetListConstants = require('../constants/SheetListConstants');
var SheetListAPI = require('../utils/SheetListAPI');

var SheetListActions = {

    getAll: function() {
        AppDispatcher.handleViewAction({
            actionType: SheetListConstants.GET_ALL
        });

        SheetListAPI.getAll();
    },
    
    setSelected: function(id) {
        AppDispatcher.handleViewAction({
            actionType: SheetListConstants.SET_SELECTED,
            id: id
        });
    },

    add: function(name) {
        AppDispatcher.handleViewAction({
            actionType: SheetListConstants.ADD_NEW,
            name: name
        });

        SheetListAPI.add(name);
    },

    update: function(id, name, status) {
        AppDispatcher.handleViewAction({
            actionType: SheetListConstants.UPDATE,
            data: {
                id: id,
                name: name,
                status: status
            }
        });

        SheetListAPI.update(id, name, status);
    },

    delete: function(id) {
        AppDispatcher.handleViewAction({
            actionType: SheetListConstants.DELETE,
            id: id
        });

        SheetListAPI.delete(id);
    },

    updateSort: function(items) {
        AppDispatcher.handleViewAction({
            actionType: SheetListConstants.SORT_UPDATE,
            data: items
        });
    }
};

module.exports = SheetListActions;