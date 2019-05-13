import React, { Component } from 'react';
import Permissions from 'react-native-permissions'
import { StackNavigator, DrawerNavigator, noTransitionConfig, DrawerItems } from 'react-navigation';
import { View, Image, StyleSheet, Text, TouchableHighlight, AsyncStorage, FlatList, Platform, Linking } from 'react-native';
import DrawerHeader from '../components/common/drawer.header';
import { logout, alertBox } from '../action/auth';
import { getCategories, getProjects, defaultTeam } from '../action/company';
import Camera from '../components/task/camera.view';
import Splash from '../components/splash';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Home from '../components/home';
import Profile from '../components/profile';
import Export from '../components/export/export';
import Export1 from '../components/export/export1';

import Qualification from '../components/profile/qualification';
import Competency from '../components/profile/competency';
import { ASSET_STYLE, STYLE } from '../config/theme';
import { WEB_URL } from '../api/constant';

const mapStateToProps = (state, ownProps) => {

    //    console.warn(state.auth.defaultTeam)
    return {
        token: state.auth.token,
        teams: state.company.teams,
        userId: state.auth.id,
        defaultTeam: state.auth.defaultTeam,
        profile: state.auth.profile,
        team: state.company.team,
        //        defaultTeam: state.auth.defaultTeam
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        onLogout: () => { dispatch(logout()) },
        makeDefault: (team) => { dispatch(defaultTeam(team)) },
        fetchProjects: (token, teamId, cb) => { dispatch(getProjects(token, teamId, cb)) },
        fetchCategories: (token, teamId, cb) => { dispatch(getCategories(token, teamId, cb)) }
    }
}

class Logout extends Component {

    constructor(props) {
        super(props);
    }

    requestPermissions() {
        Permissions.request('photo').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            if (response === 'authorized') {
                Permissions.check('photo').then(response1 => {
                    if (response1 === 'authorized') {

                    } else {
                        this.props.onLogout();
                    }
                });
            } else {
                this.props.onLogout();
            }
        })
    }

    componentWillMount() {
        if (Platform.OS === 'android') Permissions.checkMultiple(['camera', 'photo']).then(response => {
            if (response !== 'authorized') {
                this.requestPermissions();
            }
        });
    }

    componentWillReceiveProps(props) {
        if (this.props.isLoggedIn !== props.isLoggedIn && !props.isLoggedIn) {
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

    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                <Image resizeMode="contain" style={{ width: 15, height: 15 }} source={require('../assets/images/home/logout.png')} />
                <TouchableHighlight onPress={this.props.onLogout.bind(this)}><Text style={[styles.menuTxtStyle, { paddingLeft: 15 }]}>Logout</Text></TouchableHighlight>
            </View>
        )
    }
}

