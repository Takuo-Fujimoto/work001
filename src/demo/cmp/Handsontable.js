import React from 'react';
import HandsontableJS from 'handsontable/dist/handsontable0.full';
import HandsontableCSS from 'handsontable/dist/handsontable.full.css';
import HandsontableEditCSS from './hot.css';
import $ from 'jquery';

var Handsontable = React.createClass({
    getInitialState: function() {
        // console.log('constructor');
        const defaultSettings = {
            hiddenColumns: {
                columns: [0]
            },
            autoColumnSize: {
                syncLimit: 3000
            },
            minRows: this.props.tabInfo.itemNameList.length,
            maxRows: this.props.tabInfo.itemNameList.length,
            manualColumnResize: true,
            rowHeaders: this.props.tabInfo.itemNameList,
            colHeaders: function(col) {
                // カラムヘッダーを数値連番表示に変更。デフォルトはアルファベット
                // 隠し列が1行あるので、0からの連番で作って1列目(0番)が非表示になり1からに見える
                return (col);
            },
            //fixedRowsTop: 2, // temporary
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
        };
        // 表示順からItemIdを特定したい
        // 表示順⇒ItemIdのMapと表示順の配列（ソートする）をつくってソート済み表示順配列をループで回して順次MapからItemIdを取り出して配列に詰めていく
        // これに表示順に沿ったItemIdを入れていく
        var itemIdSortedArray = [];
        // これは表示順⇒ItemIdのMap
        var itemDisplayOrderIdMap = {};
        // これは表示順の配列（ソートする）
        var itemDisplayOrderIdArray = [];
        Object.keys(this.props.tabInfo.itemInfo).forEach(function(itemKey) {
            itemDisplayOrderIdMap[this.props.tabInfo.itemInfo[itemKey].itemDisplayOrder] = itemKey;
            itemDisplayOrderIdArray.push(this.props.tabInfo.itemInfo[itemKey].itemDisplayOrder);
        }, this);
        itemDisplayOrderIdArray.sort(function(a, b) {
            return (a < b)
                ? -1
                : (a > b)
                    ? 1
                    : 0;
        });
        itemDisplayOrderIdArray.forEach(function(dispOrder) {
            itemIdSortedArray.push(itemDisplayOrderIdMap[dispOrder]);
        });
        // 自分で用意したhotのデフォルト設定に、シートごとに個別に変えたいポイントがある場合に引数settingsで渡してくるので、マージする
        var settings = $.extend(defaultSettings, this.props.settings);
        return {
            tabInfo: this.props.tabInfo,
            containerId: this.props.containerId,
            settings: settings,
            data: this.props.data,
            isInitial: true,
            itemIdSortedArray: itemIdSortedArray
        }
    },
    componentDidMount: function() {
        // console.info('componentDidMount : ' + this.state.tabInfo.tabId);
        this.createHandsOnTable();
    },
    componentWillUnmount: function() {
        // console.info('componentWillUnmount : ' + this.state.tabInfo.tabId);
    },
    isHalf: function(c) {
        if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            return true;
        }
        return false;
    },

    shouldComponentUpdate() {
        // console.info('shouldComponentUpdate : ' + this.state.tabInfo.tabId);
        if (this.state.hot) {
            this.state.hot.updateSettings(this.state.settings);
        }
        // スクロール用の行ヘッダーが変な位置に出るので、ちゃんと一番上に出る様に補正する　なぜ変な位置に出るのかは不明
        let top = $('#' + this.state.containerId + ' .ht_clone_top');
        let topLeft = $('#' + this.state.containerId + ' .ht_clone_top_left_corner');
        // console.info(this.state.containerId + ' top / ' + top.css('transform'));
        // console.info(this.state.containerId + ' topLeft / ' + topLeft.css('transform'));
        // top.css('transform', 'translate3d(0px, 0px, 0px)');
        // topLeft.css('transform', 'translate3d(0px, 0px, 0px)');
        top.css('transform', '');
        topLeft.css('transform', '');
        // console.info(this.state.containerId + ' 2 top / ' + top.css('transform'));
        // console.info(this.state.containerId + ' 2 topLeft / ' + topLeft.css('transform'));
        return false;
    },
    createHandsOnTable: function() {
        let tabId = this.state.tabInfo.tabId;
        let container = document.getElementById(this.state.containerId);

        // ハンズオンテーブルにセットする初期データ
        // 1列目に項目IDを隠し項目として持たせる
        let tableData = this.state.data;
        let itemInfoKeyArray = this.state.itemIdSortedArray;

        let labelMaxLength = 0;

        for (var i = 0; i < itemInfoKeyArray.length; i = i + 1) {
            // ハンズオンテーブルの隠し列に項目IDを持たせる
            tableData.push([itemInfoKeyArray[i]]);
            let itemName = this.state.tabInfo.itemInfo[itemInfoKeyArray[i]].itemName;
            // 文字列を一文字ずつ分割
            let itemNameArray = itemName.split('');
            let hankakuMojisuu = 0;
            itemNameArray.forEach(function(str) {
                hankakuMojisuu = this.isHalf(str) ? hankakuMojisuu + 0.7 : hankakuMojisuu + 2;
            }, this);
            labelMaxLength = labelMaxLength < hankakuMojisuu
                ? hankakuMojisuu
                : labelMaxLength;
        }
        // 行ヘッダーの幅をラベルの文字数 * 13px(1文字あたりの最大幅)にする
        let columnHeaderWidth = labelMaxLength * 6.5;
        // デフォルトカラムサイズ(明細数)はマスタ設定項目にするのが良いか？
        let columnWidth = 100;
        // 行ヘッダーを差し引いた残りの幅を1カラムあたりの幅で割って、初期表示カラム数を決める
        let defaultColumnSize = Math.floor((window.innerWidth - columnHeaderWidth) / columnWidth);
        // 0行になることは、避ける
        defaultColumnSize = defaultColumnSize < 1
            ? 1
            : defaultColumnSize;
        // 1行非表示にしているから指定されたカラムサイズ分足す。
        // 合計列数はカラムサイズ＋１になり、1列目が非表示になるので、結果指定されたカラムサイズの表示になる。
        for (i = 0; i < defaultColumnSize; i = i + 1) {
            tableData[0].push('');
        }
        this.state.settings.data = tableData;
        this.state.settings.colWidths = columnWidth;
        // ハンズオンテーブル生成
        var instance = new HandsontableJS(container, this.state.settings);
        this.setState({hot: instance});
        $('#' + this.state.containerId + ' .handsontable col.rowHeader').css('width', columnHeaderWidth + 'px');
    },
    render() {
        // console.info('HandsOnTableRender!');
        // console.info(this.state.hot);
        return (
            <div id={this.state.containerId} key={this.state.containerId}></div>
        );
    }
});

export default Handsontable;
