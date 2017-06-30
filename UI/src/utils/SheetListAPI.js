var SheetListServerActions = require('../actions/SheetListServerActions');
var request = require('superagent');
var AppConstants = require('../constants/AppConstants.js');

module.exports = {

    getAll: function() {
        request.get(AppConstants.sheetListsUrl)
            .set('Accept', 'application/json')
            .end(function(err, response) {
                if (err) return console.error(err);

                SheetListServerActions.sheetListGetAll(response.body);
            });
    },

    add: function(name) {
        request.post(AppConstants.sheetListsUrl)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({ name: name })
            .end(function(err, response) {
                if (err) return console.error(err);

                SheetListServerActions.sheetListAdd(response.body);
            });
    },

    update: function(id, name, status) {
        request.put(AppConstants.sheetListsUrl)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({id: id, name: name, status: status})
            .end(function(err, response) {
                if (err) return console.error(err);

                SheetListServerActions.sheetListUpdate(response.body);
            });
    },

    delete: function(id) {
        request.del(AppConstants.sheetListsUrl + '/' + id)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end(function(err, response) {
                if (err) return console.error(err);

                SheetListServerActions.sheetListDelete(response.body);
            });
    }
};