import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Animated } from 'react-native';
import Expand from 'react-native-simple-expand';
import { ASSET_STYLE, STYLE, COLOR } from '../../config/theme';

class ProfileExpandableView extends Component {
    constructor(props) {
        super(props);

        this.icons = {
            'up': require('../../assets/images/components/plus.png'),
            'down': require('../../assets/images/components/minus.png')
        };

        this.state = {
            title: props.title,
            icon: props.icon,
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
                style={[styles.container]}>
                <View style={[styles.titleContainer, { backgroundColor: ASSET_STYLE.containerBg }]}>
                    <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10, paddingBottom: 5 }}>
                        <Image resizeMode="contain" style={{ width: 15, height: 15, justifyContent: 'center', marginLeft: 5 }} source={require('../../assets/images/home/team.png')} />
                        <Text style={styles.title}>{this.state.title}</Text>
                    </View>
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
        backgroundColor: '#fff',

        //  overflow: 'hidden'
    },
    titleContainer: {
        flexDirection: 'row'
    },
    title: {
        flex: 1,
        paddingLeft: 10,
        color: COLOR.PRIMARYDARK,
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
        padding: 20,
        marginBottom: 10
    }
});

export default ProfileExpandableView;