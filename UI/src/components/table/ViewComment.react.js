var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var SheetDataTableActions = require('../../actions/SheetDataTableActions');
var SheetDataTableStore = require('../../stores/SheetDataTableStore');

const ViewComment = React.createClass({
    getInitialState() {
        return {show: false};
    },

    _showModal(rowId, text) {
        this.setState({
            show: true,
            rowId : rowId,
            text : text
        });
    },

    _hideModal() {
        this.setState({show: false});
    },

    _save : function() {
        let currentText = this.state.text;
        let currentRowId = this.state.rowId;
        
        SheetDataTableActions.updateComment(currentRowId, currentText);
        this._hideModal();
    },

    _onChange : function(e) {
        this.setState({ text: e.target.value });
    },

    componentDidMount: function () {
        SheetDataTableStore.addViewCommentListener(this._showModal);
    },

    componentWillUnmount: function () {
        SheetDataTableStore.removeViewCommentListener(this._showModal);
    },

    render() {
        return (
            <Modal
                {...this.props}
                show={this.state.show}
                onHide={this._hideModal}
                dialogClassName="custom-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Comment Popup</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Edit your comment below</h4>
                    <textarea className="form-control" rows="5" defaultValue={this.state.text} onChange={this._onChange}>{}</textarea>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this._hideModal}>Close</button>
                    <button onClick={this._save}>Save</button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = ViewComment;