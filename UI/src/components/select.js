import React from 'react';
import styles from '../index.scss';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

var DropdownList = [{value:1, label: '0%'}, {value:2, label: 'bug'}];


export default class App extends React.Component {
    constructor(props) {
    super(props)
    this.saveChanges = this.saveChanges.bind(this)
    this.state = {
      active: 'select'
    }
  }

  saveChanges(data) {
    this.setState({
      active: data.value
    })

  }

  render() {
    return (
      <div>
          <Select
            className={styles.Select}
            name="form-field-name"
            value={this.state.active}
            options={DropdownList}
            onChange={this.saveChanges}
          />
      </div>
    )
  }
}
//https://github.com/JedWatson/react-select/issues/1188
