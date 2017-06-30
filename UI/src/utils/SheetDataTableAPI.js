var SheetListServerActions = require('../actions/SheetListServerActions');
var request = require('superagent');
var AppConstants = require('../constants/AppConstants.js');

module.exports = {

    getData: function(id) {
        request.get(AppConstants.sheetListsUrl + '/' + id)
            .set('Accept', 'application/json')
            .end(function(err, response) {
                if (err)
                    SheetListServerActions.receiveTableDataError(err.message);
                else
                    SheetListServerActions.receiveTableData(response.body);
            });
    },

    getUsers: function() {
        request.get(AppConstants.userListUrl)
            .set('Accept', 'application/json')
            .end(function(err, response) {
                if (err) return console.error(err);

                SheetListServerActions.receiveUsers(response.body);
            });
    },

    addTask: function(rowIdx, data) {
        request.post(AppConstants.urls.task)
            .set('Content-Type', 'application/json')
            .send(data)
            .end(function(err, response) {
                if (!err) {
                    SheetListServerActions.taskAdded(rowIdx, response.body);
                } else {
                    SheetListServerActions.updateDataTableError(err.message);
                }
            });
    },

    updateTask: function(rowId, data) {
        request.put(AppConstants.urls.task + '/' + rowId)
            .set('Content-Type', 'application/json')
            .send(data)
            .end(function(err, response) {
                if (!err) {
                    SheetListServerActions.taskUpdated(response.body);
                } else {
                    SheetListServerActions.updateDataTableError(err.message);
                }
            });
    },

    deleteTask: function(id) {
        request.del(AppConstants.urls.task + '/' + id)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end(function(err, response) {
                if (response.body) {
                    SheetListServerActions.tableRowDelete(id);
                } else {
                    SheetListServerActions.updateDataTableError(err.message);
                }
            });
    },

};