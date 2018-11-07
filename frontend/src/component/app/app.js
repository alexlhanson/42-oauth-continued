import React from 'react';
import { connect } from 'react-redux';
import { MemoryRouter, Switch, Route, BrowserRouter } from 'react-router-dom';

import * as utils from '../../lib/util';
import * as auth from '../../actions/auth';
import * as route from '../../actions/route'

import Header from '../header/header';
import LandingContainer from '../../component/landing/landing';
import SignupContainer from '../../component/signup/signup';


export class App extends React.Component {

  componentDidMount() {
    let token = utils.cookieFetch('chatToken');
    if (token) this.props.login;
  }

  render() {
    return (
      <section className="app">
          <BrowserRouter>
            <div>
              <Header actions={this.props.actions} />
              <MemoryRouter>
                <Switch location={{ pathname: this.props.route }}>
                  <Route path='landing' component={LandingContainer} />
                  <Route path='signup' component={SignupContainer} />
                  <Route path='chat' component={() => <p>chat</p>} />
                  <Route path='login' component={() => <p>login</p>} />
                  <Route path='settings' component={() => <p>settings</p>} />
                </Switch>
              </MemoryRouter>
            </div>
          </BrowserRouter>
      </section>
    );
  };
};

const mapStateToProps = state => {
  return {
    token: state.token,
    route: state.route,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    login: token => dispatch(auth.login(token)),
    logout: () => dispatch(auth.logout()),
    goToChat: () => dispatch(route.switchRoute('/chat')),
    goToSettings: () => dispatch(route.switchRoute('/settings')),
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App)