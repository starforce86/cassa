import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Platform, Text, TextInput, View, TouchableHighlight, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-carousel-view';
import { NavigationActions } from 'react-navigation';
import { headerHelper } from '../util/ui-helper';
import { COLOR, ASSET_STYLE, STYLE } from '../config/theme';
import CassaStatusBar from './common/status.bar.js';

class Splash extends Component {

    navigate = undefined;

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        navigate = this.props.navigation.navigate;
    }

    onSignInClick() {
        navigate('Login');
    }
    onRegisterClick() {
        navigate('Register');
    }

    componentWillMount() {
    }

    render() {
        if (this.props.isLoggedIn) {
            this.props
                .navigation
                .dispatch(NavigationActions.reset(
                    {
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Home' })
                        ]
                    }));
        }
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column'
            }}>
                <CassaStatusBar barStyle='dark-content' translucent backgroundColor="rgba(0,0,0,0)" />
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    paddingLeft: 5,
                    paddingRight: 5,
                }}>
                    <View style={styles.container}>
                        <Carousel
                            height={'100%'}
                            loop={true}
                            delay={2000}
                            animate={true}
                            indicatorAtBottom={true}
                            indicatorSize={20}
                            indicatorColor={COLOR.PRIMARYDARK}
                            style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.card}>
                                <View style={styles.circleShapeView}>
                                    <Image style={styles.imageStyle} source={require('../assets/images/splash/splash1.png')} /></View>
                                <Text style={styles.txtHeading}>Patented System</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}><Text style={styles.txtDesc}>
                                    In the future, this is how businesses will simplify reporting and streamline operations.
                    </Text></View>
                            </View>
                            <View style={styles.card}>
                                <Image style={styles.imageStyle} source={require('../assets/images/splash/splash2.png')} />
                                <Text style={styles.txtHeading}>Say goodbye to paper</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}><Text style={styles.txtDesc}>
                                    Discover how our app can streamline your daily tasks,
                            and eliminate lengthy paper based processes.
                    </Text></View>
                            </View>
                        </Carousel>
                    </View>
                    <View style={styles.bottomPanel}>
                        <View style={styles.btnHolder}><TouchableHighlight style={styles.signIn} onPress={this.onSignInClick}>
                            <Text style={styles.btnTxt}>Sign In</Text>
                        </TouchableHighlight>
                        </View><View style={styles.btnHolder}>
                            <TouchableHighlight style={styles.register} onPress={this.onRegisterClick}>
                                <Text style={styles.btnTxt}>Register</Text>
                            </TouchableHighlight></View>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLeft: {
        padding: 10
    },
    bottomPanel: {
        flex: 0.09,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    circleShapeView: {
        width: 250,
        height: 250,
        borderRadius: 250 / 2,
        backgroundColor: ASSET_STYLE.circleBackGround,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnHolder: {
        flex: 1
    },
    imageStyle: {
        width: 250,
        height: 250
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        ...Platform.select({
            ios: {
                marginTop: '17%'
            }
        })
    },
    txtDesc: {
        textAlign: 'center',
        color: '#000000',
        ...STYLE.parafontStyle,
        ...Platform.select({
            ios: {
                paddingLeft: 10,
                paddingRight: 10
            }
        })
    },
    txtHeading: {
        ...STYLE.headingfontStyle,
        color: COLOR.PRIMARYDARK,
        marginTop: '5%',
        fontFamily: 'Raleway-Bold'
    },
    signIn: {
        backgroundColor: 'rgb(29, 31, 32)',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    register: {
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginLeft: 5
    },
    btnTxt: { color: '#ffffff', ...STYLE.bodyfontStyle }
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);