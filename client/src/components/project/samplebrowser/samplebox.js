import React, {Component} from "React";
import {
    StyleSheet,
    View,
    PanResponder,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';

export default class SamplBox extends Component {

  constructor(){
      super();

      this.state = {
          pan: new Animated.ValueXY()
      };
  }

  componentWillMount(){

    // Add a listener for the delta value change
    this._val = { x:0, y:0 }
    this.state.pan.addListener((value) => this._val = value);

    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({ x:0, y:0});
        this.props.onMove();
      },

      /*
      onStartShouldSetPanResponder: (e, gesture) => true,
      */
      //pre
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(e, gestureState);
      },

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        this.setState({respond: false})
        }
    });
  }

  render(){
    const panStyle = {
        transform: this.state.pan.getTranslateTransform()
    }

    return (
      <Animated.View
      {...this.panResponder.panHandlers}
      style={[panStyle, styles.sampleBox]}
      >

        <Animated.Text style={styles.sampleText}>{this.props.name}</Animated.Text>

      </Animated.View>

    );

  }
}


let styles = StyleSheet.create({
  sampleBox: {
    backgroundColor: "skyblue",
    height: 20,
    borderRadius: 1,
    borderWidth:1,
    borderColor: 'black',
    marginBottom: 10
  },
  sampleText: {
    textAlign: 'center'
  }
})