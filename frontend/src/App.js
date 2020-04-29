import React from 'react';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
import Days from './Days';
import DaysApp from './DaysApp';
import Transactions from './Transactions';
import Tasks from './Tasks';
import Sandbox from './Sandbox';
import Projects from './Projects';
import Project from './ProjectShow';
import Wishlist from './Wishlist';
import LastTime from './LastTime';
import LoginPage from './Auth/Login';
import Layout from './Layout';
import RegistrationPage from './Auth/Registration';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegistrationPage} />
        <Layout>
          <Switch>
            <Route path="/days" component={Days} exact />
            <Route path="/days/app" component={DaysApp} exact />
            <Route path="/transactions" component={Transactions} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/projects/:id" component={Project} />
            <Route path="/projects" component={Projects} />
            <Route path="/last-time" component={LastTime} exact />
            <Route path="/sandbox" component={Sandbox} exact />
            <Route path="/wishlist" component={Wishlist} />
            <Route path="/" exact>
              <Redirect to="/days" />
            </Route>
          </Switch>
        </Layout>
      </Switch>
    </Router>
  );
}

export default App;
