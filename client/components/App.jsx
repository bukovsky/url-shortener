import React from 'react';
import CreateReactClass from "create-react-class";

import axios from 'axios';
import getValidUrl from './../validators/getValidUrl.js';

import Form from './Form.jsx';

import './App.less';

const App = CreateReactClass({
  getInitialState: function() {
    return {
      originalURL: '',
      shortURL: '',
      hash: '',
      errors: '',
      notifications: '',
      disabled: false
    };
  },
  render() {
    return (
      <div className='app row'>
        <div className="col-md-12">
          <h2>URL Shortener</h2>
          <Form disabled={ this.state.disabled } errors={ this.state.errors } notifications={ this.state.notifications } handleSendOriginalURL={ this.sendOriginalURL } handleChangeOriginalURL={ this.changeOriginalURL } handleHash={ this.sendCustomHash } handleChangeHash={ this.changeHash } originalURL={ this.state.originalURL } shortURL={ this.state.shortURL } hash={ this.state.hash } />
        </div>
      </div>
    );
  },
  changeOriginalURL(event) {
    this.setState({originalURL: event.target.value, errors: ''});
  },
  sendOriginalURL() {
    this.setState({ shortURL: '', errors: '', notifications: '' });
    let validUrl = getValidUrl(this.state.originalURL);
    if (!validUrl)
      return this.setState({ errors: 'Original URL field is invalid.' });
    this.setState({
      notifications: 'Your request is being processed.',
      disabled: true
    });
    axios.post(
      'http://localhost:8080/', 
      { 
        "type": "getLinkFromOriginal",
        "originalURL": this.state.originalURL 
      }
    ).then(response => {
      this.setState({ 
        shortURL: response.data.shortURL, 
        hash: response.data.hash, 
        errors: (response.data.errors)? response.data.errors : '', 
        notifications: response.data.notifications 
      });
    }, err => {
        this.setState({ 
          shortURL: '', 
          errors: (err.response)? err.response.data : 'Error: Network Error.', 
          hash: '', 
          notifications: '' 
        });
    }).finally(() => this.setState({ disabled: false }));
  },
  changeHash(event) {
    this.setState({ hash: event.target.value, errors: '' });
  },
  sendCustomHash() {
    this.setState({ 
      shortURL: '',
      errors: '',
      notifications: ''
    });
    let validUrl = getValidUrl(this.state.originalURL),
        errors = '';
    errors = (!validUrl)? 'Original URL is invalid. ' : '';
    errors += (!this.state.hash)? 'Short link code field is empty.' : '';
    
    if (errors)
      return this.setState({ errors: errors });
    this.setState({
      notifications: 'Your request is being processed.',
      disabled: true
    });
    axios.post(
      'http://localhost:8080/', 
      { 
        "type": "getLinkFromHash",
        "hash": this.state.hash,
        "originalUrl": this.state.originalURL
      }
    ).then(response => {
      this.setState({ 
        shortURL: response.data.shortURL, 
        errors: (response.data.errors)? response.data.errors : '', 
        notifications: response.data.notifications 
      });
    }, err => {
        this.setState({ 
          shortURL: '', 
          errors: (err.response)? err.response.data : 'Error: Network Error.', 
          notifications: '' 
        });
    }).finally(() => this.setState({ disabled: false }));
  },
  changeShortURL(event) {
    this.setState({ shortlURL: event.target.value });
  }
});

export default App;