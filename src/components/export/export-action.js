import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, Dimensions, TouchableOpacity, ScrollView, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator, FlatList } from 'react-native';
import { validateEmail, alertBox } from '../../action/auth';
import { NavigationActions } from 'react-navigation';
import CassaStatusBar from '../common/status.bar';
import { COLOR, ASSET_STYLE, STYLE } from '../../config/theme';
import { headerHelper } from '../../util/ui-helper';
import RNFS from 'react-native-fs'
import moment from 'moment';
import RNFetchBlob from 'react-native-fetch-blob'
import { WEB_URL } from '../../api/constant';
import { defaultTeam } from '../../action/company';

class ExportAction extends Component {

    navigate = undefined;

    constructor( props ) {
        super( props );
        this.navigate = this.props.navigation.navigate;
        this.state = {
            loading: false,
            path: this.props.navigation.state.params['path'],
            formData: this.props.navigation.state.params['form'],
            projectId: this.props.navigation.state.params['projectId'],
            formDataId: this.props.navigation.state.params['item_id'],
            categoryRegisterId: this.props.navigation.state.params['categoryRegisterId'],

        };
    }

    uploadApi( formdata ) {
        let payload = {
            method: 'POST',
            body: formdata
        }
        return fetch( `${ WEB_URL }/api/user/imageupload`, payload );
    }

    uploadAction( formdata ) {

        let payload = {
            method: 'POST',
            body: formdata,
            headers: {
                'Accept': 'application/json'
            }
        }
        if ( Platform.OS !== 'android' ) {
            payload.headers = {
                ...payload.headers,
                'Content-Type': 'multipart/form-data'
            }
        }
        return fetch( `
        ${WEB_URL }/api/action/upload-files-for-register-items`, payload );
    }

    uploadForm() {

        if ( this.state.path ) {

            this.setState( { 'loading': true } );
            let array = this.state.path.split( '/' );
            let fileName = array[array.length - 1];
            fileName = fileName.replace( new RegExp( '%20', 'g' ), '' );
            //console.warn(this.state.path, fileName)
            // RNFetchBlob.config({
            //     fileCache: true,
            //     appendExt: 'pdf'
            // })
            //     .fetch('GET', this.state.path, {
            //     })
            //     .then((res) => {
            //                  console.log(res.info())
            //         Platform.OS === 'android' ? console.log('file://' + res.path()) : '' + console.log(res.path())

            const filePath = Platform.OS === 'android' ? 'file:/' + this.state.path : '' + this.state.path;
            //   console.log(filePath)
            RNFetchBlob.fetch( 'POST', `${ WEB_URL }/api/action/upload-files-for-register-items`, {
                'Content-Type': 'multipart/form-data',
            }, [
                    { name: 'item_file', filename: fileName.toString(), type: 'application/pdf', data: RNFetchBlob.wrap( filePath ) },
                    { name: 'company_id', data: this.props.team.id.toString() },
                    { name: 'item_id', data: this.state.formDataId.toString() },
                    { name: 'project_id', data: this.state.projectId.toString() },
                    { name: 'user_id', data: this.props.userId.toString() }

                ] ).then( ( resp ) => {
                    // console.log(resp.info())
                    this.state.formData.form.map( ( field, i ) => {

                        if ( field.action ) {
                            console.log("Field:",field)
                            const cat = this.props.categories.filter( data1 => data1.title === field.action.category );
                            cat.map( async ( data ) => {
                                console.warn( "category_register_id", this.state.categoryRegisterId, 
+                                   "form_data_id", this.state.formDataId,
                                    "action_categories_id", cat[0].id, "details_of_issues", field.action.detail,
                                    "action_to_be_taken", field.action.actionToBeTaken,
                                    "responsible_persons", field.action.person,
                                    "closed_out_date", moment( field.action.dateText ).format( 'MM/DD/YYYY' ),
                                    "user_id", this.props.userId,
                                    // "company_id", this.props.team.id,
                                    "company_id", field.action.teamContractor,
                                    "project_id", this.state.projectId

                                )
                                var Actiondata = new FormData();
                                console.log(field.action.teamContractor);
                                Actiondata.append( "category_register_id", this.state.categoryRegisterId );
                                Actiondata.append( "form_data_id", this.state.formDataId );
                                Actiondata.append( "action_categories_id", cat[0].id );
                                Actiondata.append( "details_of_issues", field.action.detail );
                                Actiondata.append( "action_to_be_taken", field.action.actionToBeTaken );
                                Actiondata.append( "responsible_persons", field.action.person );
                                Actiondata.append( "closed_out_date", moment( field.action.dateText ).format( 'MM/DD/YYYY' ) );
                                Actiondata.append( "user_id", this.props.userId );
                                // Actiondata.append( "company_id", this.props.team.id );
                                Actiondata.append( "company_id", field.action.teamContractor );
                                Actiondata.append( "project_id", this.state.projectId );

                                const b = await fetch( `${ WEB_URL }/api/action/formdata-action-post-add`, {
                                    method: 'POST',
                                    body: Actiondata
                                } );
                                console.warn( b )

                            } )
                        }
                    } )

                    this.setState( { 'loading': false } );
                    this.props.showAlert( 'Success', 'Form Uploaded Successfully !' );
                    this.props
                        .navigation
                        // .navigate('Drawer')
                        .dispatch( NavigationActions.reset(
                            {
                                index: 0,
                                key: null,
                                actions: [
                                    NavigationActions.navigate( { routeName: 'Home' } )
                                ]
                            } )
                        );

                } )

        }

    }

