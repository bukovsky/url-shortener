import React from 'react';
import CreateReactClass from "create-react-class";

const Form = CreateReactClass({
  render() {
    return (
      <form action="/">
        <div>
          <label>Original URL
            <input name="originalUrl" type="text" onChange={ this.props.handleChangeOriginalURL } value={ this.props.originalLink }/>
          </label>
          <button type="button" onClick={ this.props.handleSendOriginalURL }>Send</button>
        </div>
        <div>
          <label>Short URL
            <input name="shortUrl" type="text" onChange={ this.props.handleChangeHash } value={ this.props.hash }/>
          </label>
          <button type="button" onClick={ this.props.handleHash }>Send</button>
        </div>
        <div>
          <h3>Processed short URL:</h3>
          <div>{ this.props.shortLink }</div>
        </div>
        <div>
          <h3>Errors:</h3>
          <div>{ this.props.errors }</div>
        </div>
      </form>
    );
  }
});

export default Form;