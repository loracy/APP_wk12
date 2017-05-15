import React, { Component } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import * as firebase from 'firebase';
import { Tile, List, ListItem, Button } from 'react-native-elements';

// Make a component
class UserScreen extends Component {
  state = {
    username: null,
    email: null,
    birthday: null,
    gender: null
  };

  componentDidMount() {
    this.setUserInfo();
  }

  setUserInfo = async () => {
    const { currentUser } = firebase.auth();
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    try {
      let snapshot = await dbUserid.once('value');
      let Fusername = snapshot.val().username;
      let Femail = snapshot.val().email;
      let Fbirthday = snapshot.val().birthday;
      let Fgender = snapshot.val().gender;
      console.log('trying to get the info from firebase.............')
      console.log(Fusername);
      console.log(Femail);
      console.log(Fbirthday);
      this.setState({ username: Fusername, email: Femail, birthday: Fbirthday, gender: Fgender });
      console.log('setting the new state...............')
    } catch (err) { 
      console.log('cant see the info...........')
    }

  }

  onSignOut = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate('LoginScreen');
  }

  render() {
    const { username, email, birthday, gender } = this.state;
    return (
      <ScrollView>
        <StatusBar barStyle='light-content' />
        <List>
          <ListItem
            title="Username"
            rightTitle={username}
            hideChevron
          />
          <ListItem
            title="Email"
            rightTitle={email}
            hideChevron
          />
        </List>
        <List>
          <ListItem
            title="Birthday"
            rightTitle={birthday}
            hideChevron
          />
          <ListItem
            title="Gender"
            rightTitle={gender}
            hideChevron
          />
        </List>

        <Button
          style={{ flex: 1, marginTop: 10 }}
          title='Sign out'
          onPress={this.onSignOut}
        />
      </ScrollView>
    );
  }
}

export default UserScreen;