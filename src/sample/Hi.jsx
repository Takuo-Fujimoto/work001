'use strict';

var React = require('react');
var mui = require('material-ui');

var RaisedButton = mui.RaisedButton;

var Hi = React.createClass({
  doClick: function() {
    alert('Hi !');
  },
  render: function() {
    return (
      <RaisedButton label="Hi" primary={true} onClick={this.doClick} />
    );
  }
});

module.exports = Hi;