class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menuExpanded: false,
            teams: this.props.teams,
            team: this.props.team,
            userId: this.props.userId,
            profile: this.props.profile
        }
    }
    componentWillMount() {
        if (!this.state.team) {
            //          this.setState({
            //                team: this.props.teams.filter(data => data.id == this.props.defaultTeam) ?this.props.teams.filter(data => data.id ==this.props.defaultTeam)[0] : null,
            //        });
            //     console.warn('this is will mount', this.props.teams)
            // this.props.makeDefault(this.props.teams[this.props.profile["default_team"]]);
        }
        //     // this.props.fetchCategories(this.props.token, this.props.teams[0].id, () => {
        //     // });
        //     // this.props.fetchProjects(this.props.token, this.props.teams[0].id, () => {
        //     // });
        // }
        // if(this.props.teams.length===1){
        //     this.props.makeDefault(this.props.teams[0]);
        // }

    }
    componentWillMount() {
        // console.warn(this.props.defaultTeam)
        // const teamDefault = this.props.teams.filter((id) => {
        //     console.warn(this.props.defaultTeam)
        //     return id.id == this.props.defaultTeam
        // })

        // this.setState({
        //     team: teamDefault.length < 1 ? null : teamDefault[0]
        // });
        // if (this.props.teams && this.props.teams.length !== this.props.teams) {
        //     this.setState({
        //         teams: this.props.teams
        //     });
        // }
        // //console.warn("this is team", props.teams)

        // // if ((!this.state.team && props.team) || this.state.team !== props.team) {
        // //     this.setState({
        // //         team: props.teams[0]
        // //     });
        // // }

        // if (!this.state.team) {
        //     var teamDefault = [];
        //     // if (this.props.teams.length == 1) {
        //     //     teamDefault = [this.props.teams[0]]
        //     // }
        //     // else {
        //     teamDefault = this.props.teams.filter((id) => {
        //         //    console.warn(this.props.defaultTeam)
        //         return id.id == this.props.defaultTeam
        //     })
        //     //}
        //     if(teamDefault){
        //     this.setState({
        //         team: teamDefault.length < 1 ? '' : teamDefault[0]
        //     });
        //     // console.warn('this is will mount', this.props.teams)
        //     this.props.makeDefault(teamDefault.length < 1 ? '' : teamDefault[0]);
        //     this.setState({ menuExpanded: false });
        //     //this.toggleDrawer();
        //     this.props.fetchCategories(this.props.token, teamDefault.length < 1 ? '' : teamDefault[0].id, () => {
        //     });
        //     this.props.fetchProjects(this.props.token, teamDefault.length < 1 ? '' : teamDefault[0].id, () => {
        //     });
        //     }
        //     else{
        //         this.setState({
        //             team: this.props.teams[0]
        //         });
        //       //   console.warn('this is will mount', props.teams)
        //         this.props.makeDefault(this.props.teams[0]);
        //         this.setState({ menuExpanded: false });
        //         //this.toggleDrawer();
        //         this.props.fetchCategories(this.props.token,this.props.teams[0], () => {
        //         });
        //         this.props.fetchProjects(this.props.token,this.props.teams[0] , () => {
        //         });
        //     }
        // }
    }

    componentWillReceiveProps(props) {
        // const team = this.props.teams.map(data => data.id == this.props.profile.default_team);

        // team.length > 0 ? 
        //        this.setState({ team: this.props.team[this.props.defaultTeam] })

        //this.props.showAlert("Welcome:202", JSON.stringify(this.state));

        if (props.teams && this.props.teams.length !== props.teams) {
            this.setState({
                teams: props.teams
            });
        }
        //console.warn("this is team", props.teams)

        // if ((!this.state.team && props.team) || this.state.team !== props.team) {
        //     this.setState({
        //         team: props.teams[0]
        //     });
        // }
        

        if (!this.props.team) {
            var teamDefault = [];
            // if (this.props.teams.length == 1) {
            //     teamDefault = [this.props.teams[0]]
            // }
            // else {
            teamDefault = this.props.teams.filter((id) => {
                //    console.warn(this.props.defaultTeam)
                return id.id == this.props.defaultTeam
            })
            //}
            function isArrayEmpty(array) {
                return !Array.isArray(array) || !array.length
              }
              console.warn(teamDefault,isArrayEmpty(teamDefault))

            if(!isArrayEmpty(teamDefault)){
                console.warn(teamDefault)
                console.warn('default',teamDefault.length)
            this.setState({
                team:teamDefault[0]
            });
            // console.warn('this is will mount', this.props.teams)
            this.props.makeDefault(teamDefault[0]);
            this.setState({ menuExpanded: false });
            //this.toggleDrawer();
            this.props.fetchCategories(this.props.token, teamDefault.length < 1 ? '' : teamDefault[0].id, () => {
            });
            this.props.fetchProjects(this.props.token, teamDefault.length < 1 ? '' : teamDefault[0].id, () => {
            });
            }
            else{
                console.warn('no default',props.teams)
                this.setState({
                    team: props.teams[0]
                });
              //   console.warn('this is will mount', props.teams)
                this.props.makeDefault(props.teams[0]);
                this.setState({ menuExpanded: false });
                //this.toggleDrawer();
                this.props.fetchCategories(props.token,props.teams[0], () => {
                });
                this.props.fetchProjects(this.props.token,props.teams[0] , () => {
                });
            }
        }

    }

    toggleTeam() {
        if (this.state.teams && this.state.teams.length === 0) {
            return;
        }
        this.setState({
            menuExpanded: !this.state.menuExpanded
        });
    }

    makeTeamDefault(team) {
        this.props.makeDefault(team);
        this.setState({ menuExpanded: false });
        this.toggleDrawer();
        this.setState({
            team: team
        });

        this.props.fetchCategories(this.props.token, team.id, () => {
        });
        this.props.fetchProjects(this.props.token, team.id, () => {
        });
    }

    toggleDrawer() {
        const { navigate } = this.props.navigation;
        navigate('DrawerToggle');
    }

    renderTeam(team) {
        // alert(team)
        return (
            <TouchableHighlight onPress={() => this.makeTeamDefault(team)}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}><Text style={[styles.subMenuTxtStyle, { flex: 1, paddingLeft: 70 }]}>{(team.name).replace("&amp;", "&")
                }</Text>
                    {(this.state.team && this.state.team.id === team.id) ? <Image style={{ marginRight: 10, width: 15, height: 15 }} source={require('../assets/images/home/done.png')} /> : <View></View>}
                </View>
            </TouchableHighlight>
        );
    }

    renderTeams() {

        return (
            <FlatList data={this.state.teams} keyExtractor={(item) => item.id}
                renderItem={({ item }) => this.renderTeam(item)} />
        )
    }

    onMenuSelect(menu) {

        //this.props.showAlert('State:', this.state);
        this.props.navigation.navigate(menu);
        this.toggleDrawer();
    }

    render() {
        // this.props.teams.map(data => {
        //     console.warn(data.user_id === this.props.userId)
        // })

        const teams=this.state.team?this.renderTeams():<View></View>
        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                    <Image resizeMode="contain" style={{ width: 15, height: 15 }} source={require('../assets/images/home/home.png')} />
                    <TouchableHighlight onPress={this.onMenuSelect.bind(this, 'Home')}><Text style={[styles.menuTxtStyle, { paddingLeft: 15 }]}>Home </Text></TouchableHighlight>
                </View>
                <View style={[{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 },
                this.state.menuExpanded ? { backgroundColor: ASSET_STYLE.containerBg } : { backgroundColor: '#FFFFFF' }
                ]}>
                    <Image resizeMode="contain" style={{ width: 15, height: 15 }} source={require('../assets/images/home/team.png')} />
                    <TouchableHighlight underlayColor={ASSET_STYLE.containerBg} style={{ flex: 1 }} onPress={this.toggleTeam.bind(this)}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.menuTxtStyle, { paddingLeft: 15 }]}>Teams</Text>
                            <View style={{
                                alignSelf: 'stretch', paddingTop: '5%',
                                paddingBottom: '5%', alignItems: 'flex-end', flex: 2, paddingRight: '5%'
                            }}>
                                <View style={styles.teamCount}>
                                    <Text style={styles.teamCountTxt}>{this.state.teams.length} Teams</Text></View>
                            </View>
                            
                        </View></TouchableHighlight>
                </View>
                {this.state.menuExpanded ?teams
                    : <View></View>}

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                    <Image resizeMode="contain" style={{ width: 15, height: 15 }} source={require('../assets/images/home/profile.jpg')} />
                    <TouchableHighlight onPress={this.onMenuSelect.bind(this, 'Profile')}><Text style={[styles.menuTxtStyle, { paddingLeft: 15 }]}>My Profile</Text></TouchableHighlight>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }}>
                    <Image resizeMode="contain" style={{ width: 15, height: 15 }} source={require('../assets/images/home/guide.png')} />
                    <TouchableHighlight onPress={() => { Linking.openURL('https://cassa.zendesk.com/hc/en-us/categories/333756978796-Using-the-CASSA-App') }}><Text style={[styles.menuTxtStyle, { paddingLeft: 15 }]}>User Guide</Text></TouchableHighlight>
                </View>
                <Logout {...this.props} />
            </View>
        )
    }
}

