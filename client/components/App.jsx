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
      errors: '',
      notifications: ''
    };
  },
  render() {
    return (
      <div className='app row'>
        <div className="col-md-12">
          <h2>URL Shortener</h2>
          <Form errors={ this.state.errors } notifications={ this.state.notifications } handleSendOriginalURL={ this.sendOriginalURL } handleChangeOriginalURL={ this.changeOriginalURL } handleHash={ this.sendHash } handleChangeHash={ this.changeHash } originalURL={ this.state.originalURL } shortURL={ this.state.shortURL } hash={ this.state.hash } />
        </div>
      </div>
    );
  },
  changeOriginalURL(event) {
    this.setState({originalURL: event.target.value});
  },
  sendOriginalURL() {
    this.setState({ shortURL: '', errors: '', notifications: '' });
    axios.post(
      'http://localhost:8080/', 
      { 
        "type": "getLinkFromOriginal",
        "originalURL": this.state.originalURL 
      }
    ).then(response => {
      this.setState({ shortURL: response.data.shortURL, hash: response.data.hash, errors: '', notifications: response.data.notifications });
    }, err => {
        this.setState({ shortURL: '', errors: (err.response)? err.response.data : 'Error: Network Error', hash: '', notifications: '' });
    });
  },
  changeHash(event) {
    this.setState({ hash: event.target.value });
  },
  sendHash() {
    this.setState({ shortURL: '', errors: '', notifications: '' });
    axios.post(
      'http://localhost:8080/', 
      { 
        "type": "getLinkFromHash",
        "hash": this.state.hash,
        "originalUrl": this.state.originalURL
      }
    ).then(response => {
      this.setState({ shortURL: response.data.shortURL, errors: '', notifications: response.data.notifications });
    }, err => {
        this.setState({ shortURL: '', errors: (err.response)? err.response.data : 'Error: Network Error', notifications: '' });
    });
  },
  changeShortURL(event) {
    this.setState({ shortlURL: event.target.value });
  }
});

export default App;