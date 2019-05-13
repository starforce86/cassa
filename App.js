/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import firebase from 'react-native-firebase';
import { Provider, connect } from 'react-redux';
import { store, persistor} from './src/config/store';
import { NavigatorRoot } from './src/routes/index';
import { PersistGate } from 'redux-persist/integration/react'


const Home=()=><Text>Hello with app</Text>

class App extends React.Component {

  componentDidMount() {
    // firebase.crashlytics().crash();
  }

  render() {
      return <NavigatorRoot />;
  }
}

const mapStateToProps = (state, ownProps) => {
//  console.log(state)
    return {
      isLoggedIn: state.auth.isLoggedIn,
      
  };
}

const ConnectedApp = connect(mapStateToProps)(App);

export default class Cassa extends Component {
  render() {
      return (
          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                  <ConnectedApp />
              </PersistGate>
          </Provider>
      );
  }
}

//AppRegistry.registerComponent('cassaFrontendApp', () => Cassa);

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
});
