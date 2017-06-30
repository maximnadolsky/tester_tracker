var AppDispatcher = require('../dispatcher/AppDispatcher');
var SheetDataTableConstants = require('../constants/SheetDataTableConstants');
var SheetDataTableAPI = require('../utils/SheetDataTableAPI');

var SheetDataTableActions = {
    getData: function(id) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.GET_DATA
        });
        SheetDataTableAPI.getData(id);
    },

    getUsers: function() {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.GET_USERS
        });
        SheetDataTableAPI.getUsers();
    },

    addRow: function(rowIdx) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.ROW_ADD,
            rowIdx: rowIdx
        });
    },

    sortGrid : function (rows) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.SORT_GRID,
            rows: rows
        });
    },

    updateRowOnServer: function(rowIdx) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.UPDATE_ROW_ON_SERVER,
            rowIdx: rowIdx
        });
    },

    setInitialRows: function(rows) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.SET_INITIAL_ROW,
            data: rows
        });
    },

    updateTableRow: function(rowIdx, updated) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.UPDATE_TABLE_ROW,
            data: {
                rowIdx: rowIdx, 
                updated: updated
            }
        });
    },

    viewComment: function (rowId, text) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.VIEW_COMMENT,
            data: {
                rowId: rowId,
                text: text
            }
        });
    },

    updateComment: function(rowIdx, text) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.UPDATE_COMMENT,
            data: {
                rowIdx: rowIdx,
                text: text
            }
        });
    },

    deleteRow: function(rowIdx) {
        AppDispatcher.handleViewAction({
            actionType: SheetDataTableConstants.DELETE_ROW,
            rowIdx: rowIdx
        });
    },

};

module.exports = SheetDataTableActions;