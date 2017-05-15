import React, { Component } from 'react';
import { View, ActivityIndicator, AsyncStorage, Picker, StatusBar } from 'react-native';
import * as firebase from 'firebase';
import { FormLabel, FormInput, FormValidationMessage, Button, Text } from 'react-native-elements';
import { Facebook } from 'expo';

// Make a component
class SignupScreen extends Component {
  state = {
    email: null,
    password: null,
    username: null,
    birthday: null,
    gender: 'mail',
    error: ' ',
    loading: false,
    saving: false,
    showSpinner: false,
    token: null,
    status: 'Not Login...'
  };

  facebookLogin = async () => {
    console.log('Testing token....');
    let token = await AsyncStorage.getItem('fb_token');

    if (token) {
      console.log('Already having a token...');
      this.setState({ token });

      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      this.setState({ status: `Hello ${(await response.json()).name}` });
      console.log(response);

    } else {
      console.log('DO NOT having a token...');
      this.doFacebookLogin();
    }
  };

  doFacebookLogin = async () => {
    let { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '1184175101694797',
      {
        permissions: ['public_profile'],
        behavior: 'web'
      });

    if (type === 'cancel') {
      console.log('Login Fail!!');
      return;
    }

    await AsyncStorage.setItem('fb_token', token);
    this.setState({ token });
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`);
    this.setState({ status: `Hello ${(await response.json()).name}` });
    console.log(response);
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    try {
      await firebase.auth().signInWithCredential(credential);
      const { currentUser } = await firebase.auth();
      console.log(`currentUser = ${currentUser.uid}`);
      this.props.navigation.navigate('UserStack');
    } catch (err) {

    }
  };

  onSaveInfo = async () => {
    
    const { currentUser } = firebase.auth();
    const { email, username, birthday, gender } = this.state;
    let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
    await dbUserid.set({  username, email, birthday , gender });

    console.log('check the saving funcrtion~~~~~~~~');
  }

  onCreateUser = async () => {
    const { email, password } = this.state;
    this.setState({ saving: true });
    try {

      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const { currentUser } = firebase.auth();
      let dbUserid = firebase.database().ref(`/users/${currentUser.uid}`);
      await dbUserid.set({  username: "", email: "", birthday: "", gender: "" });
      
      try{ 
        this.onSaveInfo();
      } catch (err){
        console.log('saving fail!!!!!!!!!!!');
      }
      this.setState({ saving: false });
      this.props.navigation.navigate('UserStack');
    } catch (err) {
      this.setState({
        email: '',
        password: '',
        username: null,
        birthday: null,
        gender: 'mail',
        error: err.message,
        loading: false,
        showModal: false
      });
    }
  }

  renderButton() {
    if (this.state.saving) {
      return <ActivityIndicator size='large' />;
    }

    return (
      <Button
        title='Sign up'
        backgroundColor='#4AAF4C'
        onPress={this.onCreateUser}
      />
    );
  }

  async componentDidMount() {
    await AsyncStorage.removeItem('fb_token');
  }

  render() {
    console.log(this.state);
    return (
      <View>
  
        <View style={styles.formStyle}>
          <FormLabel>User Name</FormLabel>
          <FormInput
            placeholder='Your name'
            autoCorrect={false}
            value={this.state.username}
            onChangeText={username => this.setState({ username })}
          />
          <FormLabel>Email</FormLabel>
          <FormInput
            placeholder='user@email.com'
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry
            autoCorrect={false}
            autoCapitalize='none'
            placeholder='password'
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          <FormLabel>Birthday</FormLabel>
          <FormInput
            placeholder='1997/02/27'
            autoCorrect={false}
            autoCapitalize='none'
            value={this.state.birthday}
            onChangeText={birthday => this.setState({ birthday })}
          />
          <FormLabel>Gender</FormLabel>
          <Picker
          selectedValue={this.state.gender}
          onValueChange={gender => this.setState({ gender })}
          style={{ marginTop: -45 }}
        >
          <Picker.Item label="Mail" value="mail" />
          <Picker.Item label="Femail" value="femail" />
        </Picker>
          {this.renderButton()}
          <FormValidationMessage>{this.state.error}</FormValidationMessage>
        </View>
        <View style={styles.formStyle}>
          <Button
            title='Sign up with Facebook'
            backgroundColor='#39579A'
            onPress={this.facebookLogin}
            style={{ marginTop: -60 }}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  formStyle: {
    marginTop: 50
  }
};

export default SignupScreen;