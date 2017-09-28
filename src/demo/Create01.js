import React from 'react';
import Handsontable from 'handsontable/dist/handsontable0.full';
import HandsontableCSS from 'handsontable/dist/handsontable.full.css';
import HandsontableEditCSS from './cmp/hot.css';
import screenData from './data/mockScreenSettings.json'
import $ from 'jquery';
import grid from './../../images/grid.svg';
import documentIcon from './../../images/document.svg';

let columns = [];
let data = '';
var SpreadSheet = React.createClass({
    getInitialState: function() {
        console.log('constructor');
        var hot = {};
        const styles = {
            floatingHeaderIcon: {
                right: '25px',
                bottom: '25px',
                position: 'fixed',
                zIndex: '2',
                width: '50px',
                height: '50px'
            },
            floatingGridIcon: {
                right: '25px',
                bottom: '25px',
                position: 'fixed',
                zIndex: '2',
                width: '50px',
                height: '50px'
            }
        }
        return {screenSettingData: screenData, isHeader: true, styles: styles, flag: true, hot: hot}
    },
    getData: function() {
        var datafromtable = document.getElementById('foo');
        console.log('getData');
        data = this.state.hot.getData();
        console.log(data);
        this.setState({
            flag: !this.state.flag
        });
    },
    negativeValueRenderer: function(instance, td, row, col, prop, value, cellProperties) {
        console.log('arguments');
        //Handsontable.renderers.TextRenderer.apply(this, arguments);
        //return;
    },
    componentDidMount: function() {
        console.info('componentDidMount');
        this.createHandsOnTable('foo', 'T001');
    },
    createHandsOnTable: function(containerId, tabId) {
        var container = document.getElementById(containerId);

        // ハンズオンテーブルにセットする初期データ
        // 1列目に項目IDを隠し項目として持たせる
        var tableData = [];
        var itemInfoKeyArray = Object.keys(this.state.screenSettingData.tabInfo[tabId].itemInfo);

        var labelMaxLength = 0;

        for (var i = 0; i < itemInfoKeyArray.length; i = i + 1) {
            // ハンズオンテーブルの隠し列に項目IDを持たせる
            tableData.push([itemInfoKeyArray[i]]);
            var itemName = this.state.screenSettingData.tabInfo[tabId].itemInfo[itemInfoKeyArray[i]].itemName;
            labelMaxLength = labelMaxLength < itemName.length
                ? itemName.length
                : labelMaxLength;
        }
        // 行ヘッダーの幅をラベルの文字数 * 11px(1文字あたりの最大幅)にする
        var columnHeaderWidth = labelMaxLength * 11;
        // デフォルトカラムサイズ(明細数)はマスタ設定項目にするのが良いか？
        var columnWidth = 100;
        // 行ヘッダーを差し引いた残りの幅を1カラムあたりの幅で割って、初期表示カラム数を決める
        var defaultColumnSize = Math.floor((window.innerWidth - columnHeaderWidth) / columnWidth);
        // 1行非表示にしているから指定されたカラムサイズ分足す。
        // 合計列数はカラムサイズ＋１になり、1列目が非表示になるので、結果指定されたカラムサイズの表示になる。
        for (i = 0; i < defaultColumnSize; i = i + 1) {
            tableData[0].push('');
        }
        // ハンズオンテーブル生成
        this.setState({
            hot: new Handsontable(container, {
                // height: 500,
                // data: this.getView().getModel().oData.data[0],
                data: tableData,
                hiddenColumns: {
                    columns: [0]
                },
                // minSpareRows: 1,
                // autoColumnSize: true,
                autoColumnSize: {
                    syncLimit: 3000
                },
                minRows: this.state.screenSettingData.tabInfo[tabId].itemNameList.length,
                maxRows: this.state.screenSettingData.tabInfo[tabId].itemNameList.length,
                manualColumnResize: true,
                rowHeaders: this.state.screenSettingData.tabInfo[tabId].itemNameList,
                colHeaders: function(col) {
                    // カラムヘッダーを数値連番表示に変更。デフォルトはアルファベット
                    // 隠し列が1行あるので、0からの連番で作って1列目(0番)が非表示になり1からに見える
                    return (col);
                },
                colWidths: columnWidth,
                fixedColumnsLeft: 2, // temporary
                fixedRowsTop: 2, // temporary
                // 要i18nプロパティ化
                contextMenu: {
                    items: {
                        col_left: {
                            name: '左に列を挿入'
                        },
                        col_right: {
                            name: '右に列を挿入'
                        },
                        remove_col: {
                            name: '列を削除'
                        },
                        undo: {
                            name: '元に戻す'
                        },
                        redo: {
                            name: 'やり直し'
                        }
                    }
                }
            })
        });
        // JQueryでdomを操作するのは、React的にはNGらしいけれど、HandsOnTableはコンポーネントのrenderが終わった後に
        // Divタグをreplace(or append?)してるからそもそもReactの管理対象じゃないんじゃないか。
        // と、理由をつけてJQueryを使う。動かしてみて問題があったら削除(単なるWidth指定なので、削除しても動作に支障なし)
        $('.handsontable col.rowHeader').css('width', columnHeaderWidth + 'px');
    },
    flip: function(e) {
        console.info('FLIP');
        this.setState({
            isHeader: !this.state.isHeader
        });
    },
    render() {
        console.info('panelRender!')
        var headerClass = '';
        var gridClass = '';
        var headerIconStyle = this.state.styles.floatingHeaderIcon;
        var gridIconStyle = this.state.styles.floatingGridIcon;
        if (this.state.isHeader) {
            headerClass = 'animated flipInY';
            gridClass = 'animated flipOutY';
            headerIconStyle.opacity = '0';
            gridIconStyle.opacity = '1';
            headerIconStyle.zIndex = '0';
            gridIconStyle.zIndex = '2';
        } else {
            headerClass = 'animated flipOutY';
            gridClass = 'animated flipInY';
            headerIconStyle.opacity = '1';
            gridIconStyle.opacity = '0';
            headerIconStyle.zIndex = '2';
            gridIconStyle.zIndex = '0';
        }
        return (
            <div>
                <div className={gridClass}>
                    <div id='foo'></div>
                </div>
                <img src={documentIcon} style={this.state.styles.floatingHeaderIcon} onClick={this.flip}/>
                <img src={grid} style={this.state.styles.floatingGridIcon} onClick={this.flip}/>
                <div className={headerClass}>
                    <button onClick={this.getData}>Get Data</button>
                    <button onClick={this.getData}>Get Data</button>
                    <button onClick={this.getData}>Get Data</button>
                    {data}
                </div>
            </div>
        );
    }
});

export default SpreadSheet;
