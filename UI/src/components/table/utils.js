var React = require('react');
import { browserHistory, hashHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router';
var AppConstants = require('../../constants/AppConstants.js');
var SheetDataTableActions = require('../../actions/SheetDataTableActions');
var SheetDataTableStore = require('../../stores/SheetDataTableStore');
var ViewComment = require('./ViewComment.react');
const TableFormatters = require('./Formaters.react');

const { Editors, Toolbar, Formatters } = require('react-data-grid-addons');
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const dropdownValues = AppConstants.table.dropdownValue;

function calculateAndUpdateDataRows(rows) {
    for (let i = 0; i < rows.length; i++) {
        let item = rows[i],
            summaryPerсentDone = 0,
            activeValueCount = 0;

        for (var prop in item) {

            if (prop.indexOf(AppConstants.table.columnPrefix) >= 0) {
                var value = item[prop];

                if (value !== '-') {
                    activeValueCount++;
                }

                switch (value) {
                    case '50%':
                        summaryPerсentDone += 50;
                        break;

                    case '100%':
                        summaryPerсentDone += 100;
                        break;

                    case '0%':
                    case 'bug':
                    case '-':
                        break;

                    default:
                        console.error('calculateAndUpdateDataRows: case not found: ', value);
                        break;
                }

                item.done = activeValueCount ? Math.round(summaryPerсentDone / activeValueCount) : 0;
                item.leftHours = (item.estimateHours - item.estimateHours * item.done / 100).toFixed(1);
            }
        }
        activeValueCount === 0 ? item.isCounted = false : item.isCounted = true;
    }
}

// TODO: Incorrectly calculates the data if row contains all gaps.

function calculateTableSummary(rows) {
    var summaryPerсentDone = 0.0,
        summaryEstimateHours = 0.0,
        summaryLeftHours = 0.0,
        countedRows = 0,
        rowsLength = rows.length;

    for (let i = 0; i < rowsLength; i++) {
        let item = rows[i];
        if (rows[i].isCounted) {
            countedRows++;
        }
        summaryPerсentDone += item.done;
        summaryLeftHours += parseFloat(item.leftHours);
        summaryEstimateHours += parseFloat(item.estimateHours);
    }

    let totalDone = Math.round(summaryPerсentDone / countedRows);
    if (countedRows === 0 && isNaN(totalDone)) {
        totalDone = 100;
    }

    return {
        totalPerсentDone: totalDone,
        totalLeftHours: summaryLeftHours.toFixed(1),
        totalEstimateHours: summaryEstimateHours.toFixed(1)
    }
}

//send rowID and comment text to the action and open Modal Window
function viewComment(index) {
    var data = SheetDataTableStore.getTableRows();
    var text = data[index].comment;
    var rowId = data[index].id;

    SheetDataTableActions.viewComment(rowId, text);
}

function returnColumns(data) {
    var users = SheetDataTableStore.getUsers();
    var _columns = [{
            key: 'id',
            name: 'Idx',
            width: 40,
        },
        {
            key: 'taskName',
            name: 'Task',
            editable: true,
            resizable: true,
            locked: true,
            sortable: true

        },
        {
            key: 'assignee',
            name: 'Assignee',
            editor: < AutoCompleteEditor options = { users }
            />,
            editable: true,
            resizable: true,
            sortable: true

        },
        {
            key: 'comment',
            name: 'Comments',
            resizable: true,
            events: {
                onDoubleClick: function(ev, args) {
                    viewComment(args.rowIdx);
                }
            }
        },
        {
            key: 'estimateHours',
            name: 'Estimate hours',
            editable: true,
            resizable: true,
            sortable: true


        },
        {
            key: 'leftHours',
            name: 'Hours left',
            editable: false,
            resizable: true,
            sortable: true

        },
        {
            key: 'done',
            name: '% Done',
            formatter: TableFormatters.PercentCompleteFormatter,
            resizable: true,
            sortable: true

        },
        {
            key: 'deleteRowAction',
            name: 'Delete',
            formatter: TableFormatters.ActionDeleteRowFormatter,
            width: 60,
            resizable: true
        },
        {
            key: 'saveRowAction',
            name: 'Save',
            formatter: TableFormatters.ActionSaveRowFormatter,
            width: 60,
            resizable: true
        }
    ];
    if (data.headers) {
        let headerColumns = [];
        for (let i = 0; i < data.headers.length; i++) {
            headerColumns.push({
                key: AppConstants.table.columnPrefix + data.headers[i].id,
                name: data.headers[i].name,
                editor: < DropDownEditor options = { dropdownValues } />,
                editable: true,
                resizable: true
            });
            _columns.splice(2, 0, headerColumns[i])
        }
    }
    return _columns;
}

function createRows(dataRows) {
    let rows = [];
    for (let i = 0; i < dataRows.length; i++) {
        var item = {
            id: i,
            taskId: dataRows[i].id,
            saveRowAction: -1,
            deleteRowAction: i,
            taskName: dataRows[i].name,
            assignee: dataRows[i].assignee.title,
            comment: dataRows[i].comment,
            estimateHours: dataRows[i].estimateHours,
            leftHours: 0,
            done: 0,
            isCounted: true
        };
        for (let j = 0; j < dataRows[i].values.length; j++) {
            item[AppConstants.table.columnPrefix + dataRows[i].values[j].id] = dropdownValues[dataRows[i].values[j].value];
        }
        rows.push(item);
    }

    calculateAndUpdateDataRows(rows);

    return rows;
}

export { calculateTableSummary, calculateAndUpdateDataRows, viewComment, returnColumns, createRows }