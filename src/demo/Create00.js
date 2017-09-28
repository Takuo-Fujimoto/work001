import React from 'react';
import Handsontable from 'handsontable/dist/handsontable0.full';
import HandsontableCSS from 'handsontable/dist/handsontable.full.css';
import HandsontableEditCSS from './hot.css';
import screenData from './data/mockScreenSettings.json'
import $ from 'jquery';
import grid from './../../images/grid.svg';
import documentIcon from './../../images/document.svg';

let hot = {};
let columns = [];
let data = '';
var SpreadSheet = React.createClass({
    getInitialState: function() {
        console.log('constructor');
        return {
            screenSettingData: screenData,
            isHeader: true
        }
    },
    getData : function() {
        var datafromtable = document.getElementById('foo');
        console.log('getData');
        data = hot.getData();
        console.log(data);
    },
    negativeValueRenderer : function(instance, td, row, col, prop, value, cellProperties) {
        console.log('arguments');
        //Handsontable.renderers.TextRenderer.apply(this, arguments);
        //return;
    },
    componentDidMount() {
        console.info('componentDidMount');
        var tabId = 'T001';
        var container = document.getElementById('foo');

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
            tableData[0].push("");
        }
        // ハンズオンテーブル生成
        hot = new Handsontable(container, {
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
        });
        // JQueryでdomを操作するのは、React的にはNGらしいけれど、HandsOnTableはコンポーネントのrenderが終わった後に
        // Divタグをreplace(or append?)してるからそもそもReactの管理対象じゃないんじゃないか。
        // と、理由をつけてJQueryを使う。動かしてみて問題があったら削除(単なるWidth指定なので、削除しても動作に支障なし)
        $('.handsontable col.rowHeader').css('width', columnHeaderWidth + 'px');
    }
    onClick: function(e) {
    render() {
        return (
            <div>
                <div>
                    <div id="foo"></div>
                    <button onClick={this.getData}>Get Data</button>
                    {data}
                    <img src={documentIcon} className='floatingIcon' onClick={this.flip}/>
                </div>
                <div>
                    ぐりっど！
                    <img src={grid} className='floatingIcon'/>
                </div>
            </div>
        );
    }
}
export default SpreadSheet;
