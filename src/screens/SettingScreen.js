import React, { Component } from 'react';
import { View, Picker, ActivityIndicator, StatusBar } from 'react-native';
import * as firebase from 'firebase';

import { FormLabel, FormInput, Button, CheckBox } from 'react-native-elements';

// Make a component
class SettingScreen extends Component {
  state = {
    username: null,
    email: null,
    birthday: null,
    gender: 'mail',
    saving: false
  };

  async componentWillMount() {
    const { currentUser } = firebase.auth();
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    try {
      let snapshot = await dbUserid.once('value');
      let username = snapshot.val().username;
      let email = snapshot.val().email;
      let birthday = snapshot.val().birthday;
      let gender = snapshot.val().gender;

      this.setState({ username, email, birthday, gender });
    } catch (err) { }
  }

  onSaveInfo = async () => {
    this.setState({ saving: true });
    const { currentUser } = firebase.auth();
    const { username, email, birthday, gender } = this.state;
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    await dbUserid.set({ username, email, birthday, gender });
    this.setState({ saving: false });
  }

  renderButton() {
    if (this.state.saving) {
      return <ActivityIndicator size='large' />;
    }

    return (
      <Button
        style={{ marginTop: 10 }}
        title='Save Setting'
        onPress={this.onSaveInfo}
        backgroundColor='#4AAF4C'
      />
    );
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.formStyle}>
        <StatusBar barStyle='light-content' />
        <FormLabel>Username</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder={this.state.username}
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
        />
        <FormLabel>Email</FormLabel>
        <FormInput
          placeholder={this.state.email}
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='email-address'
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        
        <FormLabel>Birthday</FormLabel>
        <FormInput
          autoCorrect={false}
          placeholder={this.state.birthday}
          value={this.state.birthday}
          onChangeText={birthday => this.setState({ birthday })}
        />
        <Picker
          selectedValue={this.state.gender}
          onValueChange={gender => this.setState({ gender })}
        >
          <Picker.Item label="Mail" value="mail" />
          <Picker.Item label="Femail" value="femail" />
        </Picker>
        {this.renderButton()}
      </View>
    );
  }
}

const styles = {
  formStyle: {
    marginTop: 50
  }
};

export default SettingScreen;
