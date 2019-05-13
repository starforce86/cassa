import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, Dimensions, TouchableOpacity, ScrollView, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator, FlatList } from 'react-native';
import { validateEmail, alertBox, getContractorItems } from '../../../action/auth';
import { NavigationActions } from 'react-navigation';
import CassaStatusBar from '../../common/status.bar';
import { COLOR, ASSET_STYLE, STYLE } from '../../../config/theme';
import { getFormDetail, getForms } from '../../../action/company';
import { headerHelper } from '../../../util/ui-helper';

class ContractorItems extends Component {

    navigate = undefined;

    renderHeader() {
        console.log("Inside contractorItems");
        const { params } = this.props.navigation.state;
        params.title = 'Contractor Items';
        return (
            <View style={ { flexDirection: 'row', marginTop: 40, paddingBottom: 10, elevation: 0, shadowOpacity: 0, borderBottomColor: '#808080', borderBottomWidth: 0.3 } }>
                <TouchableOpacity underlayColor={ ASSET_STYLE.underlayColor } onPress={ () => {
                    this.props.navigation.goBack( null );
                } }>
                    <View style={ { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' } }><Image style={ { width: 30, height: 30 } } source={ require( '../../../assets/images/forms/left-arrow.png' ) } />
                        <Text style={ [STYLE.subHeadingfontStyle, { color: '#000000' }] }>Back</Text>
                    </View>
                </TouchableOpacity>
                <Text style={ [{ flex: 1 }, { textAlign: 'center', color: '#000000', ...STYLE.headingfontStyle }] }>{ params.title }</Text>
                <View style={ [{ flex: 0.3 }] }></View>
            </View>
        );
    }

    constructor( props ) {
        super( props );
        this.navigate = this.props.navigation.navigate;
        this.state = {
            loading: false,
            contractorItems: []
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
        const { params } = this.props.navigation.state;
        console.log("::Params::", params);
        this.props.getContractorItems(this.props.token, params.projectId).then(data => {
            this.setState({
                contractorItems: data
            });
        });
    }

    goBack() {
        this.props.navigation.pop();
    }

    projectClicked(project) {
        console.log("contractor_items:", project);
        console.log("**",this.props.navigation.state.params);
        navigate('ExportAction', { categoryRegisterId: project.category_id, title: project.name, projectId: this.props.navigation.state.params['projectId'], form: this.props.navigation.state.params['form'], item_id: project.id, path: this.props.navigation.state.params['path'] });
    }

    renderCard(project, index) {
        // console.log("CI-P", project)
        return (
            <TouchableHighlight underlayColor={ASSET_STYLE.underlayColor} style={{ marginTop: 5, backgroundColor: (index % 2 === 0) ? ASSET_STYLE.containerBg : '#FFFFFF' }} elevation={10} onPress={() => this.projectClicked(project)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, paddingLeft: 10, paddingRight: 5 }}>
                    <Text style={[styles.txt, { flex: 1, paddingLeft: 5 }]}>{project.name}</Text>
                    <Image resizeMode="contain" style={{ height: 20, width: 20, flex: 0.1 }} source={require('../../../assets/images/forms/right-arrow.png')} />
                </View>
            </TouchableHighlight>
        )
    }

    searchForm(phrase) {
        
    }

    componentWillReceiveProps(props) {
        
    }

    render() {
//        console.log(this.props.navigation.state.params['form'])

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
            <ScrollView style={styles.container}>
                <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                {this.renderHeader()}
                <View style={styles.containerInner}>
                    <FlatList data={this.state.contractorItems} style={styles.cardList} keyExtractor={(item) => item.key}
                        renderItem={({ item, index }) => this.renderCard(item, index)} />
                </View>
            </ScrollView>
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
        flex:1
    },
    imgContainer: {
        alignItems: 'center'
    },
    cardList: {
        
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
    forgotPwd: {
        alignItems: 'center',
        paddingTop: 30
    },
    errorBox: {
        backgroundColor: '#FF0000'
    }
});


const mapStateToProps = (state, ownProps) => {
    console.log("Map", state)
    return {
        token: state.auth.token,
        team: state.company.team
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        getContractorItems: (token, projectId) => { return getContractorItems(token, projectId)}
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( ContractorItems );