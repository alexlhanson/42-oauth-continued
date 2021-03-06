import React from 'react';
import { connect } from 'react-redux';
import * as route from '../../actions/route';
import queryString from 'querystring';

export class LandingContainer extends React.Component {

  componentDidMount(){
    console.log('in landing');
  }
  render() {

    let googleLoginBaseURL = 'https://accounts.google.com/o/oauth2/v2/auth';

    let googleLoginQuery = queryString.stringify({
      client_id: __GOOGLE_CLIENT_ID__,
      response_type: 'code',
      redirect_uri: `${__API_URL__}/oauth`,
      scope: `openid profile email`,
      prompt: __DEBUG__ ? 'consent' : null
    })

    let googleLoginURL = `${googleLoginBaseURL}?${googleLoginQuery}`;

    return(
      <div className='landing-container'>
        <button onClick={this.props.goToLogin}>Login</button>
        <button onClick={this.props.goToSignup}>Signup</button>
        <a href={googleLoginURL}>Login with Google!</a>
      </div>
    );
  };
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  goToLogin: () => dispatch(route.switchRoute('/login')),
  goToSignup: () => dispatch(route.switchRoute('/signup')),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
