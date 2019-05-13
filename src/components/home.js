import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import {
    Modal,
    TouchableOpacity, ImageBackground,
    ScrollView, Platform, Text, Dimensions, TextInput, View, Button, StyleSheet, Image, TouchableHighlight, FlatList, ActivityIndicator
} from 'react-native';
import { login, signup, alertBox, profile } from '../action/auth';
import { getCountries } from '../action/lookup';
import LinearGradient from 'react-native-linear-gradient';
import { COLOR, ASSET_STYLE, STYLE } from '../config/theme';
import completedList from './forms/completed-list'
import { headerHelper } from '../util/ui-helper';
import CassaStatusBar from './common/status.bar';

import Card from './common/card-view';
import { getTeams, getForms, getCategories, getContractors, getContractorTeams, getProjects } from '../action/company';

import Paint from './task/brush';

const cardStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 33,
        borderColor: 'transparent',
        borderWidth: 0.3,
        borderRadius: 7
    },
    txtTitle: {
        color: '#FFFFFF',
        ...STYLE.subHeadingfontStyle
    }
});

const cards = [{
    index: 0,
    text: 'Company Forms',
    icon: require('../assets/images/cards/Icon1.png'),
    cover: require('../assets/images/cards/IMG1.png'),
    style: {
        backgroundColor: 'red',
        opacity: 0.85,
        fontWeight: 'bold'
    }
},
{
    index: 1,
    text: 'Client Forms',
    icon: require('../assets/images/cards/Icon1.png'),
    cover: require('../assets/images/cards/IMG1.png'),
    style: {
        backgroundColor: COLOR.PRIMARYDARK,
        opacity: 0.9,
    }
},
{
    index: 2,
    text: 'Completed Records',
    icon: require('../assets/images/cards/Icon2.png'),
    cover: require('../assets/images/cards/IMG2.png'),
    style: {
        backgroundColor: '#53C39D',
        opacity: 0.9
    }
}];

class Home extends Component {

