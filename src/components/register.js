import React, { Component } from 'react';
import Login from './login';
import { connect } from 'react-redux';
import {
    ScrollView, BackHandler, Text, TextInput, View, Button, Alert, Dimensions,
    StyleSheet, Image, TouchableHighlight, ActivityIndicator, Platform,Linking,
} from 'react-native';
import { login, signup, validateEmail, alertBox } from '../action/auth';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import CheckBox from 'react-native-check-box';
import { headerHelper } from '../util/ui-helper';
import { COLOR, ASSET_STYLE, STYLE } from '../config/theme';
import CassaStatusBar from './common/status.bar';

class Register extends Component {

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        params.title = 'Register';
        return headerHelper(params, (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            StatusBar.setTranslucent(true);
            StatusBar.setBarStyle('dark-content', true);
            navigation.goBack(null);
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../assets/images/forms/left-arrow.png')} />
            </View>
        </TouchableHighlight>), null, navigation);
    };

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            repeat: '',
            loading: false,
            terms: false
        }
    }

    showTermAndConditions() {
        Alert.alert(
            'Terms & Conditions',
            '',
            [
                { text: 'OK', onPress: () => this.setState({ terms: true }) },
                { text: 'CANCEL', onPress: () => this.setState({ terms: false }) }
            ],
            { cancelable: false }
        );
    }

    checkErrors() {
        if (this.state.name === '') {
            this.props.showAlert('All fields are required', 'Please enter value in all the fields');
            return true;
        }
        if (this.state.email === '') {
            this.props.showAlert('All fields are required', 'Please enter value in all the fields');
            return true;
        }

        if (!this.props.validateEmail(this.state.email)) {
            this.props.showAlert('Invalid Email', 'Please enter email in the correct format');
            return true;
        }

        if (this.state.password === '') {
            this.props.showAlert('All fields are required', 'Please enter value in all the fields');
            return true;
        }

        if (this.state.repeat === '') {
            this.props.showAlert('All fields are required', 'Please enter value in all the fields');
            return true;
        }

        if (this.state.password !== '' && this.state.repeat !== '' && this.state.password !== this.state.repeat) {
            this.props.showAlert('Password Error', 'Password and Confirm Password should match!');
            return true;
        }

        if (!this.state.terms) {
            this.props.showAlert('All fields are required', 'Please select Terms & Conditions checkbox');
            return true;
        }

        this.setState({ loading: true });
        return false;
    }

    userRegister() {
        if (!this.checkErrors()) {
            var body = Object.assign({}, {
                'email': this.state.email,
                'password': this.state.password,
                'first_name': this.state.name
            });
            this.props.onSignUp(body, () => {
                this.setState({ loading: false });
            });
            this.setState({ loading: true });
        }
    }

    handle(key, value) {
        this.setState({
            [key]: value
        });
    }

    handleCheck() {
        if (this.state.terms) {
            this.setState({ terms: false });
        } else {
            this.setState({ terms: true });
        }
    }

    goBack() {
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

    componentWillReceiveProps(props) {
        if (this.props.isSignedUp !== props.isSignedUp || props.isSignedUp) {
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
        } else if (this.props.isLoggedIn !== props.isLoggedIn || props.isLoggedIn) {
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
    }

    render() {
        return (
            <LinearGradient
                colors={[COLOR.PRIMARYDARK, COLOR.PRIMARY]}
                style={styles.container}
            >
                <CassaStatusBar barStyle='light-content' translucent backgroundColor="rgba(0,0,0,0)" />
                <ScrollView style={styles.containerInner} showsVerticalScrollIndicator={false}>
                    <View style={styles.imgContainer}><Image source={require('../assets/images/login/spinner.png')} style={styles.logo} /></View>
                    <TextInput underlineColorAndroid="transparent" onChangeText={(text) => this.handle('name', text)} textColor="#FFFFFF" placeholder="First Name" placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TextInput underlineColorAndroid="transparent" onChangeText={(text) => this.handle('email', text)} textColor="#FFFFFF" placeholder="Email Address" placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TextInput underlineColorAndroid="transparent" secureTextEntry={true} onChangeText={(text) => this.handle('password', text)} textColor="#FFFFFF" placeholder="Password" placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <TextInput underlineColorAndroid="transparent" secureTextEntry={true} onChangeText={(text) => this.handle('repeat', text)} textColor="#FFFFFF" placeholder="Confirm Password" placeholderTextColor="#FFFFFF" style={styles.txtInput} />
                    <View style={{ paddingTop: 30, paddingLeft: 30 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox isChecked={this.state.terms} onClick={this.handleCheck.bind(this)}
                                checkedImage={<Image style={{ height: 15, width: 15 }} source={require('../assets/images/components/checked.jpg')} />}
                                unCheckedImage={<Image style={{ height: 15, width: 15 }} source={require('../assets/images/components/unchecked.jpg')} />} />
                            <Text style={[styles.txt, { marginLeft: 10 }]}>I have read and agree to the</Text>
                        </View>
                        <View style={styles.termsAndConditions}>
                            <TouchableHighlight onPress={()=> { Linking.openURL('http://cassa.io/terms-conditions/')}}><Text style={[styles.txt, styles.decoration]}>Terms & Conditions</Text></TouchableHighlight>
                            <Text style={styles.txt}> and </Text>
                            <TouchableHighlight onPress={()=> { Linking.openURL('https://cassa.io/privacy-policy/')}}>
                                <Text style={[styles.txt, styles.decoration]}>Privacy Policy</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <TouchableHighlight underlayColor={COLOR.PRIMARY} onPress={this.userRegister.bind(this)} style={styles.loginBtn}>{this.state.loading ? (<ActivityIndicator />) : (<Text style={styles.txt}>Register</Text>)}</TouchableHighlight>
                    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, styles.goBack]}>
                        <Text style={styles.txt}>Already a member? </Text>
                        <TouchableHighlight underlayColor={COLOR.PRIMARY} onPress={this.goBack.bind(this)}>
                            <Text style={[styles.txt, styles.decoration]}>Login now</Text>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
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
        alignItems: 'center',
        marginTop: 50
    },
    goBack: {
        alignItems: 'center',
        paddingTop: 30,
        marginBottom: 30
    },
    logo: {
        width: 150,
        height: 150
    },
    txtInput: {
        marginTop: 30,
        color: '#FFFFFF',
        borderBottomWidth:0.6,
        borderBottomColor :'#fff',
        ...STYLE.bodyfontStyle
    },
    loginBtn: {
        marginTop: 30,
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    headerLeft: {
        padding: 10
    },
    txt: {
        color: '#FFFFFF',
        ...STYLE.bodyfontStyle
    },
    termsAndConditions: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    errorBox: {
        backgroundColor: '#FF0000'
    },
    decoration: {
        textDecorationLine: 'underline',
        color: COLOR.PRIMARYDARK
    }
});


const mapStateToProps = (state, ownProps) => {
    return {
        isSignedUp: state.auth.isSignedup,
        isLoggedIn: state.auth.isLoggedIn
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        onSignUp: (body, callback) => { dispatch(signup(body, callback)); },
        validateEmail: (email) => { return validateEmail(email) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);