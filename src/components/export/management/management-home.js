import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
    TouchableOpacity, ImageBackground,
    ScrollView, Platform, Text, Dimensions, TextInput, View, Button, StyleSheet, Image, TouchableHighlight, FlatList, ActivityIndicator
} from 'react-native';
import { alertBox, clientProject } from '../../../action/auth';
import { getCountries } from '../../../action/lookup';
import { COLOR, ASSET_STYLE, STYLE } from '../../../config/theme';
import { headerHelper } from '../../../util/ui-helper';
import CassaStatusBar from '../../common/status.bar';
import { typeSelection } from '../../../action/company';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Card from '../../common/card-view';



const cardStyles = StyleSheet.create( {
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
} );

const cards = [{
    index: 0,
    text: 'Management System',
    icon: require( '../../../assets/images/manage/card_icon_1.png' ),
    cover: require( '../../../assets/images/manage/card_bg_1.png' ),
    style: {
        backgroundColor: 'red',
        opacity: 0.9

    }
},
{
    index: 1,
    text: 'Company Projects',
    icon: require( '../../../assets/images/manage/card_icon_2.png' ),
    cover: require( '../../../assets/images/manage/card_bg_2.png' ),
    style: {
        backgroundColor: COLOR.PRIMARYDARK,
        opacity: 0.9
    }
},

{
    index: 2,
    text: 'Client Projects',
    icon: require( '../../../assets/images/cards/Icon2.png' ),
    cover: require( '../../../assets/images/cards/IMG2.png' ),
    style: {
        backgroundColor: '#53C39D',
        opacity: 0.9
    }
}


];

class ManagementHome extends Component {

    navigate = undefined;

    renderHeader() {
        const { params } = this.props.navigation.state;
        params.title = '';
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
            </View>
        );
    }


    constructor( props ) {
        super( props );
        navigate = this.props.navigation.navigate;

        this.state = {
            loading: false
        }
    }

    cardClicked( card ) {
        switch ( card.index ) {
            case 0:
                this.props.typeSelection( 0 );
                navigate( 'SubRegisters', { parentId: 10, title: 'Registers', form: this.props.navigation.state.params['form'], path: this.props.navigation.state.params['path'] } );
                break;
            case 1:
                this.props.typeSelection( 1 );
                //navigate( 'Locations', { form: this.props.navigation.state.params['form'], path: this.props.navigation.state.params['path'] } );
                navigate( 'Projects', { form: this.props.navigation.state.params['form'], path: this.props.navigation.state.params['path'] } );
                break;
            // case 2:
            //     this.props.typeSelection( 1 );
            //     navigate( 'Locations', { form: this.props.navigation.state.params['form'], path: this.props.navigation.state.params['path'] } );
            //     break;    
            default:
                break;
        }
    }

    renderCard( card ) {
        return (
            <Card onPress={ card.text === "Client Projects" ? () => {
                this.props.clientProject( this.props.token )
                this.props.navigation.navigate( 'ClientProject', { form: this.props.navigation.state.params['form'], path: this.props.navigation.state.params['path'] } );
            } : this.cardClicked.bind( this, card ) } backgroundColor="#FFFFFF"
                elevation={ 20 }
                style={ { height: 104 } }>
                <ImageBackground resizeMode="cover" style={ [{
                    flex: 1,
                    borderColor: 'transparent',
                    borderWidth: 0.3,
                    borderRadius: 7
                }] } source={ card.cover } borderRadius={ 7 }>
                    <View style={ [cardStyles.container, card.style] }>
                        <Image style={ { height: 50, width: 40 } } source={ card.icon } />
                        <View style={ {
                            paddingLeft: 30,
                            flex: 1,
                            justifyContent: 'center'
                        } }><Text style={ cardStyles.txtTitle }>{ card.text }</Text></View>
                    </View>

                </ImageBackground>
            </Card>
        )
    }

    toggleDrawer() {
        navigate( 'DrawerToggle' );
    }

    componentWillUpdate( props ) {
        if ( this.props.isLoggedIn !== props.isLoggedIn || !props.isLoggedIn ) {
            this.props
                .navigation
                .dispatch( NavigationActions.reset(
                    {
                        index: 0,
                        actions: [
                            NavigationActions.navigate( { routeName: 'Splash' } )
                        ]
                    } ) );
        }
    }

    populateTeams() {

    }

    componentWillMount() {

    }

    render() {

        if ( this.state.loading ) {
            return (
                <View style={ { flex: 1, backgroundColor: "#FFFFFF", justifyContent: 'center', alignItems: 'center' } }>
                    <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                    <ActivityIndicator animating={ true }
                        color={ COLOR.PRIMARYDARK }
                        size="large" />
                </View>
            )
        }
        console.warn( this.props.clientProject1 )
        return (
            <View style={ { flex: 1, flexDirection: 'column' } }>
                <CassaStatusBar barStyle='dark-content' translucent backgroundColor={ Platform.OS === 'android' ? "#ffffff" : 'rgba(0,0,0,0)' } />

                <View style={ { flex: 1, backgroundColor: '#ffffff' } }>
                    { this.renderHeader() }
                    <KeyboardAwareScrollView>
                        <FlatList data={ cards } style={ styles.cardList } keyExtractor={ ( item ) => item.text }
                            renderItem={ ( { item } ) => this.renderCard( item ) } />
                    </KeyboardAwareScrollView>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create( {
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
} );


const mapStateToProps = ( state, ownProps ) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        token: state.auth.token,
        clientProject1: state.auth.clientProject
    };
}

const mapDispatchToProps = ( dispatch ) => {
    return {
        showAlert: ( title, msg ) => { dispatch( alertBox( title, msg ) ) },
        typeSelection: ( id ) => { dispatch( typeSelection( id ) ) },
        clientProject: ( token ) => { dispatch( clientProject( token ) ) },

    }
}

export default connect( mapStateToProps, mapDispatchToProps )( ManagementHome );