    navigate = undefined;

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        params.title = 'Home';
        return headerHelper(params, (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            navigation.navigate('DrawerToggle');
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../assets/images/home/menu.png')} />
            </View>
        </TouchableHighlight>), null, navigation);
    };

    constructor(props) {
        super(props);
        navigate = this.props.navigation.navigate;

        this.state = {
            loading: false,
            modalVisible: false
        }
    }

    cardClicked(card) {
     
        switch (card.index) {
            case 0:
                //this.setState({ loading: true });
                if (!this.props.team) {
                    this.props.showAlert('', 'Loading your default team');
                    return;
                }
                this.setState({loading:true});

                this.props.fetchForms(this.props.token, this.props.team.id, undefined, () => {
                    //this.setState({ loading: false });
                    if (this.props.forms && this.props.forms.length > 0) {
                    
                        navigate('NewList');
                        
                    } else {
                        this.props.team ?
                            this.props.showAlert('Info', 'You have not yet been assigned to any company forms.')
                            :
                            this.props.showAlert('No teams found', 'You do not belong to any teams. Please contact your Employer and request an invite. If you still have issues please contact our support desk')

                    }
                    this.setState({loading:false})
                });
                break;
            case 1:
                if (!this.props.team) {
                    this.props.showAlert('', 'Loading your default team');
                    return;
                }
                this.setState({loading:true});

                this.props.fetchContractorTeams(this.props.token, this.props.team.id, undefined, () => {
                    //this.setState({ loading: false });
                    console.log("contractor card")
                    if (this.props.contractorTeams && this.props.contractorTeams.length > 0) {
                    
                        navigate('ContractorTeamsList');
                        
                    } else {
                        this.props.contractorTeams ?
                            this.props.showAlert('Info', 'You have not yet been assigned to any client projects.')
                            :
                            this.props.showAlert('No Teams found', 'You do not belong to any teams as contractor. Please contact your Employer and request an invite. If you still have issues please contact our support desk')

                    }
                    this.setState({loading:false})
                });
                break;
            case 2:
                navigate('CompletedList');
                break;
            default:
                break;
        }
        
    }

    renderCard(card) {
        return (
            <Card onPress={this.cardClicked.bind(this, card)} backgroundColor="#FFFFFF"
                elevation={20}
                style={{ height: 104 }}>
                <ImageBackground resizeMode="cover" style={[{
                    flex: 1,
                    borderColor: 'transparent',
                    borderWidth: 0.3,
                    borderRadius: 7
                }]} source={card.cover} borderRadius={7}>
                    <View style={[cardStyles.container, card.style]}>
                        <Image style={{ height: 50, width: 40 }} source={card.icon} />
                        <View style={{
                            paddingLeft: 30,
                            flex: 1,
                            justifyContent: 'center'
                        }}><Text style={cardStyles.txtTitle}>{card.text}</Text></View>
                    </View>
                </ImageBackground>
            </Card>
        )
    }

    toggleDrawer() {
        navigate('DrawerToggle');
    }

    componentWillUpdate(props) {
        if (this.props.isLoggedIn !== props.isLoggedIn || !props.isLoggedIn) {
            this.props
                .navigation
                .dispatch(NavigationActions.reset(
                    {
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Splash' })
                        ]
                    }));
        }
    }

    populateTeams() {

    }
    componentDidMount(){
        // if (!this.props.team) {
        //     this.setState({loading:true})
        // }
        // else{
        //     this.setState({loading:false})
        
        // }
    }

    componentWillMount() {
         
        this.props.fetchTeams(this.props.token, (data) => {
         
            console.log(data)
            this.props.fetchCategories(this.props.token, this.props.team.id, (data) => {
                //console.warn(data,this.props.teamId)
            });
            this.props.getProfile(this.props.token, () => { });
            this.props.fetchProjects(this.props.token, this.props.team.id, () => {
            });
            this.props.fetchContractors(this.props.token, this.props.team.id, () => {
            });
            this.props.fetchContractorTeams(this.props.token, this.props.team.id, undefined, () => {
            });
            this.props.fetchCountries(this.props.token, () => {
            });
           
        });
        
    
    
    }

    render() {

        if (this.state.loading) {
            return (
                <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: 'center', alignItems: 'center' }}>
                    <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                    <ActivityIndicator animating={true}
                        color={COLOR.PRIMARYDARK}
                        size="large" />
                <Text>Loading ...</Text>
                </View>
            )
        }
        
        
        //        console.log(this.props.token)
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>

                <CassaStatusBar barStyle='dark-content' translucent backgroundColor={Platform.OS === 'android' ? "#ffffff" : 'rgba(0,0,0,0)'} />
                <View style={{ flex: 1, backgroundColor: '#ffffff' }}><FlatList data={cards} style={styles.cardList} keyExtractor={(item) => item.text}
                    renderItem={({ item }) => this.renderCard(item)} />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        flexDirection: 'row'
    },
    headerLeft: {
        padding: 10
    },
    container: {
        flex: 1, flexDirection: 'column', alignItems: 'center',
        paddingLeft: 60, paddingRight: 60
    },
    txtInput: {
        marginTop: 20,
        ...STYLE.bodyfontStyle
    },
    txtTitle: {
        color: '#000000',
        ...STYLE.subHeadingfontStyle
    },
    cardList: {
        paddingLeft: '5%',
        paddingRight: '5%'
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        token: state.auth.token,
        team: state.company.team,
        forms: state.company.forms,
        contractorTeams: state.company.contractorTeams,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: (token) => { dispatch(profile(token)) },
        fetchTeams: (token, cb) => { dispatch(getTeams(token, cb)) },
        fetchProjects: (token, teamId, cb) => { dispatch(getProjects(token, teamId, cb)) },
        fetchContractors: (token, cb) => { dispatch(getContractors(token, cb)) },
        fetchCategories: (token, teamId, cb) => { dispatch(getCategories(token, teamId, cb)) },
        fetchForms: (token, teamId, formname, cb) => { dispatch(getForms(token, teamId, formname, cb)) },
        fetchContractorTeams: (token, teamId, teamname, cb) => { dispatch(getContractorTeams(token, teamId, teamname, cb)) },
        fetchCountries: (token) => { dispatch(getCountries(token)) },
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);