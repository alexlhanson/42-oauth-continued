import React from 'react';
import {connect} from 'react-redux';
import {MemoryRouter, Switch, Router} from 'react-router-dom';


export default class App extends React.Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (
      <div>
        <p>Hello World</p>
      </div>
    );
  };
};
