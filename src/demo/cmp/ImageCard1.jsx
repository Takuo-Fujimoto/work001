import React, {Component} from 'react';
import $ from 'jquery';
import dataJson from '../data/data_ja.json'
import FlexContainer from './FlexContainer.jsx';

var ImageCardItem = React.createClass({

    getInitialState: function() {
        return {hover: false,
            pop: false,
            moveX: 0,
            moveY: 0
        }
    },
    toggleHover: function() {
        this.setState({
            hover: !this.state.hover
        });
        var x = Math.random();
        if (x < 0.5) {
            this.setState({pop: true});
        } else {
            this.setState({pop: false});
        }
    },

    render: function() {
        console.info('render!!!!');
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
                    : (3 - (this.props.itemCount % 3)) < (4 - (this.props.itemCount))
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

        const styles = {
            card: {
                height: cardHeight + 'px',
                width: cardHeight + 'px',
                margin: '15px'
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
                animation: 'highJamp 0.3s linear',
                position: 'relative'
            }
        };

        var bakImageContainer = {};
        // DeepCopy
        Object.assign(bakImageContainer, styles.radiusImgContainer);
        // backGroundImage Add
        bakImageContainer.backgroundImage = `url(${this.props.imageData[this.props.cardData.id]})`;

        var fadeInBlockBeforeStyle;
        var fadeInBlockAfterStyle;
        if (this.state.hover) {
            fadeInBlockBeforeStyle = styles.fadeInBlockBeforeHover;
            fadeInBlockAfterStyle = styles.fadeInBlockAfterHover;
        } else {
            fadeInBlockBeforeStyle = styles.fadeInBlockBefore;
            fadeInBlockAfterStyle = styles.fadeInBlockAfter;
        }
        var cardStyle;
        if (this.state.pop) {
            cardStyle = {
                ...styles.card,
                ...styles.highJamp
            };
        } else {
            cardStyle = styles.card;
        }
        // TODO 自分でhoverのためにコード書くとかしんどいので、ライブラリを入れたい
        return (
            <div className='imageContainer type3 jamp' style={cardStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                <div style={bakImageContainer} className='imageImage centerItem'/>
                <div style={{
                    ...styles.fadeInBlock,
                    ...fadeInBlockBeforeStyle
                }} className='fadeInBlock'/>
                <dl style={styles.fadeInTextBlock}>
                    <dt>{this.props.cardData.name}</dt>
                    <dd>{this.props.cardData.description}</dd>
                </dl>
                <div style={{
                    ...styles.fadeInBlock,
                    ...fadeInBlockAfterStyle
                }} className='fadeInBlock'/>
            </div>
        );
    }
});

var ImageCard = React.createClass({

    render: function() {
        var masterNodes = this.props.data.map(function(cardData) {
            return (<ImageCardItem cardData={cardData} imageData={this.props.imageData} itemCount={this.props.data.length}/>);
        }, this);
        return (
            <FlexContainer>{masterNodes}</FlexContainer>
        );
    }
});

export default ImageCard;

/* 「...」はオブジェクトの展開演算子 二つのオブジェクトを、オブジェクトの中でそれぞれ展開することでマージされたオブジェクトが生成される。*/
