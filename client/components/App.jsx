import React from 'react';
import CreateReactClass from "create-react-class";

import axios from 'axios';

import Form from './Form.jsx';

import './App.less';

const App = CreateReactClass({
  getInitialState: function() {
    return {
      originalURL: '',
      shortURL: '',
      hash: '',
      errors: ''
    };
  },
  render() {
    return (
      <div className='app'>
        <h2 className='app__header'>URL Shortener</h2>
        <Form errors={ this.state.errors } handleSendOriginalURL={ this.sendOriginalURL } handleChangeOriginalURL={ this.changeOriginalURL } handleHash={ this.sendHash } handleChangeHash={ this.changeHash } originalURL={ this.state.originalURL } shortURL={ this.state.shortURL } hash={ this.state.hash } />
      </div>
    );
  },
  changeOriginalURL(event) {
    this.setState({originalURL: event.target.value});
  },
  sendOriginalURL() {
    axios.post(
      'http://localhost:8080/', 
      { 
        "type": "getLinkFromOriginal",
        "originalURL": this.state.originalURL 
      }
    ).then(response => {
      this.setState({ shortURL: response.data.shortURL, hash: response.data.hash, errors: ''});
    }, err => {
      this.setState({ shortURL: '', errors: err.response.data, hash: '' });
    });
  },
  changeHash(event) {
    this.setState({hash: event.target.value});
  },
  sendHash() {
    axios.post(
      'http://localhost:8080/', 
      { 
        "type": "getLinkFromHash",
        "hash": this.state.hash,
        "originalUrl": this.state.originalURL
      }
    ).then(response => {
      this.setState({ shortURL: response.data.shortURL, errors: ''});
    }, err => {
      this.setState({ shortURL: '', errors: err.response.data });
    });
  },
  changeShortURL(event) {
    this.setState({shortlURL: event.target.value});
  }
});

export default App;