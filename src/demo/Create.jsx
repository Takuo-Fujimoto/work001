import React, {Component} from 'react';
console.info('Create ')
import ReactDOM from 'react-dom';
import dataJson from './data/data_ja.json'

import Handsontable from 'handsontable/dist/handsontable.full.min.js';
import HotTable from 'react-handsontable/dist/react-handsontable.min.js';
// ... and HotTable

// ... and HotTable
// import HotTable from 'react-handsontable/dist/react-handsontable';

class ExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handsontableData = [
      ["", "Ford", "Volvo", "Toyota", "Honda"],
      ["2016", 10, 11, 12, 13],
      ["2017", 20, 11, 14, 13],
      ["2018", 30, 15, 12, 13]
    ];
  }

  render() {
    return (
      <div id="example-component">
        <HotTable root="hot" data={this.handsontableData} colHeaders={true} rowHeaders={true}/>
      </div>
    );
  }
}

var Create = React.createClass({

    render: function() {
        var master;
        dataJson.masters.forEach(function(item) {
            if (this.props.params.masterId === item.id) {
                master = item;
            }
        }, this);
        return (
            <div>
                <div>Create {master.name}</div>
            </div>
        );
    }
});
export default Create;
