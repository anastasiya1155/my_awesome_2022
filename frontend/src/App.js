import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Days from './components/Days';
import DaysApp from './components/DaysApp/DaysApp';
import './App.css';
import Transactions from './components/Transactions';
import Tasks from './components/Tasks';
import Sandbox from './components/Sandbox';

import withTheme from './withRoot';
import Projects from "./components/Projects";


class App extends Component {
  render() {
    return (
      <div className="App">

        <div className="row">
          <div className="column">
            <div className="menu" style={{ marginTop: '70px' }}>
              <div>
              <Link to="/days">
                <b>Days</b>
              </Link>
              </div>
              <div>
                <Link to="/days/app">
                <b>Days App</b>
              </Link>
              </div>
              <div>
                <Link to="/transactions/list">
                  <b>Transactions</b>
                </Link>
              </div>
              <div>
                <Link to="/pins">
                  <b>Pins</b>
                </Link>
              </div>
              <div>
                <Link to="/tasks">
                  <b>Tasks</b>
                </Link>
              </div>
              <div>
                <Link to="/projects">
                  <b>Projects</b>
                </Link>
              </div>
            </div>
          </div>

          <div className="column" style={{ float: 'left', width: '65%' }}>
            <Switch>
              <Route path="/days" component={Days} exact />
              <Route path="/days/app" component={DaysApp} exact />
              <Route path="/transactions" component={Transactions} />
              <Route path="/pins" render={() => <h1>pins</h1>} exact />
              <Route path="/tasks" component={Tasks} />
              <Route path="/projects" component={Projects}/>
              <Route path="/sandbox" component={Sandbox} exact />
              <Route path="/" render={() => <h1>Нiчого</h1>} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default withTheme(App);
