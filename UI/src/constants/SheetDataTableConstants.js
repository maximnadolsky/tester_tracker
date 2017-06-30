/**
 * Created by MaksimNadolsky on 1/24/2017.
 */
//var keyMirror = require('react/lib/keyMirror');
var keyMirror = require('keyMirror');

// Define action constants
module.exports = keyMirror({
    GET_DATA: null,
    ROW_ADD: null,
    GET_USERS: null,
    GET_DATA_RESPONSE: null,
    GET_DATA_RESPONSE_ERROR: null,
    UPDATE_DATA_RESPONSE_ERROR: null,
    GET_USERS_RESPONSE: null,
    UPDATE_ROW_ON_SERVER: null,
    SET_INITIAL_ROW: null,
    UPDATE_TABLE_ROW: null,
    VIEW_COMMENT: null,
    UPDATE_COMMENT: null,
    DELETE_ROW: null,
    DELETE_TABLE_RESPONSE: null,
    SORT_GRID: null,
    TASK_ADDED_RESPONSE: null,
    TASK_UPDATED_RESPONSE: null
});