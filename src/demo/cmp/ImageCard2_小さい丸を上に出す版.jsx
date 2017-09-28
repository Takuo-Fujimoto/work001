import React, {Component} from 'react';
import $ from 'jquery';
import dataJson from '../data/data_ja.json'
import FlexContainer from './FlexContainer.jsx';
import {browserHistory} from 'react-router';

var clickedId = '';

var ImageCardItem = React.createClass({

    contextTypes: {
        router: React.PropTypes.object
    },

    getInitialState: function() {
        // カードを1行にいくつ表示するか
        // 1. 3 or 4で割り切れるならその数値（4優先）
        // 2. できるだけ、端数が揃ってる行と近い数にしたいので、割った余りと３，４それぞれの差を比較する。
        //    3で割った余りの差が4で割った余りの差より小さければ3, そうでなければ4
        var itemCount = this.props.itemCount <= 4
            ? this.props.itemCount
            : this.props.itemCount % 4 === 0
                ? 4
                : this.props.itemCount % 3 === 0
                    ? 3
                    : (3 - (this.props.itemCount % 3)) < (4 - (this.props.itemCount % 4))
                        ? 3
                        : 4;

        var windowWidth = window.innerWidth;
        var cardLength = windowWidth / (itemCount + 0.1);
        var windowHeight = window.innerHeight;
        var cardHeight = windowHeight / 2;
        // フェードインブロックの画像中心位置からの距離
        var fadeInBlockStartMargin = cardHeight + (cardHeight / 5);
        var cardImageHeight = cardHeight - 20;
        // 正円にするために、大きい値を指定する（固定値）
        var radiusLength = '10000px';
        // フェードインテキストの幅(左右25px余白)
        var textWidth = cardHeight - 50;

        var lengthDefinition = {
            cardHeight: cardHeight,
            cardImageHeight: cardImageHeight,
            textWidth: textWidth,
            fadeInBlockStartMargin: fadeInBlockStartMargin
        }

        const styles = {
            card: {
                height: cardHeight + 'px',
                width: cardHeight + 'px',
                margin: '15px',
                opacity: '1'
            },
            radiusImgContainer: {
                height: cardImageHeight + 'px',
                width: cardImageHeight + 'px',
                borderRadius: radiusLength,
                border: '5px solid #ff3e7c',
                boxShadow: '0px 0px 10px #ccc, inset 0 px 0 px 10 px rgba(0, 0, 0, 0.8)',
                backgroundRepeat: 'no-repeat',
                backgroundPositionX: 'center',
                backgroundPositionY: 'center',
                backgroundSize: 'cover'
            },

            fadeInTextBlock: {
                height: textWidth + 'px',
                width: textWidth + 'px'
            },
            fadeInBlock: {
                height: cardHeight + 'px',
                width: cardHeight + 'px'
            },

            fadeInBlockBefore: {
                WebkitTransform: 'translateX(-' + fadeInBlockStartMargin + 'px) skew(-45deg)',
                transform: 'translateX(-' + fadeInBlockStartMargin + 'px) skew(-45deg)',
                borderRadius: radiusLength + ' 0px' + ' 0px ' + radiusLength
            },

            fadeInBlockAfter: {
                WebkitTransform: 'translateX(' + fadeInBlockStartMargin + 'px) skew(-45deg)',
                transform: 'translateX(' + fadeInBlockStartMargin + 'px) skew(-45deg)',
                borderRadius: '0px ' + radiusLength + ' ' + radiusLength + ' 0px'
            },

            fadeInBlockBeforeHover: {
                WebkitTransform: 'translateX(0px) skew(0)',
                transform: 'translateX(0px) skew(0)',
                borderRadius: radiusLength
            },

            fadeInBlockAfterHover: {
                WebkitTransform: 'translateX(0px) skew(0)',
                transform: 'translateX(0px) skew(0)',
                borderRadius: radiusLength
            },
            highJamp: {
                animation: 'highJamp 0.4s linear',
                position: 'relative'
            },
            moveCenter: {
                transition: 'all 2s ease-in-out'
            },
            fadeOut: {
                opacity: '0'
            }
        };
        return {
            hover: false,
            pop: false,
            click: false,
            back: true,
            styles: styles,
            itemCount: this.props.itemCount,
            lengthDefinition: lengthDefinition
        }
    },
    toggleHover: function() {
        this.setState({
            hover: !this.state.hover
        });
        var x = Math.random();
        if (x < 0.05) {
            this.setState({pop: true});
        } else {
            this.setState({pop: false});
        }
    },
    onClick: function(e) {
        if (clickedId) {
            return;
        }

        // その他のカードをフェードアウトさせると残ったコンポーネントが画面の中央へ移動する。
        // stateに入れるフラグは、クリックした奴だけtrueになる。⇒クリックしたコンポーネントにだけ行いたい処理(この場合は、移動)はこのフラグで判定して、書く
        this.setState({click: true});
        clickedId = this.props.cardData.id;

        // 子カードを表示する。

        // this.context.router.push('/works');
        browserHistory.push('/works');
    },

    render: function() {
        console.info('CardRender!!!! ' + this.props.cardData.id + ' / clicked: ' + clickedId);

        var bakImageContainer = {};
        // DeepCopy
        Object.assign(bakImageContainer, this.state.styles.radiusImgContainer);
        // backGroundImage Add
        bakImageContainer.backgroundImage = `url(${this.props.imageData[this.props.cardData.id]})`;

        var fadeInBlockBeforeStyle;
        var fadeInBlockAfterStyle;
        if (this.state.hover) {
            fadeInBlockBeforeStyle = this.state.styles.fadeInBlockBeforeHover;
            fadeInBlockAfterStyle = this.state.styles.fadeInBlockAfterHover;
        } else {
            fadeInBlockBeforeStyle = this.state.styles.fadeInBlockBefore;
            fadeInBlockAfterStyle = this.state.styles.fadeInBlockAfter;
        }
        var cardStyle;
        if (this.state.pop) {
            cardStyle = {
                ...this.state.styles.card,
                ...this.state.styles.highJamp
            };
        } else {
            cardStyle = this.state.styles.card;
        }

        // 非表示処理 クリックIDが存在して、それが自分じゃない場合は、非表示
        // まず、クリックIDのコンテナを判別して、自分のコンテナにクリックがされているか

        var fadeInTextBlockStyle = this.state.styles.fadeInTextBlock;
        var fadeInBlockStyle = this.state.styles.fadeInBlock

        var descriptionText = this.props.cardData.description;

        if (clickedId) {
            if (this.state.click) {
                cardStyle.transition = 'all 1s ease-in';
                bakImageContainer.transition = 'all 1s ease-in';
                fadeInTextBlockStyle.transition = 'all 1s ease-in';
                fadeInBlockStyle.transition = 'all 1s ease-in';
                descriptionText = '';
            } else {
                cardStyle.transition = 'all 1s';
            }
            if (clickedId != this.props.cardData.id) {
                cardStyle.opacity = '0';
                cardStyle.height = '0px';
                cardStyle.width = '0px';
            } else {
                cardStyle.height = (this.state.lengthDefinition.cardHeight / 2) + 'px';
                cardStyle.width = (this.state.lengthDefinition.cardHeight / 2) + 'px';
                bakImageContainer.height = (this.state.lengthDefinition.cardImageHeight / 2) + 'px';
                bakImageContainer.width = (this.state.lengthDefinition.cardImageHeight / 2) + 'px';
                fadeInTextBlockStyle.height = (this.state.lengthDefinition.textWidth / 1.5) + 'px';
                fadeInTextBlockStyle.width = (this.state.lengthDefinition.textWidth / 1.5) + 'px';
                fadeInBlockStyle.height = (this.state.lengthDefinition.cardHeight / 2) + 'px';
                fadeInBlockStyle.width = (this.state.lengthDefinition.cardHeight / 2) + 'px';
            }
        }

        // TODO 自分でhoverのためにコード書くとかしんどいので、ライブラリを入れたい
        return (
            <div id={this.props.cardData.id} className='imageContainer type3' style={cardStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick={this.onClick}>
                <div style={bakImageContainer} className='imageImage centerItem'/>
                <div style={{
                    ...fadeInBlockStyle,
                    ...fadeInBlockBeforeStyle
                }} className='fadeInBlock'/>
            <dl style={fadeInTextBlockStyle}>
                    <dt>{this.props.cardData.name}</dt>
                    <dd>{descriptionText}</dd>
                </dl>
                <div style={{
                    ...fadeInBlockStyle,
                    ...fadeInBlockAfterStyle
                }} className='fadeInBlock'/>
            </div>
        );
    }
});

var ImageCard = React.createClass({

    getInitialState: function() {
        return {flag: true};
    },
    onClick: function(e) {
        console.info('containerClick!');
        this.setState({
            flag: !this.state.flag
        });
    },

    render: function() {
        console.info('containerRender!');
        var masterNodes = this.props.data.map(function(cardData) {
            return (<ImageCardItem cardData={cardData} imageData={this.props.imageData} itemCount={this.props.data.length}/>);
        }, this);
        return (
            <div onClick={this.onClick}>
                <FlexContainer>{masterNodes}</FlexContainer>
            </div>
        );
    }
});

export default ImageCard;

/* 「...」はオブジェクトの展開演算子 二つのオブジェクトを、オブジェクトの中でそれぞれ展開することでマージされたオブジェクトが生成される。*/
