import React from 'react';
import CreateReactClass from 'create-react-class';

const Warnings = CreateReactClass({
  render() {    
    return(
      <div className="form-group">
        <h3>Warning:</h3>
        <div className="text-danger">{this.props.errors}</div>
      </div>
    );
  }
});

export default Warnings;