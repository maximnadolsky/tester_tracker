import React, {Component} from 'react';
import { browserHistory, hashHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import { debounce } from 'lodash';
var SheetListActions = require('../actions/SheetListActions');
var SheetListStore = require('../stores/SheetListStore');


const DragHandle = SortableHandle(() => <div className="sheet-list-dragpoint">
  <span className="glyphicon glyphicon-menu-hamburger"></span>
</div>);

var SortableItemComponent = React.createClass({

	getInitialState() {
		return {
			id: null,
			isEdit: false,
			name: '',
			draftName: '',
			status: ''
		}
	},

	componentWillMount() {
		this.setState({ 
			id: this.props.item.id, 
			name: this.props.item.name, 
			status: this.props.item.status,
			index: this.props.index
		});
	},

	componentWillReceiveProps(nextProps) {
		this.setState({ 
			id: nextProps.item.id, 
			name: nextProps.item.name, 
			status: nextProps.item.status,
			index: this.props.index
		});
	},

	toogleEditMode() {
		this.setState({isEdit : !this.state.isEdit});
	},

	_handleClick(e) {
		if (!this._delayedClick) {
			this._delayedClick = _.debounce(this.doClick, 500);
		}
		if (this.clickedOnce) {
			this._delayedClick.cancel();
			this.clickedOnce = false;
			this.doDoubleClick();
		} else {
			this._delayedClick(e);
			this.clickedOnce = true;
		}
	},

	onKeyDown (event) {
		if (event.keyCode === ENTER_KEY_CODE && this.state.name) {
			SheetListActions.update(this.state.id, this.state.name, this.state.status);
			this.setState({isEdit : false});
		}
    },

	doClick(e) {
		this.clickedOnce = undefined;
	},

	doDoubleClick() {
		this.toogleEditMode();
	},
		
	handleChange(event) {
		this.setState({name: event.target.value});
	},

	_selectSheet: function(id) {
		SheetListActions.setSelected(id);
	},

	render() {
		let {item, onRemove} = this.props;
		let sheetName = null;

		if (this.state.isEdit) {
			sheetName = <input type="text" className="form-control" value={this.state.name} placeholder="" onChange={this.handleChange} onKeyDown={this.onKeyDown}/>;
		} else {
			sheetName = <h4 className="list-group-item-heading">{this.state.name}</h4>;
		}

		return (
			<Link to={`/sheet/${item.id}`} activeClassName="active" className="list-group-item" onClick={() => this._selectSheet(this.state.id)}>    
				<DragHandle />
				
				<div className="sheet-list-content" onClick={this._handleClick}>
					{sheetName}				
					<div className="list-group-item-text">status {this.state.status}  
						<button type="button" className="btn btn-default btn-xs sheet-delete" onClick={() => onRemove(this.state.id)}>
							<span className="glyphicon glyphicon-remove"></span>  
						</button>
					</div>
				</div>         
			</Link>
		);
	}
})

const SortableItem = SortableElement(SortableItemComponent, {withRef: true});

const ENTER_KEY_CODE = 13;

class NewSheetItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ''
		};

		this.handleChange = this.handleChange.bind(this);
	}
	addSheet = () => this.props.onAdd(this.state.name);    
	
	onKeyDown = (event) => {
      if (event.keyCode === ENTER_KEY_CODE && this.state.name) {
        this.addSheet();
		this.setState({name: ''});
      }
    };
	handleChange(event) {
		this.setState({name: event.target.value});
	}
	render() {
		return(
			<div className="draft-sheet-item list-group-item">
				<input type="text" value={this.state.name} className="form-control" placeholder="" onKeyDown={this.onKeyDown} onChange={this.handleChange} />     
			</div>
		)
	}
}


// TODO: fix bug; move item and mouse click on item

// var SortableListComponent = React.createClass({
// 	getInitialState() {
// 		return {}
// 	},
	
