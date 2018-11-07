import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import superagent from 'superagent';
import * as utils from '../../lib/util';
import * as auth from '../../actions/auth';
import validator from 'validator';

const Tooltip = props => {
  return (
    <div className='tooltip'>
      <span className='tooltipnext'>{props.message}</span>
    </div>
  )
}

export class SignupContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      username: '',
      password: '',
      emailError: null,
      usernameError: null,
      passwordError: null,
      usernameAvailable: false,

    }

    this.usernameCheckAvailable = _.debounce(this.usernameCheckAvailable.bind(this), 250);
    this.validateChange = this.validateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  usernameCheckAvailable() {
    return superagent.get(`{__API_URL__}/usernames/${this.state.username}`)
      .then(() => this.setState({ usernameAvailable: true }))
      .catch(() => this.setState({ usernameAvailable: false }));
  };

  validateChange() {
    let { name, value } = e.target;
    let error = null;
    if (name === 'username') {
      if (!value) {
        error = `username field cannot be empty`
      } else if (!validator.isAlphanumeric(value)) {
        error = `username can only contain numbers and letters`
      }
    } else if (name === 'email') {
      if (!value) {
        error = `email field cannot be empty`
      }
      if (!validator.isEmail(value)) {
        error = `email is not a valid email`
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'password field cannot be empty'
      } else if (!validator.isAlphanumeric(value)) {
        error = 'password can only contain numbers and letters'
      }
    }

    this.setState({ [`${name}Error`]: error })
  }

  handleChange(e) {
    e.preventDefault();
    this.validateChange(e);
    let { name, value } = e.target;

    this.setState({ [name]: value });

    if (name === 'username') {
      this.usernameCheckAvailable();
    }

  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.usernameError && !this.state.passwordError && !this.state.emailError) {
      return this.props.signup({
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
      })
    }
  }

  render() {
    return (
      <div className='signup-container'>
        <form onSubmit={this.handleSubmit}>
          <Tooltip message={this.state.emailError} />
          <input name='email' type='email' placeholder='email' value={this.state.email} onChange={this.handleChange} />
          <Tooltip message={this.state.usernameError} />
          <input name='username' type='username' placeholder='username' value={this.state.username} onChange={this.handleChange} />
          <div className="username-feedback">
            {utils.renderIf(this.state.username, 
              <span>
                {this.state.username} is 
                {this.state.usernameAvailable ? ' available': ' taken'}
              </span>
            )}
          </div>
          <Tooltip message={this.state.passwordError} />
          <input name='password' type='password' placeholder='password' value={this.state.password} onChange={this.handleChange} />
        </form>
      </div>
    );
  };
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  signup: user => dispatch(auth.signupRequest(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer);
