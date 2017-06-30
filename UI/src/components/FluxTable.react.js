/**
 * Created by MaksimNadolsky on 1/24/2017.
 */
var React = require('react');
var ReactDataGrid = require('react-data-grid');


var FluxTable = React.createClass({
    getInitialState: function () {
        this._columns = [
            {
                key: 'id',
                name: 'ID',
                width: 80
            },
            {
                key: 'task',
                name: 'Title',
                editable: true
            },
            {
                key: 'priority',
                name: 'Priority',
                editable: true
            },
            {
                key: 'issueType',
                name: 'Issue Type',
                editable: true
            },
            {
                key: 'complete',
                name: '% Complete',
                editable: true
            },
        ];
        return {rows: this.createRows()};
    },

    createRows(numberOfRows) {
        let rows = [];
        for (let i = 1; i <= numberOfRows; i++) {
            rows.push({
                id: i,
                task: 'Task ' + i,
                complete: Math.min(100, Math.round(Math.random() * 110)),
                priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
                issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
            });
        }
        return rows;
    },

    rowGetter(i) {
        return this.state.rows[i];
    },

    handleRowUpdated({rowIdx, updated}) {
        // merge updated row with current row and rerender by setting state
        const rows = this.state.rows;
        Object.assign(rows[rowIdx], updated);
        this.setState({rows: rows});
    },

    render: function () {
        var self = this, table = this.props.data, tableHeaders = this.props.data.headers, tableRows = this.props.data.rows;
                console.log(tableRows);
        return (
            <div>
                {table && tableHeaders && tableRows &&
                <ReactDataGrid
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.rows.length}
                    minHeight={500}
                    onRowUpdated={this.handleRowUpdated}/>
                }
            </div>
        )
    }

});

//
// var ExampleTable = React.createClass({
//
//     getInitialState: function () {
//         this._columns = [
//             {
//                 key: 'id',
//                 name: 'ID',
//                 width: 80
//             },
//             {
//                 key: 'task',
//                 name: 'Task',
//                 editable: true
//             },
//             {
//                 key: 'assignee',
//                 name: 'Assignee',
//                 editable: true
//             },
//             {
//                 key: 'comment',
//                 name: 'Comments',
//                 editable: true
//             },
//             {
//                 key: 'estimatehours',
//                 name: 'Estimatehours',
//                 editable: true
//             },
//             {
//                 key: 'leftHours',
//                 name: 'Hours left',
//                 editable: true
//             },
//             {
//                 key: 'done',
//                 name: '% Done',
//                 editable: true
//             }
//         ];
//         return {rows: this.createRows(this.props.length)};
//     },
//
//     createRows(numberOfRows) {
//         let rows = [];
//         for (let i = 0; i < numberOfRows; i++) {
//             rows.push({
//                 id: i,
//                 task: i,
//                 assignee: Math.min(100, Math.round(Math.random() * 110)),
//                 estimatehours: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
//                 leftHours: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
//                 done: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)]
//             });
//         }
//         return rows;
//     },
//
//     rowGetter(i) {
//         return this.state.rows[i];
//     },
//
//     handleRowUpdated({rowIdx, updated}) {
//         // merge updated row with current row and rerender by setting state
//         const rows = this.state.rows;
//         Object.assign(rows[rowIdx], updated);
//         this.setState({rows: rows});
//     },
//
//     render: function () {
//         return (
//             <ReactDataGrid
//                 enableCellSelect={true}
//                 columns={this._columns}
//                 rowGetter={this.rowGetter}
//                 rowsCount={this.state.rows.length}
//                 minHeight={500}
//                 onRowUpdated={this.handleRowUpdated}/>
//         )
//     }
// });
//
//
// var FluxTable = React.createClass({
//
//     // Hide cart via Actions
//     closeCart: function () {
//         //SheetListActions.updateCartVisible(false);
//     },
//
//     // Show cart via Actions
//     openCart: function () {
//         //SheetListActions.updateCartVisible(true);
//     },
//
//     // Remove item from Cart via Actions
//     removeSheet: function (item) {
//         //SheetListActions.removeFromCart(sku);
//         //SheetListActions.updateCartVisible(false);
//     },
//     //
//     // mapThroughArrayOfObjects: function (arrayName) {
//     //     if (arrayName.isArray) {
//     //         {
//     //             Object.keys(arrayName).map(function (item) {
//     //                 return (
//     //                     <div key={item}>
//     //                         <div>
//     //                             {arrayName[item]['name']}
//     //                         </div>
//     //                         <div>
//     //                             {arrayName[item]['columnId']}
//     //                         </div>
//     //                     </div>
//     //                 )
//     //             })
//     //         }
//     //     }
//     // },
//
//     render: function () {
//         var self = this, table = this.props.data, tableHeaders = this.props.data.headers, tableRows = this.props.data.rows;
//         console.log(this.props.data.rows);
//         return (
//             <div>
//                 {
//                     tableRows && tableHeaders &&  table &&
//                 <ExampleTable
//                         length = {[tableRows.length]}
//                 />
//                 }
//                 <table>
//                     {table && tableHeaders && tableRows &&
//                     <tbody>
//                     <tr>
//                         <td>
//                             {table.id}
//                         </td>
//                         <td>
//                             {table.status}
//                         </td>
//                         <td>
//                             {Object.keys(tableHeaders).map(function (item) {
//                                 return (
//                                     <div key={item}>
//                                         <div>
//                                             {tableHeaders[item].name}
//                                         </div>
//                                         <div>
//                                             {tableHeaders[item].columnId}
//                                         </div>
//                                     </div>
//                                 )
//                             })}
//                         </td>
//                         <td>
//                             {tableRows[0].name}
//                         </td>
//                         <td>
//                             {tableRows[0].estimatehours}
//                         </td>
//                         <td>
//                             {tableRows[0].assignee.id}
//                         </td>
//                         <td>
//                             {tableRows[0].assignee.username}
//                         </td>
//                         <td>
//                             {tableRows[0].comment}
//                         </td>
//                         <td>
//                             {Object.keys(tableRows).map(function (i) {
//                                 return (
//                                     <div key={i}>
//                                         {Object.keys(tableRows[i].values).map(function (item) {
//                                             console.log(tableRows[i].values);
//                                             return (
//                                                 <div key={item}>
//                                                     <div>
//                                                         {tableRows[i].values[item].value}
//                                                     </div>
//                                                     <div>
//                                                         {tableRows[i].values[item].columnId}
//                                                     </div>
//                                                 </div>
//                                             )
//                                         })}
//                                     </div>
//                                 )
//                             })}
//                         </td>
//
//                         {/*{Object.keys(tableRows[0].values).map(function (item) {*/}
//                             {/*return (*/}
//                                 {/*<div key={item}>*/}
//                                     {/*<div>*/}
//                                         {/*{tableRows[item].values[item].value}*/}
//                                     {/*</div>*/}
//                                     {/*<div>*/}
//                                         {/*{tableRows[item].values[item].columnId}*/}
//                                     {/*</div>*/}
//                                 {/*</div>*/}
//                             {/*)*/}
//                         {/*})}*/}
//                     </tr>
//
//                     </tbody>
//                     }
//                 </table>
//             </div>
//
//         );
//     },
//
// });



//https://jsfiddle.net/k7tfnw1n/13/
module.exports = FluxTable;