import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup' // ES6
import './Counter.css';

var CountContainer = React.createClass({

    // stateのデフォルト値を設定する場合はgetInitialStateを定義
    getInitialState() {
        console.log("Initilize");
        return {num: 0};
    },

    // 画面遷移のためのコンテキスト
    contextTypes: {
        router: React.PropTypes.object
    },

    render() {
        let AwesomeNumber = <AwesomeNumber1 key={this.state.num} num={this.state.num}/>;
        if (this.state.num % 2 === 1) {
            AwesomeNumber = <AwesomeNumber2 key={this.state.num} num={this.state.num}/>;
        }

        return (
            <div>
                <div className='container'>
                    <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                        {AwesomeNumber}
                    </ReactCSSTransitionGroup>
                </div>
                <div style={{
                    textAlign: "center"
                }}>
                    <button onClick={this.handleClick.bind(this)}>Click Me!</button>
                    <button onClick={this.transition.bind(this)}>Transition!!</button>
                </div>
            </div>
        )
    },

    handleClick(e) {
        this.setState({
            num: this.state.num + 1
        });
    },

    // 画面遷移
    transition(e) {

        //Appページへ
        this.context.router.push('/userbox')
    }
});

// class AwesomeNumber1 extends React.Component {
var AwesomeNumber1 = React.createClass({
    render() {
        return (
            <div className='awesome'>
                <p className='awesome1'>{this.props.num}</p>
            </div>
        );
    }
});
AwesomeNumber1.propTypes = {
    num: React.PropTypes.number.isRequired
};
// class AwesomeNumber2 extends React.Component {
var AwesomeNumber2 = React.createClass({
    render() {
        return (
            <div className='awesome'>
                <p className='awesome2'>{this.props.num}</p>
            </div>
        );
    }
});
AwesomeNumber2.propTypes = {
    num: React.PropTypes.number.isRequired
};

export default CountContainer;
