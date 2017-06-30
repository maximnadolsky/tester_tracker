var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SheetDataTableConstants = require('../constants/SheetDataTableConstants');
var AppConstants = require('../constants/AppConstants.js');

var _ = require('underscore');
var SheetDataTableAPI = require('../utils/SheetDataTableAPI');
import lodash from 'lodash';

const dropdownValues = AppConstants.table.dropdownValue;
const emit_change = 'change';
const emit_user_change = 'user_change';
const emit_table_rows_change = 'table_rows_change';
const emit_view_comment_change = 'view_comment_change';
const emit_has_error_occurred = 'has_error_occurred';

//server data
var _sheetDataTableList = null,
    _users = [],
    _initCalled = false,
    //client data
    _tableRows = [],
    _spreadsheetId = null;


// TODO: comment field should not be required

function _mapTableRow(row) {
    var values = [];
    var user = lodash.find(_users, { title: row.assignee });

    for (var prop in row) {
        if (prop.indexOf(AppConstants.table.columnPrefix) >= 0) {
            var columnId = parseInt(prop.replace(AppConstants.table.columnPrefix, ""));

            values.push({
                id: columnId,
                value: AppConstants.table.dropdownValue.indexOf(row[prop])
            });
        }
    }

    return {
        assigneeId: user ? user.id : null,
        values: values,
        name: row.taskName,
        spreadsheetId: _spreadsheetId,
        estimateHours: row.estimateHours,
        comment: row.comment || ' -- '
    };
}

function validateModel(model) {
    var errors = [];
    
    if (!model.name) {
        errors.push('Please enter task name.');
    }

    if (!model.assigneeId) {
        errors.push('Please select user name.');
    }

    return errors;
}

function _uploadRowToServer(row) {
    var model = _mapTableRow(row);
    var errors = validateModel(model);
   
    if (errors.length) {
        SheetDataTableStore.emitErrorOccurred(errors.join(' '));
        return;
    }

    if (row.taskId < 0) {
        SheetDataTableAPI.addTask(row.id, model);
    } else {
        SheetDataTableAPI.updateTask(row.taskId, model);
    }
}

function isUpdated(currentRow, updated) {
    let updatedKey = Object.keys(updated)[0];
    return (!currentRow[updatedKey] || currentRow[updatedKey].toString() !== updated[updatedKey]);
}

function _deleteRow(index) {
    let tableRow = lodash.find(_tableRows, { id: index });
    if (tableRow.taskId > 0) {
        SheetDataTableAPI.deleteTask(tableRow.taskId);
    } else {
        lodash.remove(_tableRows, function(item) {
            return item.id === tableRow.id;
        });
    }
}