// 	componentWillMount() {
// 		this.setState({
// 			items: this.props.items,
// 			onSortEnd: this.props.onSortEnd,
// 			useDragHandle: this.props.useDragHandle,
// 			isNewItemMode: this.props.isNewItemMode,
// 			onAdd: this.props.onAdd,
// 			onRemove: this.props.onRemove,
// 		});
// 	},

// 	componentWillReceiveProps(nextProps) {
// 		this.setState({ 
// 			items: nextProps.items
// 		});
// 	},

// 	render() {

// 		return (
// 			<div className="list-group">
				
// 				{this.state.isNewItemMode && <NewSheetItem onAdd={this.state.onAdd} />}
// 				{this.state.items.map((value, index) =>
// 					<SortableItem key={`item-${index}`} index={index} item={value} onRemove={(state) => this.state.onRemove(state)} />
// 				)}
// 			</div>
// 		);
// 	}
// })

// const SortableList = SortableContainer(SortableListComponent, {withRef: true});


const SortableList = SortableContainer(({items, onAdd, onRemove, isNewItemMode}) => {
	return (
        <div className="list-group">
			
			{isNewItemMode && <NewSheetItem onAdd={onAdd} />}
            {items.map((value, index) =>
				<SortableItem key={`item-${index}`} index={index} item={value} onRemove={(state) => onRemove(state)} />
            )}
        </div>
    );
});

class SortableComponent extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			items: this.props.list
		};
	};

	componentWillReceiveProps(nextProps) {
		this.setState({ 
			items: nextProps.list
		});
	}

	//TODO: recalculate position item in array and save
	onSortEnd = ({oldIndex, newIndex}) => {
		
		var items = arrayMove(this.state.items, oldIndex, newIndex);
		SheetListActions.updateSort(items);

		//this.setState({items: items});
	};

	render() {
		return (
			<SortableList items={this.state.items} 
			onSortEnd={this.onSortEnd} 
			useDragHandle={true} 
			isNewItemMode={this.props.isNewItemMode}
			onAdd={this.props.onAdd}
			onRemove={(state) => this.props.onRemove(state)} />
		)
	}
}

var FluxList = withRouter(React.createClass({

	componentWillMount() {
		this.setState({
			isNewItemMode: false,
			allSheets: SheetListStore.getAll()
		});
	},

	componentDidMount: function() {
		SheetListStore.addChangeListener(this._onChange);
		SheetListStore.init();
	},

	componentWillUnmount: function() {
		SheetListStore.removeChangeListener(this._onChange);
	},

	_toogleAddNewItemMode: function() {
		this.setState(prevState => ({	
			isNewItemMode: !prevState.isNewItemMode
		}));
	},
	
	_onChange: function() {
		var self = this;

		this.setState({
			allSheets: SheetListStore.getAll()
		});

		setTimeout(function() {
			const { id } = self.props.params;
			if (id) {
				SheetListActions.setSelected(+id);
			}
		});
	},

	_addSheet: function(name) {
		SheetListActions.add(name);
	},

	_removeSheet: function(id) {
		var r = confirm("Are you sure you want to delete this item? \n");
		if (r == true) {
			SheetListActions.delete(id);
		} else {
			console.log('cancel delete item', id);
		}
	},

	render: function() {
		var self = this;
		var result = _.groupBy(this.state.allSheets, "status");

		return (
				<div>
					<button type="button" className="btn btn-default" onClick={this._toogleAddNewItemMode}>Show/Hide Add New Task</button>
					<div className="sheet-list">
						{result.active && <SortableComponent list={result.active} 
						onAdd={this._addSheet}
						onRemove={this._removeSheet} 
						isNewItemMode={this.state.isNewItemMode} />}
						
						<h3>Completed:</h3>
						
						{result.completed && <SortableComponent list={result.completed} onRemove={this._removeSheet} />  || <span>No data</span>}
					</div>
				</div>
			);
	},

}));

module.exports = FluxList;


// BUGS

// 1. Если отрыть на редактирование элемент, набрать текс, и кликнуть на другой элемент, то набранный текст удалится.
