import React, {Component} from 'react';
import dataJson from './data/data_ja.json'
import screenSettingData from './data/mockScreenSettings.json'
import Tab4Handsontable from './cmp/Tab4Handsontable'

var Update = React.createClass({

    render: function() {
        var master;
        dataJson.masters.forEach(function(item) {
            if (this.props.params.masterId === item.id) {
                master = item;
            }
        }, this);
        return (
            <div>
                <Tab4Handsontable screenSettingData={screenSettingData}></Tab4Handsontable>
            </div>
        );
    }
});
export default Update;
