
import React, { Component } from 'react';
import { Text, View, StyleSheet, LayoutAnimation, Platform, UIManager, TouchableOpacity } from 'react-native';

export default class ExpandView extends Component {
    constructor() {
        super();

        this.state = { onLayoutHeight: 0, modifiedHeight: 0, expanded: false }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
    }

    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (this.state.expanded === false)
            this.setState({ modifiedHeight: this.state.onLayoutHeight, expanded: true });
        else
            this.setState({ modifiedHeight: 0, expanded: false });
    }

    getViewHeight(height) {
        this.setState({ onLayoutHeight: height });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.btnTextHolder}>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout} style={styles.Btn}>
                        <Text style={styles.btnText}>Expand / Collapse</Text>
                    </TouchableOpacity>
                    <View style={{ height: this.state.modifiedHeight, }}>
                        <View style={styles.text} onLayout={(event) => this.getViewHeight(event.nativeEvent.layout.height)}>
                            {this.props.children}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        container:
        {
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: 'center',
            paddingTop: (Platform.OS === 'ios') ? 20 : 0
        },

        text:
        {
            fontSize: 17,
            color: 'black',
            padding: 10
        },

        btnText:
        {
            textAlign: 'center',
            color: 'white',
            fontSize: 20
        },

        btnTextHolder:
        {
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.5)'
        },

        Btn:
        {
            padding: 10,
            backgroundColor: 'rgba(0,0,0,0.5)'
        }
    });