function addNewRow(rowIdx) {
    let newRow = {
        taskId: -1,
        taskName: 'New Task Name',
        done: 0,
        estimateHours: 0,
        saveRowAction: rowIdx,
        deleteRowAction: rowIdx,
        id: rowIdx,
        value: rowIdx
    };

    for (let i = 0; i < _sheetDataTableList.headers.length; i++) {
        newRow[AppConstants.table.columnPrefix + _sheetDataTableList.headers[i].id] = dropdownValues[2];
    }

    _tableRows.splice(0, 0, newRow);
}

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch (action.actionType) {

        case SheetDataTableConstants.ROW_ADD:
            addNewRow(action.rowIdx);
            SheetDataTableStore.emitRowsChange();
            break;

        case SheetDataTableConstants.UPDATE_ROW_ON_SERVER:
            var tableRow = lodash.find(_tableRows, { id: action.rowIdx });
            _uploadRowToServer(tableRow);
            break;

        case SheetDataTableConstants.TASK_ADDED_RESPONSE:
            var tableRow = lodash.find(_tableRows, { id: action.data.rowIdx });
            tableRow.taskId = action.data.response.id;
            tableRow.saveRowAction = -1;
            SheetDataTableStore.emitRowsChange();
            break;

        case SheetDataTableConstants.TASK_UPDATED_RESPONSE:
            var tableRow = lodash.find(_tableRows, { taskId: action.data.id });
            tableRow.saveRowAction = -1;
            SheetDataTableStore.emitRowsChange();
            break;

        case SheetDataTableConstants.GET_DATA_RESPONSE:
            _sheetDataTableList = action.data;
            _spreadsheetId = action.data.id;

            SheetDataTableStore.emitChange();
            break;

        case SheetDataTableConstants.GET_DATA_RESPONSE_ERROR:
            _sheetDataTableList = null;
            SheetDataTableStore.emitErrorOccurred(action.err);
            SheetDataTableStore.emitChange();
            break;

        case SheetDataTableConstants.UPDATE_DATA_RESPONSE_ERROR:
            SheetDataTableStore.emitErrorOccurred(action.err);
            break;

        case SheetDataTableConstants.GET_USERS_RESPONSE:
            _users = action.data;
            SheetDataTableStore.emitUserChange();
            break;

        case SheetDataTableConstants.SET_INITIAL_ROW:
            _tableRows = action.data;
            SheetDataTableStore.emitRowsChange();
            break;

        case SheetDataTableConstants.UPDATE_TABLE_ROW:
            let currentRow = _tableRows[action.data.rowIdx];
            if (isUpdated(currentRow, action.data.updated)) {
                Object.assign(currentRow, action.data.updated, { saveRowAction: currentRow.id });
                SheetDataTableStore.emitRowsChange();
            }
            break;

        case SheetDataTableConstants.VIEW_COMMENT:
            SheetDataTableStore.emitViewCommentChange(action.data.rowId, action.data.text);
            break;

        case SheetDataTableConstants.SORT_GRID:
            _tableRows = action.rows;
            SheetDataTableStore.emitRowsChange();
            break;

        case SheetDataTableConstants.UPDATE_COMMENT:
            var tableRow = lodash.find(_tableRows, { id: action.data.rowIdx });
            Object.assign(tableRow, { comment: action.data.text, saveRowAction: tableRow.id });
            SheetDataTableStore.emitRowsChange();
            break;

        case SheetDataTableConstants.DELETE_ROW:
            _deleteRow(action.rowIdx);
            SheetDataTableStore.emitRowsChange();
            break;

        case SheetDataTableConstants.DELETE_TABLE_RESPONSE:
            lodash.remove(_tableRows, function(item) {
                return item.taskId === action.data;
            });
            SheetDataTableStore.emitRowsChange();
            break;

        default:
            return true;
    }

    // If action was responded to, emit change event
    //SheetDataTableStore.emitChange();

    return true;

});

// Extend SheetDataTableStore with EventEmitter to add eventing capabilities
var SheetDataTableStore = _.extend({}, EventEmitter.prototype, {

    init: function() {
        console.log('init func');
        if (_initCalled)
            return;

        _initCalled = true;
        SheetDataTableAPI.getUsers();
    },

    getTableData: function() {
        return _sheetDataTableList;
    },

    getTableRows: function() {
        return _tableRows;
    },

    getUsers: function() {
        return _users;
    },

    // Emit Change event
    emitChange: function() {
        this.emit(emit_change);
    },

    emitUserChange: function() {
        this.emit(emit_user_change);
    },

    emitRowsChange: function() {
        this.emit(emit_table_rows_change);
    },

    emitViewCommentChange: function(...args) {
        this.emit(emit_view_comment_change, ...args);
    },

    // Add change listener
    addChangeListener: function(callback) {
        this.on(emit_change, callback);
    },

    addUserChangeListener: function(callback) {
        this.on(emit_user_change, callback);
    },

    addRowsChangeListener: function(callback) {
        this.on(emit_table_rows_change, callback);
    },

    addViewCommentListener: function(callback) {
        this.on(emit_view_comment_change, callback);
    },

    // Remove change listener
    removeChangeListener: function(callback) {
        this.removeListener(emit_change, callback);
    },

    removeUserChangeListener: function(callback) {
        this.removeListener(emit_user_change, callback);
    },

    removeRowsChangeListener: function(callback) {
        this.on(emit_table_rows_change, callback);
    },

    removeViewCommentListener: function(callback) {
        this.removeListener(emit_view_comment_change, callback);
    },

    // -- error listener

    emitErrorOccurred: function(...args) {
        this.emit(emit_has_error_occurred, ...args);
    },

    addErrorOccurredListener: function(callback) {
        this.on(emit_has_error_occurred, callback);
    },

    removeErrorOccurredListener: function(callback) {
        this.removeListener(emit_has_error_occurred, callback);
    }

});

module.exports = SheetDataTableStore;