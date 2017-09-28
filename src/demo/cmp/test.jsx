import React, {Component} from 'react';

var test = React.createClass({

    render() {
        const styles = {
            highJamp: {
                animation: 'highJamp 0.3s linear',
                position: 'relative'
            }
        };
        return <div style={{
            height: '200px',
            padding: '100px'
        }}>文字を<span className='jamp' style={styles.highJamp}>ランダムで選んで</span>もっと高くジャンプさせています。</div>;
    }
});
export default test;
