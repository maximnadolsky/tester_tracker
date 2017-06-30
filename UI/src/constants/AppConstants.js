
var hostUrl = 'http://zhdanv10:88';
//var hostUrl = 'http://voronaa10:82';

module.exports = {
  hostUrl: hostUrl,
  urls: {
    task: hostUrl + '/api/task',
  },

  sheetListsUrl: hostUrl + '/api/spreadsheets',
  userListUrl: hostUrl + '/api/users',

  table: {
    dropdownValue: ['bug', '-', '0%', '50%', '100%'],
    columnPrefix: 'columnId_'
  }
};