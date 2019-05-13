import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, Dimensions, ScrollView, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator, FlatList } from 'react-native';
import { validateEmail, alertBox } from '../../action/auth';
import { NavigationActions } from 'react-navigation';
import CassaStatusBar from '../common/status.bar';
import { COLOR, ASSET_STYLE, STYLE } from '../../config/theme';
import { getFormDetail, getForms } from '../../action/company';
import { headerHelper } from '../../util/ui-helper';

class NewFormList extends Component {

    navigate = undefined;

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        return headerHelper(params, (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            navigation.goBack(null);
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../../assets/images/forms/left-arrow.png')} />
                <Text style={[STYLE.subHeadingfontStyle, { color: '#000000' }]}>Back</Text>
            </View>
        </TouchableHighlight>), null, navigation);
    };

    constructor(props) {
        super(props);
        this.navigate = this.props.navigation.navigate;
        this.state = {
            forms: this.props.forms,
            loading: false
        };
    }

    checkErrors() {
        this.setState({ loading: true });
        return false;
    }

    userLogin() {
        if (!this.checkErrors()) {

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

    }

    componentWillMount() {
        this.setState({ loading: false });
        // this.setState({forms: this.props.forms});
        // console.log("mount",this.props)
        this.props.navigation.setParams({ title: this.props.navigation.name })
    }

    goBack() {
        this.props.navigation.pop();
    }

    cardClicked(card) {
        this.setState({ loading: true });
        this.props.fetchFormDetail(this.props.token, card.id, () => {
            // console.warn(card.name,card.id)
            //this.setState({ loading: false });
            this.setState({ loading:false });
            navigate('CreateForm', { title: card.name, prevTitle: this.props.team.name });
        });

    }

    renderCard(card, index) {
        return (
            <TouchableHighlight underlayColor={ASSET_STYLE.underlayColor} style={{ marginTop: 5, backgroundColor: (index % 2 === 0) ? ASSET_STYLE.containerBg : '#FFFFFF' }} elevation={10} onPress={() =>{
                
            this.cardClicked(card)
            
            //alert('Hello')
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, paddingLeft: 10, paddingRight: 5 }}>
                    <Text style={[styles.txt, { flex: 1, paddingLeft: 5 }]}>{card.name}</Text>
                    <Image resizeMode="contain" style={{ height: 20, width: 20, flex: 0.1 }} source={require('../../assets/images/forms/right-arrow.png')} />
                </View>
            </TouchableHighlight>
        )
    }

    searchForm(phrase) {
        this.props.fetchForms(this.props.token, this.props.team.id, phrase, () => {
        });
    }

    componentWillReceiveProps(props) {
        if (props && props.forms && props.length !== this.props.forms.length) this.setState({
            forms: props.forms
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true}
                        color={COLOR.PRIMARYDARK}
                        size="large" />
                </View>
            )
        }
        return (
            <View
                style={styles.container}
            >
                <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                <View style={styles.containerInner}>
                    <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <View style={styles.searchContainer}>
                            <Image style={{ height: 20, width: 20 }} source={require('../../assets/images/forms/search.png')} />
                            <TextInput underlineColorAndroid='transparent' style={[styles.txt, { flex: 1, marginLeft: 5 }]} placeholder="Search" placeholderTextColor={COLOR.PRIMARYDARK} onChangeText={this.searchForm.bind(this)} />
                        </View>
                    </View>
                    <FlatList data={this.state.forms} style={styles.cardList} keyExtractor={(item) => item.key}
                        renderItem={({ item, index }) => this.renderCard(item, index)} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1, flexDirection: 'column'
    },
    header: {
        color: '#000000',
        textAlign: 'center',
        width: Dimensions.get('window').width - 110
    },
    headerLeft: {
    },
    containerInner: {
        alignSelf: 'stretch',
        flex: 1
    },
    imgContainer: {
        alignItems: 'center'
    },
    cardList: {
        marginTop: 10
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
        color: '#000000',
        ...STYLE.bodyfontStyle
    },
    searchContainer: {
        marginTop: 10,
        alignSelf: 'stretch',
        height: 40,
        paddingLeft: 10,
        backgroundColor: ASSET_STYLE.containerBg,
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
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
        token: state.auth.token,
        forms: state.company.forms,
        team: state.company.team,
        projects: state.company.projects
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        validateEmail: (email) => { return validateEmail(email); },
        fetchForms: (token, teamId, formname, cb) => { dispatch(getForms(token, teamId, formname, cb)) },
        fetchFormDetail: (token, formId, cb) => { dispatch(getFormDetail(token, formId, cb)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewFormList);