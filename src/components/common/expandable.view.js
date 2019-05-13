import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Animated } from 'react-native';
import Expand from 'react-native-simple-expand';
import { ASSET_STYLE, STYLE } from '../../config/theme';

class ExpandableView extends Component {
    constructor(props) {
        super(props);

        this.icons = {
            'up': require('../../assets/images/forms/question.png'),
            'down': require('../../assets/images/components/minus.png')
        };

        this.state = {
            title: props.title,
            expanded: false
        };
    }

    toggle() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        let icon = this.icons['up'];

        if (this.state.expanded) {
            icon = this.icons['down'];
        }

        const titleCharCount = this.state.title ? this.state.title.length : 0;

        return (
            <View
                style={[styles.container, { backgroundColor: (this.state.expanded ? ASSET_STYLE.containerBg : '#fff') }]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage} resizeMode="contain"
                            source={(titleCharCount > 60) ? require('../../assets/images/forms/question.png') : icon}
                        ></Image>
                    </TouchableHighlight>
                </View>

                <Expand style={[styles.body]} value={this.state.expanded}>
                    {this.props.children}
                </Expand>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        paddingLeft: 5, paddingRight: 10,
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    titleContainer: {
        flexDirection: 'row'
    },
    title: {
        flex: 1,
        padding: 10,
        color: '#000000',
        ...STYLE.bodyfontStyle
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonImage: {
        width: 25, height: 25
    },
    body: {
        padding: 10,
        paddingTop: 0
    }
});

export default ExpandableView;