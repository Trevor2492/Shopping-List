import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';

const firebase = require('firebase');
require('firebase/firestore');

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      lists: [],
    }
 
    // grabs the database from firebase/cloud firestore (initializes the firestore app)
    if (!firebase.apps.length){
      firebase.initializeApp({
        apiKey: "AIzaSyAmCso5NKRINJUH3xYEjiTGXS9gYw9ZrHw", // pulled all this stuff from firestore
        authDomain: "test-project-f5d22.firebaseapp.com",
        projectId: "test-project-f5d22",
        storageBucket: "test-project-f5d22.appspot.com",
        messagingSenderId: "823311981286",
        appId: "1:823311981286:web:32c4bae14a48d95afb7927",
        measurementId: "G-E1ZZW0ESKV"
      });
    }

  }

  componentDidMount(){
    this.referenceShoppingLists = firebase.firestore().collection('shoppinglists'); // This is the reference for the 'shoppinglists' collection within the firestore database
    this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];

    querySnapshot.forEach(doc => { // This loops through each document inside the 'querySnapshot' which is all the shopping lists
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });

    this.setState({
      lists,
    });

  };

  addList() {
    this.referenceShoppingLists.add({
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>All Shopping Lists</Text>
        <FlatList
          data={this.state.lists}
          renderItem={({ item }) => <Text style={styles.item}>{item.name}: {item.items}</Text>}
        />

        <Button title='Add Something' onPress={() => this.addList()} style={{width: 50}}/>

      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,     
  },
  item: {
    fontSize: 15,
    color: 'blue',
    marginLeft: 15
  },
  text: {
    fontSize: 30,
    margin: 15
  }
});
