var React = require('react');
import { browserHistory, hashHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router';
var AppConstants = require('../../constants/AppConstants.js');
var SheetDataTableActions = require('../../actions/SheetDataTableActions');
var SheetDataTableStore = require('../../stores/SheetDataTableStore');

const PercentCompleteFormatter = React.createClass({
    propTypes: {
        value: React.PropTypes.number.isRequired
    },

    render() {
        const percentComplete = this.props.value + '%';
        return (
            <div className="progress" style={{marginTop: '20px'}}>
                <div className="progress-bar" role="progressbar" style={{width: percentComplete}}>
                    {percentComplete}
                </div>
            </div>);
    }
});

const ActionDeleteRowFormatter = React.createClass({
    propTypes: {
        value: React.PropTypes.number.isRequired
    },

    _delete: function() {
        const rowIdx = this.props.value;
        var r = confirm("Are you sure you want to delete this row? \n");
        if (r == true) {
            SheetDataTableActions.deleteRow(rowIdx);
        } else {
            console.log('cancel delete row', rowIdx);
        }
    },

    render() {
        return (
        <div>
            <button type="button" className="btn btn-default" onClick={() => this._delete()}>
                <span className="glyphicon glyphicon-trash"></span>
            </button>
        </div>
        );
    }
});

const ActionSaveRowFormatter = React.createClass({
    propTypes: {
        value: React.PropTypes.number.isRequired
    },

    _save: function() {
        SheetDataTableActions.updateRowOnServer(this.props.value);
    },

    render() {
        return (
        <div>            
            { this.props.value >= 0 &&                 
                <button type="button" className="btn btn-default" onClick={() => this._save()}>
                    <span className="glyphicon glyphicon-floppy-disk"></span>
                </button>
            }
        </div>
        );
    }
});

export {PercentCompleteFormatter, ActionDeleteRowFormatter, ActionSaveRowFormatter}