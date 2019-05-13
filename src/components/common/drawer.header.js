import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AsyncStorage } from "react-native";
import { connect } from 'react-redux';
import { COLOR, ASSET_STYLE, STYLE } from '../../config/theme';
import {WEB_URL} from '../../api/constant'



class DrawerHeader extends Component {

    constructor(props) {
        super(props)
    }

    render() {
       console.log(this.props) 
  //   console.warn(`${WEB_URL}/uploads/users/45x45/`)
        return (
            <View
                style={{
                    backgroundColor: '#083D8B',
                    height: '35%',
                    justifyContent: 'center',
                    paddingLeft: '5%'
                }}>
                <View style={{ flexDirection: 'row' }}>
                    { !this.props.profile? 
                        (<View style={styles.circleShapeView}></View>) : 
                        (<Image resizeMode="contain" style={[styles.circleShapeView, { backgroundColor: 'transparent'}]} source={{uri: `${WEB_URL}/uploads/users/45x45/${this.props.profile.image }`}} />) 
                    }
                    <View style={styles.titleContainer}>
                        <Text style={styles.txtView1}>
                        {
                            this.props.lastName
                        }
                        </Text>
                        <Text style={styles.txtView2}>
                            {
                                this.props.firstName
                            }
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    circleShapeView: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        backgroundColor: '#DADADA',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        flexDirection: 'column', justifyContent: 'center',
        paddingLeft: '5%'
    },
    txtView1: {
        color: 'white',
        ...STYLE.bodyfontStyle
    },
    txtView2: {
        color: 'white',
        ...STYLE.subHeadingfontStyle
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        firstName: state.auth.firstName,
        lastName: state.auth.lastName,
        profilePic: state.auth.profileImg,
        profile:state.auth.profile
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerHeader);