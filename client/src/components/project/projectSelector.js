import React from 'react';
import {StyleSheet,
        Text,
        View,
        FlatList,
        Button,
        TouchableHighlight} from 'react-native';
import SocketIOClient from 'socket.io-client';
import { StackNavigator } from 'react-navigation';

export default class ProjectSelector extends React.Component {
  constructor(){
      super();

      this.state = {
        projects: []
      };

      this.socket = SocketIOClient('http://10.0.2.2:3000');

      this.socket.on('rec-projects', (res) => {
        this.setState({projects: res});
      });

      this.socket.on('new-project', (res) => {
        let projects = this.state.projects;

        projects.push({key: res});
        this.setState({projects: projects});
      });

      this.socket.on('get-del-project', (res) => {
        this.deleteProject(res);
      })
  }

  createProject = () => {
    //let projects = this.state.projects;

    let projectId = 'Project ' + Math.floor(Math.random() * 1000000000) + 1;
    //projects.push({key: projectId});

    //this.setState({projects: projects}, () => {
      this.socket.emit('create-project', {id: projectId});
      this.props.navigation.navigate('Manager', {id: projectId, socket: this.socket});
    //});
  }

  joinProject = (key) => {
    this.socket.emit('join-project', {id: key});
    this.props.navigation.navigate('Manager', {id: key, socket: this.socket});
  }

  deleteProject = (key) => {
    let projects = this.state.projects;

    this.setState({projects:[]},()=>{
      for(let i = 0; i < projects.length; i++){
        if (projects[i].key == key){
          projects.splice(i,1);
          this.setState({projects:projects});
        }
      }
    });
  }

  onLongPress = (key) => {
    this.deleteProject(key);

    this.socket.emit('del-project', {id: key});
  }

  render() {
    const { navigate, state } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>{'Weco! :)'}</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.projects}
            extraData={this.state}
            renderItem={({item}) => {
                return(
                  <TouchableHighlight onLongPress={() => this.onLongPress(item.key)} onPress={() => this.joinProject(item.key)}>
                    <View style={styles.itemContainer}>
                       <Text>{item.key}</Text>
                    </View>
                  </TouchableHighlight>
                )
              }
            }
          />
        </View>
        <View style={styles.buttonCont}>
          <Button
            onPress={() => this.createProject()}
            title="New project" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(216, 231, 255)',
  },

  listContainer: {
    width: '80%',
    height: '65%',
    borderColor: 'black',
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: 'white'
  },

  itemContainer: {
    borderColor: 'black',
    borderWidth: 1,
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  buttonCont: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});
