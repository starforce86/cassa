import React, { Component } from 'react';
import { StatusBar, StyleSheet, Platform, View } from 'react-native';

const STATUSBAR_HEIGHT = ((Platform.OS === 'ios') ? 0 : 0);

export default CassaStatusBar = ({backgroundColor, ...props}) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT
    }
});