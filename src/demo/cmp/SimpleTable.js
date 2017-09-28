import React, {Components} from 'react';
import TableComponentCSS from './../../lib/css/tableComponent.css';

let SimpleTable = React.createClass({

    getInitialState: function() {
        return {rowSelect: {}, flag: false};
    },
    onSelectRow: function(e) {
        // console.info('onSelectRow');
        let id = e.target.id
        this.props.tableData[id].isSelect = !this.props.tableData[id].isSelect;
        // console.info(id + ' / ' + this.props.tableData[id].isSelect);
        // for run render
        this.forceUpdate();
    },

    createCellData: function(data, rowKey) {
        return (Object.keys(data).map((key) => {
            if ('isSelect' !== key) {
                return <td id={rowKey}>{data[key]}</td>
            }
        }));
    },
    createRowData: function(key, data) {
        let rowStyle = {}
        if (this.props.tableData[key].isSelect) {
            rowStyle.backgroundColor = '#70eb84'
        } else {
            this.props.tableData[key].isSelect = false
            rowStyle.backgroundColor = undefined;
        }
        // console.info(key + ' / ' + rowStyle);
        return (
            <tr onClick={this.onSelectRow} id={key} style={rowStyle}>{this.createCellData(data, key)}</tr>
        );
    },
    select: function() {},
    render() {
        // console.info('render');
        let headerRow = [];
        // console.info(this.props.tableData);
        // let dataRows = this.props.tableData.map(function(data) {
        //     let outerIndex = index;
        //     let dataRow = [];
        //     dataRow.push((<tr>));
        //     let arr = Object.keys(data);
        //     console.info(arr);
        //     Object.keys(data).forEach(function(key) {
        //         // console.info(index);
        //         // dataRow = ({dataRow} <td>{data[key]}</td >);
        //     }, this);
        //     dataRow.push((</tr>));
        //     return dataRow;
        // }, this);

        let row=[];
        Object.keys(this.props.tableData).forEach(function(key) {
            row.push(this.createRowData(key, this.props.tableData[key]));
        }, this);
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            {Object.keys(this.props.tableData[0]).map((key) => {
                                if ('isSelect' !== key) {
                                    return <th>{key}</th>
                                }
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>
        );
    }
});
export default SimpleTable;
