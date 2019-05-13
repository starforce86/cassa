import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Platform, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { forgot, validateEmail, alertBox, passwordupdate } from '../action/auth';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { COLOR, ASSET_STYLE, STYLE } from '../config/theme';
import { headerHelper } from '../util/ui-helper';
import CassaStatusBar from './common/status.bar';

class ResetPwd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newPassword: '',
            confirmPassword: '',
            loading: false
        };
    }

    handle(key, value) {
        this.setState({
            [key]: value
        });
    }

    checkErrors() {
        if (this.state.password === '') {
            this.props.showAlert('Errors', 'Password Required !');
            return true;
        }

        if (this.state.newPassword === '') {
            this.props.showAlert('Errors', 'New Password Required !');
            return true;
        }

        if (this.state.confirmPassword === '') {
            this.props.showAlert('Errors', 'Confirm New Password Required !');
            return true;
        }

        if (this.state.newPassword !== '' && this.state.confirmPassword !== '' && this.state.newPassword !== this.state.confirmPassword) {
            this.props.showAlert('Errors', 'Password doesn`t match !');
            return true;
        }

        this.setState({ loading: true });
        return false;
    }

    confirmPassword() {
        if (!this.checkErrors()) {
            this.props.onUpdatePassword(this.state.password, this.state.newPassword, () => {
                this.props
                .navigation
                .dispatch(NavigationActions.reset(
                    {
                        index: 1,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Splash' }),
                            NavigationActions.navigate({ routeName: 'Login' })
                        ]
                    }));
            });
        }
    }

    render() {
        return (
            <LinearGradient
                colors={[COLOR.PRIMARYDARK, COLOR.PRIMARY]}
                style={styles.container}
            >
                <View style={styles.containerInner}>
                    <View style={styles.imgContainer}><Image source={require('../assets/images/login/spinner.png')} style={styles.logo} /></View>
                    <TextInput placeholder="Enter Password"
                        onChangeText={(text) => this.handle('password', text)}
                        placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TextInput placeholder="New Password"
                        onChangeText={(text) => this.handle('newPassword', text)}
                        placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TextInput placeholder="Confirm Password"
                        onChangeText={(text) => this.handle('confirmPassword', text)}
                        placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={this.confirmPassword.bind(this)}>{this.state.loading ? (<ActivityIndicator />) : (<Text style={styles.txt}>Update Password</Text>)}</TouchableHighlight>
                </View>
            </LinearGradient>
        )
    }
}

class ForgotPassword extends Component {

    navigate = undefined;
    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        params.title = 'Forgot Password';
        return headerHelper(params, (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            navigation.goBack(null);
    }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../assets/images/forms/left-arrow.png')} />
        </View>
    </TouchableHighlight>), null, navigation);
    };

    constructor(props) {
        super(props);
        this.navigate = this.props.navigation.navigate;
        this.state = {
            username: '',
            loading: false
        };
    }

    checkErrors() {

        if(this.state.username === '') {
            this.props.showAlert('Email field is required', 'Please enter the email address');
            return true;
        }
        if (!this.props.validateEmail(this.state.username)) {
            this.props.showAlert('Invalid Email', 'Please enter email in the correct format');
            return true;
        }

        this.setState({ loading: true });
        return false;
    }

    forgotPwd() {
        if (!this.checkErrors()) {
            this.props.onForgot(this.state.username, () => {
                this.setState({ loading: false });
                this.navigateToLogin();
            });
        }
    }

    handle(key, value) {
        this.setState({
            [key]: value
        });
    }

    componentWillReceiveProps(props) {
        if (this.props.isLoggedIn !== props.isLoggedIn || props.isLoggedIn) {
            this.props
                .navigation
                .dispatch(NavigationActions.reset(
                    {
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Home' })
                        ]
                    }));
        } else if (this.props.isForgotPwd !== props.isForgotPwd || props.isForgotPwd) {
            this.props
                .navigation
                .dispatch(NavigationActions.reset(
                    {
                        index: 1,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Splash' }),
                            NavigationActions.navigate({ routeName: 'Login' })
                        ]
                    }));
        }
    }

    componentWillMount() {
        
    }

    navigateToLogin() {
        this.props.navigation.pop();
    }

    navigateToRegister() {
        this.navigate('Register');
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
                    <Text style={styles.txt}>
                     Enter your email address and a link to reset your password will be emailed to you
                    </Text>
                    <TextInput placeholder="Email Address" underlineColorAndroid="#ffffff"
                        onChangeText={(text) => this.handle('username', text)}
                        placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={this.forgotPwd.bind(this)}>{this.state.loading ? (<ActivityIndicator />) : (<Text style={styles.txt}>Click Here</Text>)}</TouchableHighlight>
                    <View style={styles.forgotPwd}>
                        <Text style={styles.txt}>Do not have an account ?</Text>
                    </View>
                    <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.forgotPwd} onPress={this.navigateToRegister.bind(this)}>
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
    headerLeft: {
        padding: 10
    },
    containerInner: {
        alignSelf: 'stretch'
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
        paddingTop: 30
    },
    errorBox: {
        backgroundColor: '#FF0000'
    }
});


const mapStateToProps = (state, ownProps) => {
    return {
        isForgotPwd: state.auth.isForgotPwd
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        onForgot: (username, callback) => { dispatch(forgot(username, callback)); },
        onUpdatePassword: (password, newpassword, callback) => { dispatch(passwordupdate(password, newpassword, callback))},
        validateEmail: (email) => { return validateEmail(email); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

/*
{ Platform.OS === 'ios' ? 
<TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.forgotPwd} onPress={this.navigateToLogin.bind(this)}>
<Text style={styles.txt}>Go Back</Text>
</TouchableHighlight> : <View></View>
}

*/