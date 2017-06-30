var AppDispatcher = require('../dispatcher/AppDispatcher');
var SheetListConstants = require('../constants/SheetListConstants');
var SheetDataTableConstants = require('../constants/SheetDataTableConstants');

module.exports = {

    sheetListGetAll: function(data) {
        AppDispatcher.handleServerAction({
            actionType: SheetListConstants.GET_ALL_RESPONSE,
            data: data
        });
    },

    sheetListAdd: function(data) {
        AppDispatcher.handleServerAction({
            actionType: SheetListConstants.ADD_NEW_RESPONSE,
            data: data
        });
    },

    sheetListUpdate: function(data) {
        AppDispatcher.handleServerAction({
            actionType: SheetListConstants.UPDATE_RESPONSE,
            data: data
        });
    },

    sheetListDelete: function(data) {
        AppDispatcher.handleServerAction({
            actionType: SheetListConstants.DELETE_RESPONSE,
            data: data
        });
    },


    // -------------------------------------


    receiveTableData: function(data) {
        AppDispatcher.handleServerAction({
            actionType: SheetDataTableConstants.GET_DATA_RESPONSE,
            data: data
        });
    },

    receiveTableDataError: function(err) {
        AppDispatcher.handleServerAction({
            actionType: SheetDataTableConstants.GET_DATA_RESPONSE_ERROR,
            err: err
        });
    },

    updateDataTableError: function(err) {
        AppDispatcher.handleServerAction({
            actionType: SheetDataTableConstants.UPDATE_DATA_RESPONSE_ERROR,
            err: err
        });
    },

    receiveUsers: function(data) {
        AppDispatcher.handleServerAction({
            actionType: SheetDataTableConstants.GET_USERS_RESPONSE,
            data: data
        });
    },

    tableRowDelete: function(taskId) {
        AppDispatcher.handleServerAction({
            actionType: SheetDataTableConstants.DELETE_TABLE_RESPONSE,
            data: taskId
        });
    },

    taskAdded: function(rowIdx, response) {
        AppDispatcher.handleServerAction({
            actionType: SheetDataTableConstants.TASK_ADDED_RESPONSE,
            data: {
                rowIdx: rowIdx,
                response: response
            }
        });
    },

    taskUpdated: function(data) {
        AppDispatcher.handleServerAction({
            actionType: SheetDataTableConstants.TASK_UPDATED_RESPONSE,
            data: data
        });
    }


};