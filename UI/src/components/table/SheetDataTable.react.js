var React = require('react');
import { browserHistory, hashHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router';
//var ReactWithAddons = require('react/dist/react-with-addons');
var ReactDataGrid = require('react-data-grid');
//var AppConstants = require('../../constants/AppConstants.js');
var SheetDataTableActions = require('../../actions/SheetDataTableActions');
var SheetDataTableStore = require('../../stores/SheetDataTableStore');

var Header = require('./Header.react');
var ViewComment = require('./ViewComment.react');
var TableUtils = require('./utils');

const { Editors, Toolbar, Formatters } = require('react-data-grid-addons');
const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;


var SummaryRow = function(props) {

    return (<div className="summary-table row">
                <div className="col-md-4 summary-table-cell">
                    TOTAL:
                </div>
                <div className="col-md-2 summary-table-cell">Estimate Hours: {props.data.totalEstimateHours}</div>
                <div className="col-md-2 summary-table-cell">Left Hours: {props.data.totalLeftHours}</div>
                <div className="col-md-2 summary-table-cell">Done, %: {props.data.totalPerсentDone}</div>
                <div className="col-md-2 summary-table-cell">
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{width: props.data.totalPerсentDone + '%'}}>
                        {props.data.totalPerсentDone + '%'}
                        </div>
                    </div>
                </div>
            </div>)
};

var SheetDataTable = withRouter(React.createClass({

    getDataFromStore(props) {
        const { id } = props ? props.params : this.props.params;
        if (id) {
            SheetDataTableActions.getData(id);
        }
    },

    getInitialState: function () {
        return {isReady : false};
    },

    _onChange: function () {
        var data = SheetDataTableStore.getTableData();
        if (data) {
            var rows = TableUtils.createRows(data.rows);

            setTimeout(function() {
                SheetDataTableActions.setInitialRows(rows);
            }, 0);             
        }
        else {
            this.setState({isReady: true});
        }
    },

    _userChange : function () {
        var self = this;
        this.setState({users: SheetDataTableStore.getUsers()});

        setTimeout(function() {
           self.getDataFromStore();
        }, 0);
    },

    _updateRows: function() {
        var serverTableData = SheetDataTableStore.getTableRows();
        TableUtils.calculateAndUpdateDataRows(serverTableData);
        
        if (this.isMounted()) {
            this.setState({tableRows : serverTableData, summaryTable: TableUtils.calculateTableSummary(serverTableData), isReady: true}); 
        }
    },

    handleGridSort(sortColumn, sortDirection) {
        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
            }
        };

        const rows = sortDirection === 'NONE' ? this.state.tableRows.slice(0) : this.state.tableRows.sort(comparer);
        SheetDataTableActions.sortGrid(rows);
    },

    getRowAt: function(index) {
        if (index < 0 || index > this.state.tableRows.length) {
            return undefined;
        }
        return this.state.tableRows[index];
    },

    rowsCount : function () {
        return this.state.tableRows.length;
    },

    getColumn : function () {
        var serverTableData = SheetDataTableStore.getTableData();
        return TableUtils.returnColumns(serverTableData);
    },

    handleAddRow: function({ newRowIndex }) {
        SheetDataTableActions.addRow(newRowIndex);
        
        // const newRow = {
        //     value: newRowIndex,
        //     id: newRowIndex,
        //     done: 0,
        //     estimatehours: 0,
        //     isNew: true
        // };

        // const internalRows = this.state.tableRows;
        // allData.rows = ReactWithAddons.addons.update(internalRows, {$push: [newRow]});
        // this.setState({tableRows: allData.rows, summaryTable: calculateTableSummary(allData.rows)});
    },

    handleRowUpdated: function({ rowIdx, updated }) {
        SheetDataTableActions.updateTableRow(rowIdx, updated);
    },

    componentDidMount: function () {
        SheetDataTableStore.addChangeListener(this._onChange);
        SheetDataTableStore.addUserChangeListener(this._userChange);
        SheetDataTableStore.addRowsChangeListener(this._updateRows);

        SheetDataTableStore.init();
    },

    componentWillUnmount: function () {
        SheetDataTableStore.removeChangeListener(this._onChange);
        SheetDataTableStore.removeUserChangeListener(this._userChange);
        SheetDataTableStore.removeRowsChangeListener(this._updateRows);
    },

	componentWillReceiveProps(nextProps) {
        this.getDataFromStore(nextProps);
	},

    render: function () {
        var content;

        if (this.state.isReady && this.state.tableRows && this.state.users) {
            content = 
                <div>
                    <Header/>
                    <ReactDataGrid
                        enableCellSelect={true}
                        onGridSort={this.handleGridSort}
                        columns={this.getColumn()}
                        rowGetter={this.getRowAt}
                        rowsCount={this.rowsCount()}
                        minHeight={700}
                        toolbar={<Toolbar onAddRow={this.handleAddRow}/>}
                        onRowUpdated={this.handleRowUpdated}
                    />
                    <SummaryRow className="summary-row" data={this.state.summaryTable}/>
                    <input className="btn btn-default pull-right" type="button" value="Save All Changes" />
                </div>;
        }

        return (
            <div>            
                {content}
                <ViewComment/>
            </div>
        );
    }
}));

module.exports = SheetDataTable;