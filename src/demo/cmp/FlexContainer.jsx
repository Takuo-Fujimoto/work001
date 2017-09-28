import React, {Component} from 'react';

var windowHeight = window.innerHeight;
var halfHeight = windowHeight / 2;
var FlexContainer = React.createClass({

    getInitialState: function() {
        const styles = {
            flexContainer: {
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center',
                alignItems: 'center'
            }
        };

        if (this.props.children) {
            let heightOffset = window.innerHeight > 250
                ? (window.innerHeight / 3000).toFixed(2)
                : 0;
            heightOffset = this.props.children.length > 4
                ? 0
                : heightOffset;
            styles.flexContainer.marginTop = window.innerHeight * (heightOffset > 0.2
                ? 0.2
                : heightOffset) + 'px';
        }
        return {styles: styles, heightZero: false, flag: false};
    },
    componentDidMount: function() {
        window.addEventListener("resize", this.resizeContainer);
    },
    componentWillUnmount: function() {
        window.removeEventListener("resize", this.resizeContainer);
    },
    resizeContainer: function() {
        this.setState({
            flag: !this.state.flag
        });
    },
    render() {
        console.info('FlexRender!!' + this.state.heightZero + ' / ' + this.props.invisible);
        if (!this.state.heightZero && this.props.invisible) {
            // this.state.styles.flexContainer.height = '0px';
            // this.state.styles.flexContainer.transition = 'height 5.5s ease';
            this.state.styles.flexContainer.animation = 'fadeOutHeight 1.5s ease-in';
            this.state.styles.flexContainer.WebkitAnimation = 'fadeOutHeight 1.5s ease-in';
            this.state.styles.flexContainer.animationFillMode = 'forwards';
            this.setState({heightZero: true});
        }
        return <div style={{
            ...this.state.styles.flexContainer,
            ...this.props.propStyles
        }}>{this.props.children}</div>;
    }
});
export default FlexContainer;