    //      RNFS.downloadFile({
    //          fromUrl: this.state.path,
    //          toFile: `${Platform.OS === 'android' ? RNFS.ExternalStorageDirectoryPath : RNFS.DocumentDirectoryPath}/${fileName}`,
    //        }).promise.then((r) => {

    //     const Filedata = new FormData();
    //     Filedata.append('item_id', this.state.formDataId);
    //     Filedata.append('project_id', this.state.projectId);
    //     Filedata.append('company_id', this.props.team.id);
    //     Filedata.append('user_id', this.props.userId);
    //     Filedata.append('item_file', {type: 'application/pdf', name: fileName, uri: 
    //          (Platform.OS === 'android' ? ('file://' + `${RNFS.ExternalStorageDirectoryPath}/${fileName}`) :
    //         `${RNFS.DocumentDirectoryPath}/${fileName}`)
    //    });

    //  //   this.setState({'loading': true});
    //      this.uploadApi(Filedata).then(data => data.json()).then(data => {

    //     })

    goBack() {
        this.props.navigation.pop();
    }

    renderHeader() {
        const { params } = this.props.navigation.state;
        return (
            <View style={ { flexDirection: 'row', marginTop: 40, paddingBottom: 10, elevation: 0, shadowOpacity: 0, borderBottomColor: '#808080', borderBottomWidth: 0.3 } }>
                <TouchableOpacity underlayColor={ ASSET_STYLE.underlayColor } onPress={ () => {
                    this.props.navigation.goBack( null );
                } }>
                    <View style={ { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' } }><Image style={ { width: 30, height: 30 } } source={ require( '../../assets/images/forms/left-arrow.png' ) } />
                        <Text style={ [STYLE.subHeadingfontStyle, { color: '#000000' }] }>Back</Text>
                    </View>
                </TouchableOpacity>
                <Text style={ [{ flex: 1 }, { textAlign: 'center', color: '#000000', ...STYLE.headingfontStyle }] }>{ params.title }</Text>
                <View style={ [{ flex: 0.3 }] }></View>
            </View>
        );
    }

    submitClicked() {
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={ styles.container }>
                    <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                    { this.renderHeader() }
                    <View style={ { flex: 1, justifyContent: 'center', 'alignItems': 'center' } }>
                        <ActivityIndicator animating={ true }
                            color={ COLOR.PRIMARYDARK }
                            size="large" />
                    </View>
                </View>
            )
        }
        //        console.log(this.state.path,{'item_id':this.state.formDataId,'project_id': this.state.projectId,
        //'company_id': this.props.team.id,'user_id':this.props.userId})

        //        console.warn(this.props.team.id.toString(), this.state.formDataId.toString(), this.state.projectId.toString(), this.props.userId.toString())

        return (
            <View style={ styles.container }>
                <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                { this.renderHeader() }
                <View style={ styles.containerInner }>
                    <View style={ {
                        height: 50, backgroundColor: ASSET_STYLE.containerBg,
                        padding: 5, justifyContent: 'center', alignItems: 'center'
                    } }>
                        <Text style={ [styles.txt, { color: '#000000' }] }>Click on the submit button to upload the form.</Text>
                    </View>
                    <TouchableHighlight style={ [styles.loginBtn] } onPress={ this.uploadForm.bind( this ) }>
                        <View style={ { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' } }>
                            <Image style={ { height: 20, width: 20, justifyContent: 'center' } } source={ require( '../../assets/images/forms/export_white.png' ) } />
                            <Text style={ [styles.txt, { fontSize: 15, marginLeft: 5 }] }>Submit</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create( {
    container: {
        backgroundColor: '#ffffff',
        flex: 1, flexDirection: 'column'
    },
    containerInner: {
        alignSelf: 'stretch'
    },
    loginBtn: {
        marginTop: 10,
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5
    },
    txt: {
        color: '#FFFFFF',
        ...STYLE.bodyfontStyle
    }
} );

const mapStateToProps = ( state, ownProps ) => {
    return {
        userId: state.auth.profile ? state.auth.profile.id : state.auth.id,
        team: state.company.team,
        categories: state.company.catagories,
    };
}

const mapDispatchToProps = ( dispatch ) => {
    return {
        showAlert: ( title, msg ) => { dispatch( alertBox( title, msg ) ) },
        makeDefault: ( team ) => { dispatch( defaultTeam( team ) ) },
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( ExportAction );