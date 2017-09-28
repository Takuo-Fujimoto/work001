import React, {Component} from 'react';
import dataJson from './data/data_ja.json'

var Apply = React.createClass({

    render: function() {
        var master;
        dataJson.masters.forEach(function(item) {
            if (this.props.params.masterId === item.id) {
                master = item;
            }
        }, this);
        return (
            <div>Apply {master.name}</div>
        );
    }
});

export default Apply;
