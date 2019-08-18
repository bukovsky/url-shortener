import React from 'react';
import CreateReactClass from "create-react-class";
import Warnings from './Warnings.jsx';

const Form = CreateReactClass({
  render() {
    return (
      <form action="/">
        <div className="form-group">
          <label htmlFor="originalURL">Original URL</label>
          <div className="input-group">
              <input id="originalURL" className="form-control" name="originalUrl" type="text" onChange={ this.props.handleChangeOriginalURL } value={ this.props.originalURL }/>
            <div className="input-group-append">
              <button className="btn btn-primary" type="button" onClick={ this.props.handleSendOriginalURL }>Get link</button>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="shortCode">Short link code</label>
          <div className='input-group'>
            <input id="shortCode" className="form-control" name="shortUrl" type="text" onChange={ this.props.handleChangeHash } value={ this.props.hash }/>
            <div className="input-group-append">
              <button className="btn btn-primary" type="button" onClick={ this.props.handleHash }>Attach short code</button>
            </div>
          </div>
        </div>
        {this.props.notifications != '' &&
          <div className="form-group text-info">{ this.props.notifications }</div>
        }
        {this.props.shortURL != '' &&
          <div className="form-group">
            <h3>Processed short URL:</h3>
            <div>{ this.props.shortURL }</div>
          </div>
        }
        {this.props.errors && this.props.errors.length > 0 &&
          <Warnings errors={ this.props.errors }/>
        }
      </form>
    );
  }
});

export default Form;