import React, { Suspense, lazy } from 'react';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
const Days = lazy(() => import(/* webpackChunkName: "days" */ './Days'));
const Transactions = lazy(() => import(/* webpackChunkName: "transactions" */ './Transactions'));
const Tasks = lazy(() => import(/* webpackChunkName: "tasks" */ './Tasks'));
const Sandbox = lazy(() => import(/* webpackChunkName: "sandbox" */ './Sandbox'));
const Projects = lazy(() => import(/* webpackChunkName: "projects" */ './Projects'));
const Project = lazy(() => import(/* webpackChunkName: "project-show" */ './ProjectShow'));
const Wishlist = lazy(() => import(/* webpackChunkName: "wishlist" */ './Wishlist'));
const LastTime = lazy(() => import(/* webpackChunkName: "last-time" */ './LastTime'));
const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ './Auth/Login'));
const Layout = lazy(() => import(/* webpackChunkName: "layout" */ './Layout'));
const RegistrationPage = lazy(() =>
  import(/* webpackChunkName: "registration" */ './Auth/Registration'),
);

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegistrationPage} />
          <Layout>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path="/days" component={Days} />
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
            </Suspense>
          </Layout>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
