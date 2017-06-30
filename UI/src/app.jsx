import styles from './index.scss';
import React from 'react';
import { browserHistory, hashHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router';

import FluxList from './components/FluxList.react'
import Table from './components/table/SheetDataTable.react'

const Main = React.createClass({render() {
    return (
      <div className="row">
        <div className="col-lg-3 col-md-3 col-sm-4 col-xs-5">
          <FluxList/>
        </div>
        <div className="col-lg-9 col-md-9 col-sm-8 col-xs-7">
          <div className="content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
}})

const NotFound = React.createClass({render() {
    return <h1>NoMatch</h1>
}})

const Index = React.createClass({render() {
    return (<div>
      <h1>Orange Tracker</h1>
      <Link to="/sheet/new">New Sheet</Link>
      <Link to="/sheet/123">Go to last sheet</Link>
    </div>)
}})

export default class App extends React.Component {

  render() {

    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={Main}>
            <IndexRoute component={Index} />
            <Route path="sheet/new" component={NotFound} />
            <Route path="sheet/:id" component={Table} />
            <Route path="*" component={NotFound} />
          </Route>
        </Router>
      </div>
    )
  }
}
