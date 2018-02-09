import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default class Track extends Component {
  constructor(props){
    super(props);
    this.state = {
        width: 0,
        height: 0,
        scrollOffset: 0,
        sample: '',
        samples: [{sample: 'a'}, {sample: 'b'}, {sample: 'c'}, {sample: 'd'}, {sample: 'e'}, {sample: 'f'}]
    };

    this.socket = this.props.socket;

  }
  componentWillReceiveProps(nextProps){
    this.setState({sample: nextProps.sample});

    if(nextProps.droppedSample==='undefined'){
      return;
    }

    if(nextProps.droppedSample.length!=0){
        let curr=this.props.droppedSample;
        let next=nextProps.droppedSample;
        if(curr[1]!=next[1]&&curr[2]!=next[2]){
          //Handle sample dropped here
          //Check bounding rectangle of this box
          this.handleSampleDrop(nextProps.droppedSample);
        }
    }
  }

  /*componentWillUpdate(droppedSample) {
    this.handleSampleDrop(droppedSample);
  }*/

  handleSampleDrop = (sampleData) => {
    let sample = sampleData[0];
    let sampleX = sampleData[1]-this.props.offsetX;
    let sampleY = sampleData[2]-this.props.offsetY;

    let trackX=0;
    let trackY = this.props.y-this.props.scrollOffset;

    let trackWidth = this.state.width;
    let trackHeight= this.state.height;

    if(sampleX>trackX && sampleX<trackX+trackWidth &&
      sampleY>trackY && sampleY<trackY+trackHeight+10){ //+10 is equal to marginBottom for Track
        this.setState({sample: sampleData[0]}, () => {
          this.props.onSampleDrop({trackID: this.props.id, sample: sampleData[0]});
          this.socket.emit('new-sample-track', {projectID: 1, trackID: this.props.id, name: sampleData[0]});
        });
      }
  }

  handleLayout = (event) =>{
    let layout = event.nativeEvent.layout;
    this.setState({height: layout.height, width: layout.width})
    this.props.onLayout(layout.height,layout.width,10,this.props.id);
  }

  handleScroll = (e) =>{
    this.setState({scrollOffset: e.nativeEvent.contentOffset.y})
  }

  displayTrack = (item) =>{
    return <Text style = {styles.sampleContainer}> {item.sample} </Text>
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.handleLayout}>
        <FlatList
          data={this.state.samples}
          horizontal={true}
          extraData={this.state}
          onScroll={this.handleScroll}
          renderItem={({item}) => this.displayTrack(item)}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d9d9d9',
    borderWidth:1,
    borderColor:'black',
    height: 50,
    width: '100%',
    marginBottom: 10
  },

  sampleContainer: {
    textAlign: 'center',
    borderWidth:1,
    borderColor: 'black',
    height: 50,
    width: 100,
  }
});