Menu = connect(mapStateToProps, mapDispatchToProps)(Menu);

const DrawerContent = (props) => (
    <View style={{ flex: 1, elevation: 5, zIndex: 100 }}>
        <DrawerHeader {...props} />
        <Menu {...props} />
    </View>
);
// drawer stack
const DrawerStack = DrawerNavigator({
    Drawer: {
        screen: StackNavigator({
            Home: {
                screen: Home
            },
            Camera: {
                screen: Camera
            },
            Profile: {
                screen: Profile
            },
            Export: {
                screen: Export
            },
            Export1: {
                screen: Export1
            },
            Qualification: {
                screen: Qualification
            },
            Competency: {
                screen: Competency
            },
            Teams: {
                screen: Home
            },
            UserGuide: {
                screen: Home
            },
            Splash: {
                screen: Splash
            }
        }, {
                header: 'screen'
            })
    }
}, {
        contentComponent: props => <DrawerContent {...props} />
    });

const styles = StyleSheet.create({
    menuTxtStyle: {
        color: '#083D8B',
        ...STYLE.bodyfontStyle,
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    subMenuTxtStyle: {
        color: '#083D8B',
        ...STYLE.bodyfontStyle,
        padding: 5
    },
    teamCount: {
        backgroundColor: '#083D8B',
        width: Platform.isPad ? 30 * 4 : 20 * 4,
        height: Platform.isPad ? 30 : 20,
        borderRadius: 20 / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    teamCountTxt: {
        color: '#FFFFFF',
        ...STYLE.bodyfontStyle
    },
    teamStyle: {
        color: '#083D8B',
        paddingTop: '5%',
        paddingBottom: '5%',
        flex: 1,
        ...STYLE.bodyfontStyle
    }
});

export default DrawerStack;