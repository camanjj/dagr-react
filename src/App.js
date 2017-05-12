import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tabbar from './Tabbar.js'
import 'bootstrap'
import 'react-select/dist/react-select.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>DAGR Plugin</h2>
        </div>
          <Tabbar />
      </div>
    );
  }
}

export default App;
