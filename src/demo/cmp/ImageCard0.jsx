import React, {Component} from 'react';
import $ from 'jquery';
import dataJson from '../data/data_ja.json'
import FlexContainer from './FlexContainer.jsx';

var ImageCard = React.createClass({
    render: function() {
        // カードを1行にいくつ表示するか
        // 1. 3 or 4で割り切れるならその数値（4優先）
        // 2. できるだけ、端数が揃ってる行と近い数にしたいので、割った余りと３，４それぞれの差を比較する。
        //    3で割った余りの差が4で割った余りの差より小さければ3, そうでなければ4
        var itemCount = this.props.data.length <= 4 ? this.props.data.length : this.props.data.length % 4 === 0 ? 4 : this.props.data.length % 3 === 0 ? 3 : (3 - (this.props.data.length % 3)) < (4 - (this.props.data.length)) ?  3 : 4;

        var windowWidth = window.innerWidth;
        var cardLength = windowWidth / (itemCount + 0.1);
        var windowHeight = window.innerHeight;
        var cardHeight = windowHeight / 2;
        var cardImageHeight = cardHeight - 20;

        const styles = {
            card: {
                height: cardHeight + 'px',
                width: cardHeight + 'px'
            },
            radiusImgContainer: {
                height: cardImageHeight + 'px',
                width: cardImageHeight + 'px',
                borderRadius: cardLength + 'px',
                border: '5px solid pink',
                boxShadow: '0px 0px 10px #ccc, inset 0 px 0 px 10 px rgba(0, 0, 0, 0.8)',
                backgroundRepeat: 'no-repeat',
                backgroundPositionX: 'center',
                backgroundPositionY: 'center',
                backgroundSize: 'cover'
            }
        };

        var images = this.props.imageData;

        var masterNodes = this.props.data.map(function(cardData) {
            var bakImageContainer = {};
            // DeepCopy
            Object.assign(bakImageContainer, styles.radiusImgContainer);
            // backGroundImage Add
            bakImageContainer.backgroundImage = `url(${images[cardData.id]})`
            return (
                <div className='imageContainer' style={styles.card}>
                    <div style={bakImageContainer} className='imageImage centerItem'></div>
                    <div className='imageMiddle'>
                        <div className='imageText'>
                            <h2>{cardData.name}</h2>
                        </div>
                        <div className='imageText'>{cardData.description}</div>
                    </div>
                </div>
            );
        });
        return (
            <FlexContainer>{masterNodes}</FlexContainer>
        );
    }
});

export default ImageCard;
