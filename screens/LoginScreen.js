import React, { Component } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import db from '../config';

export default class LoginScreen extends Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        console.log('CREDENTIAL', credential);
        // Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential);
        //.then(function(result) {
        //    console.log("another result",result.user)
        //  if (result.additionalUserInfo.isNewUser) {
        db.ref('/users/' + googleUser.user.id)
          .set({
            gmail: googleUser.user.email,
            profile_picture: googleUser.user.photoUrl,

            first_name: googleUser.user.givenName,
            last_name: googleUser.user.familyNname,
            current_theme: 'dark',
          })

          // }
          // else {
          // console.log('User already signed-in Firebase.');
          // }

          // })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      }
    });
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        androidClientId:
          '416347912515-b0j2k8inf1dgkia729ab413e4sh02tdv.apps.googleusercontent.com',
        iosClientId:
          '416347912515-81n4ob6pq2rjpfc7ktki94milkgm29m4.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      //console.log(result)

      if (result.type === 'success') {
        this.onSignIn(result);
        this.props.navigation.navigate('DashboardScreen');
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Sign in with Google"
          onPress={() => this.signInWithGoogleAsync()}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
