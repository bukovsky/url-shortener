import React from 'react';
import CreateReactClass from "create-react-class";

import axios from 'axios';

import Form from './Form.jsx';

import './App.less';

const App = CreateReactClass({
  getInitialState: function() {
    return {
      originalLink: '',
      shortLink: '',
      hash: '',
      errors: ''
    };
  },
  render() {
    return (
      <div className='app'>
        <h2 className='app__header'>URL Shortener</h2>
        <Form errors={ this.state.errors } handleSendOriginalURL={ this.sendOriginalURL } handleChangeOriginalURL={ this.changeOriginalURL } handleHash={ this.sendHash } handleChangeHash={ this.changeHash } originalLink={ this.state.originalLink } shortLink={ this.state.shortLink } hash={ this.state.hash } />
      </div>
    );
  },
  changeOriginalURL(event) {
    this.setState({originalLink: event.target.value});
  },
  sendOriginalURL() {
    // Меняем состояние приложения
    axios.post(
      'http://localhost:8080/', 
      { 
        "originalLink": this.state.originalLink 
      }
    ).then(response => {
      this.setState({ shortLink: response.data.shortLink, hash: response.data.hash, errors: ''});
    }, err => {
      this.setState({ shortLink: '', errors: err.response.data, hash: '' });
    });
  },
  changeHash(event) {
    this.setState({handleChangeHash: event.target.value});
  },
  sendHash() {
    // Меняем состояние приложения
//    axios.post(
//      'http://localhost:8080/', 
//      { 
//        "originalLink": this.state.originalLink 
//      }
//    ).then(response => {
//      this.setState({ shortLink: response.data.shortLink, hash: response.data.hash, errors: ''});
//    }, err => {
//      this.setState({ shortLink: '', errors: err.response.data });
//    });
  },
  changeShortURL(event) {
    this.setState({shortlLink: event.target.value});
  }
});

export default App;