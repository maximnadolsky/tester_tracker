var React = require('react');
var SheetListStore = require('../../stores/SheetListStore');
var SheetDataTableStore = require('../../stores/SheetDataTableStore');

const Header = React.createClass({
    getState: function() {
        let sheetList = SheetListStore.getSelected();
        let headerText = sheetList ? sheetList.name : '';

        return {
            headerText: headerText,
            errorText: ''
        }
    },

    getInitialState() {
        return this.getState();
    },

    _clearError: function() {
        if (!this.isMounted()) return;
        this.setState({ errorText: '' });
    },

    _selectedChange: function() {   
        if (!this.isMounted()) return;        
        this.setState(this.getState());
    },

    _hasErrorOccurred: function(errorText) {
        if (!this.isMounted()) return;

        var self = this;
        this._clearError();
        
        setTimeout(function() {        
            self.setState({ errorText: errorText });
        }, 200);
    },

    componentDidMount: function() {
        SheetListStore.addSelectedChangeListener(this._selectedChange);
        SheetDataTableStore.addErrorOccurredListener(this._hasErrorOccurred);
        SheetDataTableStore.addRowsChangeListener(this._clearError);
    },

    componentWillUnmount: function() {
        SheetListStore.removeSelectedChangeListener(this._selectedChange);
        SheetDataTableStore.removeErrorOccurredListener(this._hasErrorOccurred);
        SheetDataTableStore.removeRowsChangeListener(this._clearError);
    },

    render() {
        return (
            <div className="page-header_" style={{ marginTop: '20px'}}>
                <div className="alert alert-danger" role="alert" style={this.state.errorText ? {} : { visibility: 'hidden' }}>
                    <strong>An error has occurred!</strong> {this.state.errorText}
                    <a className="close" aria-label="close" title="close" onClick={this._clearError}>×</a>
                </div>

                <h3>{this.state.headerText}</h3>
            </div>
        );
    }
});

module.exports = Header;