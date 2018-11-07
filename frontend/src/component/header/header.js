import React from 'react';
import * as utils from '../../lib/util';

export default class extends React.Component {
  constructor(props) {
    super(props)

  }
  render() {
    let {goToChat, goToSettings, logout, token } = this.props.actions;
    return (
      <header>
        <div className='toolbar'>
          <button onClick={this.toggleMenu} className="logo">Chat</button>
          <button onClick={this.toggleChat} className="toggle-chat">Show/Hide Chat</button>
          {utils.renderIf(token,
            <div className='menu'>
              <button onClick={goToChat}>Chat</button>
              <button onClick={goToSettings}>Settings</button>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </header>
    );
  };
};