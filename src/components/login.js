import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, BackHandler, ScrollView, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { login, validateEmail, alertBox} from '../action/auth';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { COLOR, ASSET_STYLE, STYLE } from '../config/theme';
import { headerHelper } from '../util/ui-helper';
import CassaStatusBar from './common/status.bar';

import RNFetchBlob from 'react-native-fetch-blob'

class Login extends Component {

    navigate = undefined;

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        params.title = 'Login';
        return headerHelper(params, (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            StatusBar.setTranslucent(true);
            StatusBar.setBarStyle('dark-content', true);
            navigation.goBack(null);
    }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../assets/images/forms/left-arrow.png')} />
        </View>
    </TouchableHighlight>), null, navigation);
    };

    state = {
        username: '',
        password: '',
        loading: false
    };

    constructor(props) {
        super(props);
        this.navigate = this.props.navigation.navigate;
    }

    checkErrors() {
        if (this.state.username === '') {
            this.props.showAlert('All fields are required', 'Please enter value in all the fields');
            return true;
        }

        if (!this.props.validateEmail(this.state.username.trim())) {
            this.props.showAlert('Invalid Email', 'Please enter email in the correct format');
            return true;
        }

        if (this.state.password === '') {
            this.props.showAlert('All fields are required', 'Please enter value in all the fields');
            return true;
        }
        this.setState({ loading: true });
        return false;
    }

    userLogin() {
        // this.props.showAlert('User:', this.state.username + '/' + this.state.password);
        if (!this.checkErrors()) {
            this.props.onLogin(this.state.username, this.state.password, () => {
                this.setState({loading: false});
            });
        }
    }

    handle(key, value) {
        this.setState({
            [key]: value
        });
    }

    componentDidUpdate() {
        
    }

    componentWillReceiveProps(props) {
        if (this.props.isLoggedIn !== props.isLoggedIn || props.isLoggedIn) {
            this.props
               .navigation
               .dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Home'})
                    ]
                  }));
        }
    }

    navigateToRoute(route) {
        this.navigate(route);
    }

    goBack() {
        this.props.navigation.pop();
    }

    render() {
        return (
            <LinearGradient
                colors={[COLOR.PRIMARYDARK, COLOR.PRIMARY]}
                style={styles.container}
                >
                <CassaStatusBar barStyle='light-content' translucent  backgroundColor="rgba(0,0,0,0)" />
                <View style={styles.containerInner}>
                    <View style={styles.imgContainer}><Image source={require('../assets/images/login/spinner.png')} style={styles.logo} /></View>
                    <TextInput underlineColorAndroid="#ffffff" placeholder="Email Address"
                        onChangeText={(text) => this.handle('username', text)}
                        placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TextInput underlineColorAndroid="#ffffff" placeholder="Password"
                        onChangeText={(text) => this.handle('password', text)}
                        secureTextEntry={true} placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={this.userLogin.bind(this)}>{this.state.loading ? (<ActivityIndicator />) : (<Text style={styles.txt}>Sign In</Text>)}</TouchableHighlight>
                    <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.forgotPwd} onPress={this.navigateToRoute.bind(this, 'Forgot')}>
                        <Text style={styles.txt}>Forgot your password ?</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.forgotPwd} onPress={this.navigateToRoute.bind(this, 'Register')}>
                        <View style={styles.createAcc}>
                        <Text style={styles.txt}>Create an account</Text>
                        </View>
                    </TouchableHighlight>
                   
                </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        paddingLeft: '10%', paddingRight: '10%'
    },
    containerInner: {
        alignSelf: 'stretch'
    },
    imgContainer: {
        alignItems: 'center'
    },
    logo: {
        width: 150,
        height: 150
    },
    txtInput: {
        marginTop: 30,
        color: '#FFFFFF',
        ...STYLE.bodyfontStyle
    },
    loginBtn: {
        marginTop: 30,
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    txt: {
        color: '#FFFFFF',
        ...STYLE.bodyfontStyle
    },
    forgotPwd: {
        alignItems: 'center',
        marginTop: 30
    },
    errorBox: {
        backgroundColor: '#FF0000'
    },
    headerLeft: {
        padding: 10
    },
    createAcc: {
        padding: 10,
        backgroundColor: 'transparent',
        borderColor: '#ffffff',
        borderWidth: 0.3,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    }
});


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        onLogin: (username, password, callback) => { dispatch(login(username, password, callback)); },
        validateEmail: (email) => { return validateEmail(email); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);



// { Platform.OS === 'ios' ? 
// <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.forgotPwd} onPress={this.goBack.bind(this)}>
// <Text style={styles.txt}>Go Back</Text>
// </TouchableHighlight> : <View></View>
// }