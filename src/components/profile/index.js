import React, { Component } from 'react';
import { View, Platform, TextInput, TouchableOpacity, ActivityIndicator, PermissionsAndroid, ScrollView, Text, Alert, StyleSheet, Image, Modal, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import { COLOR, ASSET_STYLE, STYLE } from '../../config/theme';
import ImagePicker from 'react-native-image-picker';
import ProfileExpandableView from '../common/profile-expandable.view';
import { headerHelper, renderGenericPicker } from '../../util/ui-helper';
import SignatureView from '../common/signature.view';
import { profile, updateProfile, alertBox, login } from '../../action/auth';
import AuthApi from '../../api/auth';
import RNFS from 'react-native-fs';
import moment from 'moment';
import RNFetchBlob from 'react-native-fetch-blob'
import { pdfhelper } from '../../util/pdf-helper';
import { NavigationActions } from 'react-navigation';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import CassaStatusBar from '../common/status.bar';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import { WEB_URL } from '../../api/constant';
import Close from './popupcloseicon.png';
const Buffer = global.Buffer || require('buffer').Buffer;

const QualificationRecord = (props) => (

    <View style={{ flexDirection: 'row', paddingTop: 2, }}>
        <Text style={[styles.txt, { flex: 1, color: '#000000' }]}>{props.title}</Text>
        <TouchableOpacity onPress={() => props.onEdit(props.record)}>
            <Image style={{ width: 20, height: 20, justifyContent: 'center' }} source={require('../../assets/images/task/edit.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingLeft: 25 }} onPress={() => {
            Alert.alert(
                '',
                'Please confirm to delete this item.',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => props.onDelete(props.record.user_qualification_id) },
                ],
                { cancelable: false });

        }}>
            <Image style={{ width: 20, height: 20, justifyContent: 'center' }} source={require('../../assets/images/task/delete.png')} />
        </TouchableOpacity>
    </View>
)

const CompetencyRecord = (props) => (
    <View style={{ flexDirection: 'row', paddingTop: 5, justifyContent: 'center' }}>
        <Text style={[styles.txt, { flex: 1, color: '#000000' }]}>{props.title}</Text>
        <TouchableOpacity onPress={() => props.onEdit(props.record)}>
            <Image style={{ width: 20, height: 20, justifyContent: 'center' }} source={require('../../assets/images/task/edit.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingLeft: 25 }} onPress={() => {
            Alert.alert(
                '',
                'Please confirm to delete this item.',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => props.onDelete(props.record.user_qualification_id) },
                ],
                { cancelable: false });

        }}>
            <Image style={{ width: 20, height: 20, justifyContent: 'center' }} source={require('../../assets/images/task/delete.png')} />
        </TouchableOpacity>
    </View>
)

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 15,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderWidth: 0.5,
        paddingLeft: 5,
        paddingRight: 5,
        ...Platform.select({
            ios: {
                height: 50
            }
        })
    },
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
    circleShapeView: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        backgroundColor: '#DADADA',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        paddingLeft: '5%'
    },
    txtView1: {
        color: 'white',
        ...STYLE.bodyfontStyle
    },
    loginBtn: {
        marginTop: 10,
        marginTop: 30,
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 5
    },
    txt: {
        color: '#FFFFFF',
        ...STYLE.bodyfontStyle
    },
    txtInput: {
        ...STYLE.bodyfontStyle,
        ...Platform.select({
            ios: {
                flex: 1,
                paddingLeft: 5
            }
        })
    },
    txtView2: {
        color: 'white',
        ...STYLE.subHeadingfontStyle
    },
    teamCount: {
        backgroundColor: '#083D8B',
        width: Platform.isPad ? 30 * 4 : 25 * 4,
        height: Platform.isPad ? 35 : 25,
        borderRadius: 25 / 2,
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
    },
    datePickerBox: {
        marginTop: 9,
        borderBottomWidth: 0.5,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 38,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    datePickerText: {
        color: '#000000',
        flex: 1,
        paddingTop: 5,
        marginLeft: 5,
        justifyContent: 'center',
        ...STYLE.bodyfontStyle
    },
    txtTitle: {
        color: '#000000',
        ...STYLE.subHeadingfontStyle
    },
    cardList: {
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    containerInner: {
        alignSelf: 'stretch'
    },
    container: {
        flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff'
    }
});

const ProfilePicSection = (props) => {
    return <Wrapper><TouchableOpacity onPress={props.uploadClick} >
        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{
                color: '#000000',
                flex: 1,
                marginLeft: 5,
                justifyContent: 'center',
                ...STYLE.bodyfontStyle
            }}>{props.image ? props.image : 'Image'}</Text>
            <View style={{
                alignSelf: 'stretch',
                alignItems: 'flex-end', paddingRight: 5
            }}>
                <View style={styles.teamCount}>
                    <Text style={styles.teamCountTxt}>Upload</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity></Wrapper>;
}

class Profile extends Component {

    navigate = undefined;

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        params.title = 'My Profile';
        return headerHelper(params, (<TouchableOpacity style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            navigation.navigate('DrawerToggle');
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../../assets/images/home/menu.png')} />
            </View>
        </TouchableOpacity>), null, navigation);
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            profilePic: '',
            id: undefined,
            firstName: '',
            lastName: '',
            dob: undefined,
            dobText: '',
            gender: '',
            email: '',
            image: '',
            imageUrl: '',
            webUrl: undefined,
            address1: '',
            address2: '',
            city: '',
            state: '',
            country: '',
            zipcode: '',
            mobile: '',
            loading: false,
            usi: '',
            pdfLink: undefined,
            qualifications: [],
            competencies: [],
            completedBy: {
                name: '',
                signature: '',
            }
        }
        navigate = this.props.navigation.navigate;
    }

    deleteCompetency(id) {
        AuthApi.deleteCompetency(this.props.token, id).then(data => data.json()).then(data => {
            if (data.success) {
                this.props.showAlert('Alert', 'Delete Competency Success');
                this.callback();
            }
        }).catch(err => {
            console.log(err);
        })
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    deleteQualification(id) {
        // console.warn(id)
        AuthApi.deleteQualification(this.props.token, id).then(data => data.json()).then(data => {
            //  console.log(data)
            if (data.success) {
                this.props.showAlert('Alert', 'Delete Qualification Success');
                this.callback();
            }
        }).catch(err => {
            console.log(err);
        })
    }

    uploadSignature(formdata) {
        let payload = {
            method: 'POST',
            body: formdata
        }
        return fetch(`${WEB_URL}/api/user/signatureupload`, payload);
    }

    _onSave(data) {
        this.setState({ loading: true });
        const pdfHelper = new pdfhelper();
        const keyString = moment(new Date()).format('DD-MMM-YYYY') + '.png';
        pdfHelper.uploadBase64(data.encoded, keyString).then(data1 => {
            //console.warn(data)
            let array = data1.split('/');
            let fileName = array[array.length - 1];
            fileName = fileName.replace(new RegExp('%20', 'g'), '');

            RNFetchBlob.config({ fileCache: true, appendExt: 'png' })
                .fetch('GET', data1, {})
                .then((res) => {
                    //         Platform.OS === 'android' ? console.log('file://' + res.path()) : '' + console.log(res.path())
                    const filePath = Platform.OS === 'android' ? '' + res.path() : '' + res.path();
                    RNFetchBlob.fetch('POST', `${WEB_URL}/api/user/signatureupload/`, {
                        'Content-Type': 'multipart/form-data',
                    }, [
                            { name: 'signature', filename: fileName.toString(), data: RNFetchBlob.wrap(filePath) },
                            { name: 'user_id', data: this.state.id.toString() }
                        ]).then(res => {
                            //   console.warn(res.info())
                            this.props.getProfile(this.props.token, () => {

                                alert('File Upload Succefully')

                                this.setState({ loading: false });
                            });
                        })
                })

        })

    }
    datePickerMainFunctionCall = () => {
        let DateHolder = this.state.dob;
        if (!DateHolder || DateHolder == null) {
            DateHolder = new Date();
            this.setState({
                ...this.state,
                DateHolder: DateHolder
            });
        }
        //To open the dialog
        this.refs.datePicker.open({
            date: DateHolder,
        });
    }

    /**
     * Call back for dob date picked event
     *
     */
    onDatePickedFunction = (date) => {
        this.state['dob'] = date;
        this.state['dobText'] = moment(date).format('DD-MMM-YYYY');
        this.setState({
            ...this.state
        });
    }

    uploadPic() {
        var options = {
            title: 'Select Photo',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.launchImageLibrary(options, (response) => {

            this.setState({ modalVisible: false })

            if (!response || !response.uri) return;           
            // console.warn(response.path)
            // console.warn(response)
            if (Platform.OS === 'android') {
                const array = response.path ? response.path.split('/') : [];

                this.setState({
                    imageUrl: 'file://' + response.path,
                    image: array[array.length - 1]
                });
            } else {
                const array = response.uri ? response.uri.split('/') : [];
                this.setState({
                    //imageUrl: response.uri.replace('file://', ''),
                    imageUrl: response.uri,
                    image: array[array.length - 1]
                });
            }
        });
    }

    checkPermission() {
        return new Promise((resolve, reject) => {
            if (Platform.OS === 'android' && Platform.Version > 22) {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
                    .then(res => {
                        if (res !== 'granted') {
                            Alert.alert('Oops!', 'We need permission to access your camera !');
                        } else {
                            resolve(res);
                        }
                    });
            } else if (Platform.OS === 'ios') {
                if (Camera) {
                    Camera.checkDeviceAuthorizationStatus()
                        .then(access => {
                            if (!access) {
                                Alert.alert('Oops!', 'We need permission to access your camera !');
                            } else {
                                resolve(access);
                            }
                        });
                }
            } else {
                resolve(null);
            }
        });
    }

    cameraPic() {
        this.checkPermission().then(data => {

            this.props.navigation.navigate('Camera', {
                cameraCb: async (response) => {
                    const filePath = response;
                    //                    console.warn(response)
                    const array = filePath.split('/');
                    //                    this.setState({ loading: true });
                    var newPath = response.replace("file://", "");

                    // const data1 = await ImageResizer.createResizedImage(filePath, 300, 200, 'PNG', 100, rotation = 0, )
                    // //console.warn(data1)

                    // const base64image = await RNFS.readFile(Platform.OS === 'android' ? data1.uri : data1.path, 'base64');

                    if (Platform.OS === 'android') {
                        // const array = response.path ? response.path.split('/') : [];
                        this.setState({
                            imageUrl: response,
                            image: array[array.length - 1]
                        });
                    } else {
                        const array = response ? newPath : [];
                        this.setState({
                            //imageUrl: response.uri.replace('file://', ''),
                            imageUrl: newPath,
                            image: array[array.length - 1]
                        });
                    }

                }
            })

        })

    }

    handle(key, value) {
        this.state[key] = value;
        this.setState({
            ...this.state
        });
    }

    updateStateByProfile(profile) {
        this.setState({
            id: profile.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            dob: profile.dob ? new Date(profile.dob) : undefined,
            dobText: profile.dob ? moment(new Date(profile.dob)).format('DD-MMM-YYYY') : undefined,
            gender: profile.gender,
            email: profile.email,
            image: profile.image,
            city: profile.city,
            state: profile.state,
            address1: profile.address1,
            address2: profile.address2,
            country: profile.country_id,
            mobile: profile.phone,
            zipcode: profile.postal_code,
            pdfLink: profile.pdfLink
        })
    }

    getCountryId(country) {
        const array = this.props.countries.filter(i => {
            return i.name === country;
        });
        return array ? array[0] : 0;
    }

    createObjectForUpdate() {
        const generalObject = {
            id: this.state.id,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            dob: moment(new Date(this.state.dob)).format('YYYY-MM-DD'),
            country_id: this.getCountryId(this.state.country).id,
            email: this.state.email,
            phone: this.state.mobile,
            address1: this.state.address1,
            address2: this.state.address2,
            city: this.state.city,
            state: this.state.state,
            gender: this.state.gender,
            image: this.state.image,
            postal_code: this.state.zipcode
        }
        return generalObject;
    }

    componentWillReceiveProps(props) {
        if (props.profile) {
            this.updateStateByProfile(props.profile);
        }
    }

    //     shouldComponentUpdate(nextProps, nextState) {
    //         if(this.state.image != nextState.image) {
    //              return false
    //         }
    //         return true
    //    }

    componentWillMount() {
        this.props.getProfile(this.props.token, () => {
        });

        this.props.getQualifications(this.props.token).then(data => data.json()).then(data => {
            if (data.success) {
                this.setState({ 'qualifications': data.result });
            }
        }).catch(err => console.log(err));

        this.props.getCompetencies(this.props.token).then(data => data.json()).then(data => {
            if (data.success) {
                this.setState({ 'competencies': data.result });
            }
        }).catch(err => console.log(err));

    }

    uploadApi(formdata) {
        let payload = {
            method: 'POST',
            body: formdata,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;'
            }
        }
        return fetch(`${WEB_URL}/api/user/imageupload`, payload);
    }

    async saveGeneral() {
        //      this.setState({ loading: true });
        if (this.state.imageUrl) {
            const uri1 = this.state.imageUrl;
            //uri = uri.replace('file://', '');

            let array = this.state.imageUrl.split('/');
            let fileName = moment(new Date()).format('DD-MMM-YYYY') + array[array.length - 1];
            fileName = fileName.replace(new RegExp('%20', 'g'), '');
            console.warn(fileName)
            const apiUrl = `https://app.cassa.io/api/user/imageupload`;
            const uri = this.state.imageUrl;
            const data1 = await ImageResizer.createResizedImage(uri, 300, 200, 'PNG', 100, rotation = 0, )
            filePath = Platform.OS === 'android' ? data1.uri : data1.path
            let array1 = filePath.split('/');
            let fileName1 = moment(new Date()).format('DD-MMM-YYYY') + array1[array1.length - 1];
            fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');
            const uriParts1 = filePath.split('.');
            const fileType = uriParts1[uriParts1.length - 1];
            RNFetchBlob.fetch('POST',
                `${WEB_URL}/api/user/imageupload`, { 'Content-Type': 'multipart/form-data' }, [
                    {
                        name: 'image',
                        filename: fileName1.toString(),
                        type: `image/${fileType}`,
                        data: RNFetchBlob.wrap(filePath)
                    },
                    { name: 'user_id', data: this.state.id.toString() }

                ]).then((resp) => {
                    console.warn(resp)
                    // this.props.updateProfile(this.props.token, this.createObjectForUpdate(), () => {
                    this.props.getProfile(this.props.token, () => {
                        alert('File Upload Succefully')

                    });
                    // })
                })

            // const pdfHelper = new pdfhelper();
            // pdfHelper.upload(uri, fileName).then(data1 => {
            //     let array = data1.postResponse.location.split('/');
            //     let fileName1 = moment(new Date()).format('DD-MMM-YYYY') + array[array.length - 1];
            //     fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');
            //     console.warn(fileName1)
            //     RNFetchBlob.config({
            //         fileCache: true,
            //         appendExt: 'png'
            //     })
            //         .fetch('GET', data1.postResponse.location, {
            //         })
            //         .then((res) => {
            //             console.warn(res.path())
            //             const filePath = Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path();
            //             RNFetchBlob.fetch('POST',
            //                 `${WEB_URL}/api/user/imageupload`, { 'Content-Type': 'multipart/form-data' }, [
            //                     // { name : 'signature', filename : fileName.toString(), type:'image/png', data: RNFetchBlob.wrap(filePath)},{name:'user_id',data:this.state.id.toString()}

            //                     {
            //                         name: 'image',
            //                         filename: fileName1.toString(),
            //                         type: `image/jpg`,
            //                         data: RNFetchBlob.wrap(filePath)
            //                     },
            //                     { name: 'user_id', data: this.state.id.toString() }

            //                 ]).then((resp) => {
            //                     console.warn(resp.json())
            //                     // this.props.updateProfile(this.props.token, this.createObjectForUpdate(), () => {
            //                     this.props.getProfile(this.props.token, () => {
            //                         alert('File Upload Succefully')

            //                     });
            //                     // })
            //                 })
            //         })
            // })

        }
        else {
            this.props.updateProfile(this.props.token, this.createObjectForUpdate(), () => {
                this.props.getProfile(this.props.token, () => {
                });
            });
        }

    }

    emailPersonalProfile() {
        if (!this.state.pdfLink) {
            this.props.showAlert('Alert', 'PDF not present !');
            return;
        }
        const array = this.state.pdfLink.split('/');
        navigate('Export', { path: this.state.pdfLink, name: array[array.length - 1], profile: true });
    }

    async emailPersonalProfileTest() {
        //       console.warn(this.state.qualification);
        //     console.warn(this.state.competencies);
        // console.warn(this.props.profile.image);

        // console.warn(this.props.profile.signature);
        const country = this.props.countries.filter(i => i.id == this.props.profile.country_id);
        //   console.warn(country)
        const renderQualificationsTable = (params) => {
            if (params.length) {
                return params.map(param => `
        <tr>
                <td style="padding: 4px 0;text-align: left;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${param.name}</td>
                <td style="padding: 4px 0;text-align: left;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${param.notes}</td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${moment(param.date_completed).format('DD MMM YYYY')}</td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${moment(param.expired_at).format('DD MMM YYYY')}</td>
        </tr>
    ` ).reduce((final, row) => final + row);
            }
            else return ``
        };

        const renderCompetencyTable = (params) => {
            if (params.length) {
                return params.map(param => `
        <tr>
                <td style="padding: 4px 0;text-align: left;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${param.name}</td>
                <td style="padding: 4px 0;text-align: left;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${param.notes}</td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${moment(param.date_completed).format('DD MMM YYYY')}</td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${moment(param.expired_at).format('DD MMM YYYY')}</td>
        </tr>
    ` ).reduce((final, row) => final + row);
            }
            else return ``
        };

        const renderTrainingTable = (params) => {
            if (params.length) {
                return params.map(param => `
        <tr>
                <td style="padding: 4px 0;text-align: left;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${param.name}</td>
                <td style="padding: 4px 0;text-align: left;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${param.notes}</td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%">${param.dateCompleted}</td>
        </tr>
    ` ).reduce((final, row) => final + row);
            }
            else return ``
        };

        let options = {

            fileName: `${this.props.profile.first_name ? this.props.profile.first_name: ''}_${this.props.profile.last_name ? this.props.profile.last_name:''}_profile`, //'test',
            directory: 'docs',
            html: `
            <head>
    <link href="https://app.cassa.io/css/bootstrap.min.css" rel="stylesheet" media="all">
    <link href="https://app.cassa.io/css/certificate.css" rel="stylesheet" media="all">
    <style type="text/css" media="print">
        @page  {
            /*size: A4;*/   /* auto is the initial value */
            margin: 0;  /* this affects the margin in the printer settings */
        }
    </style>
</head>
<body style="padding:5px 15px;">
            <div id="main-content-certificate" style="border-spacing: 0;border-collapse: collapse;background-color: transparent; max-width: 100%; width: 760px;margin:0 auto; padding:15px 0; position:relative;">
    <table style="border-spacing: 0;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;margin-bottom: 10px;">
        <tbody>
            <tr>
                <td style="vertical-align:top;">
                    <img style="height:120px;" src="${this.props.team.photo_url}">
                </td>
                <td style="vertical-align:top; text-align:right;">
                    <img style="height:120px; border-radius: 4px;" 
                    src="${WEB_URL}/uploads/users/45x45/${this.props.profile.image}">
                </td>
            
            </tr>
          
        </tbody>
        <tbody>
        </tbody>
    </table>
     
    <table style="border-spacing: 0;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;margin-bottom: 10px;">
        <tbody>
            <tr>
                <td style="padding:8px;text-align:center;text-shadow: 0 0 0 #0870b6;color: #0870b6 !important;font-size: 30px; font-weight:bold;" colspan="2"> ${this.props.team.name}</td>
            </tr>
            <tr>
                <td style="text-align:center; padding:0px;" colspan="2">
                   ${this.props.team.address} ${this.props.team.city} ${this.props.team.state},  ${this.props.countries.filter(data => data.id === this.props.team.country_id)[0].name} ( ${this.props.team.postal_code} )
                </td>
            </tr>
        </tbody>
    </table>
    <table style="border-spacing: 0;border-collapse: collapse;margin-bottom: 10px;background-color: transparent;width: 100%; max-width: 100%;">
        <tbody>
            <tr>
                <td colspan="2" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;  text-shadow: 0 0 0 #000;color: #000 !important;font-size: 26px; font-weight:bold;"><span>${this.props.profile.first_name ? this.props.profile.first_name : ''} ${this.props.profile.last_name ? this.props.profile.last_name : ''}</td>
            </tr>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>D.O.B. :</strong> ${this.props.profile.dob ? moment(this.props.profile.dob).format('DD MMM YYYY') : ''}</td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>Email :</strong> ${this.props.profile.email ? this.props.profile.email : ''}</td>
            </tr>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" colspan="2"><strong>Gender :</strong> ${this.props.profile.gender ? this.props.profile.gender : ''}</td>
            </tr>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" colspan="2"><strong>Address :</strong> ${this.props.profile.address ? this.props.profile.address : ''} ${this.props.profile.address1 ? this.props.profile.address1 : ''}  ${this.props.profile.address2 ? this.props.profile.address2 : ''}</td>
            </tr>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>City :</strong> ${this.props.profile.city ? this.props.profile.city : ''}</td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>State :</strong> ${this.props.profile.state ? this.props.profile.state : ''}</td>
            </tr>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>Postal Code :</strong> ${this.props.profile.postal_code ? this.props.profile.postal_code : ''} </td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>Country :</strong> ${ country[0].name ? country[0].name : ''}</td>
            </tr>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>Phone :</strong> ${this.props.profile.phone ? this.props.profile.phone : ''}</td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>USI No. :</strong> ${this.props.profile.usiNo ? this.props.profile.usiNo : ''}</td>
            </tr>
        </tbody>
    </table>
    <table style="border-spacing: 0;margin-bottom: 10px;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;">
        <tbody>
            <tr>
                <td width="35%" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;"><span style="border-bottom: 1px solid #999;display: block;"></span></td>
                <td width="35%" style="font-weight: 400;font-size: 18px; color:#999 !important; text-shadow: 0 0 0 #999; padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #999;text-align: center;margin: 6px 0;">Emergency Information</td>
                <td width="35%" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;"><span style="border-bottom: 1px solid #999;display: block;"></span></td>
            </tr>
        </tbody>
    </table>
    <table style="border-spacing: 0;border-collapse: collapse;margin-bottom: 10px;background-color: transparent;width: 100%; max-width: 100%;">
        <tbody>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>Blood Type :</strong> ${this.props.profile.emergency_info.bloodType ? this.props.profile.emergency_info.bloodType : ''} </td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="50%"><strong>Allergies and Health Conditions :</strong> ${this.props.profile.emergency_info.health ? this.props.profile.emergency_info.health : ''} </td>
            </tr>
        </tbody>
    </table>
    <table style="border-spacing: 0;margin-bottom: 10px;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;">
        <tbody>
            <tr>
                <td colspan="3" width="33.33%" style="font-weight: 400;font-size: 18px; text-shadow: 0 0 0 #999; padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #999;text-align: center;margin: 6px 0;">Emergency Contact 1</td>
            </tr>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="30%"><strong>Name :</strong> ${this.props.profile.emergency_info.contact1_name ? this.props.profile.emergency_info.contact1_name : ''} </td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="30%"><strong>Phone :</strong> ${this.props.profile.emergency_info.contact1_number ? this.props.profile.emergency_info.contact1_number : ''} </td>
                
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="30%"><strong>Relation :</strong> ${this.props.profile.emergency_info.contact1_relation ? this.props.profile.emergency_info.contact1_relation : ''}</td>
                
            </tr>
        </tbody>
    </table>
    <table style="border-spacing: 0;margin-bottom: 10px;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;">
        <tbody>
            <tr>
                <td colspan="3" width="33.33%" style="font-weight: 400;font-size: 18px; text-shadow: 0 0 0 #999; padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #999;text-align: center;margin: 6px 0;">Emergency Contact 2</td>
            </tr>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="30%"><strong>Name :</strong> ${this.props.profile.emergency_info.contact2_name ? this.props.profile.emergency_info.contact2_name : ''} </td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="30%"><strong>Phone :</strong> ${this.props.profile.emergency_info.contact2_number ? this.props.profile.emergency_info.contact2_number : ''} </td>
                
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="30%"><strong>Relation :</strong> ${this.props.profile.emergency_info.contact2_relation ? this.props.profile.emergency_info.contact2_relation : ''}</td>
                
            </tr>
        </tbody>
    </table>
    <table style="border-spacing: 0;margin-bottom: 10px;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;">
        <tbody>
            <tr>
                <td width="38%" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;"><span style="border-bottom: 1px solid #999;display: block;"></span></td>
                <td width="16%" style="font-weight: 400;font-size: 18px; color:#999 !important; text-shadow: 0 0 0 #999; padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #999;text-align: center;margin: 6px 0;">Trainings</td>
                <td width="38%" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;"><span style="border-bottom: 1px solid #999;display: block;"></span></td>
            </tr>
        </tbody>
    </table>     

    <table style="border-spacing: 0;margin-bottom: 10px;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;">
        <tbody>
            <tr>
                <td width="40%" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;"><span style="border-bottom: 1px solid #999;display: block;"></span></td>
                <td width="20%" style="font-weight: 400;font-size: 18px; color:#999 !important; text-shadow: 0 0 0 #999; padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;text-align: center;margin: 6px 0;">Qualifications</td>
                <td width="40%" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;"><span style="border-bottom: 1px solid #999;display: block;"></span></td>
            </tr>
        </tbody>
    </table> 
    <table style="border-spacing: 0;margin-bottom: 10px;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;text-align:center;">
        <tbody>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%"><strong>Qualification Name</strong></td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%"><strong>Notes</strong></td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%"><strong>Date Completed</strong></td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%"><strong>Expired Date</strong></td>
            </tr>  
            
            ${renderQualificationsTable(this.state.qualifications)}
        </tbody>
    </table>
    <table style="border-spacing: 0;margin-bottom: 10px;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;">
        <tbody>
            <tr>
                <td width="15%" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;"><span style="border-bottom: 1px solid #999;display: block;"></span></td>
                <td width="40%" style="font-weight: 400;font-size: 18px; color:#999 !important; text-shadow: 0 0 0 #999; padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;text-align: center;margin: 6px 0;">Verification of Competency / Proficiency Assessment</td>
                <td width="15%" style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;"><span style="border-bottom: 1px solid #999;display: block;"></span></td>
            </tr>
        </tbody>
    </table>
    <table style="border-spacing: 0;margin-bottom: 10px;border-collapse: collapse;background-color: transparent;width: 100%; max-width: 100%;text-align:center;">
        <tbody>
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%"><strong>Description</strong></td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%"><strong>Notes</strong></td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%"><strong>Date Completed</strong></td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: middle;border-top: 0px solid #ddd;" width="25%"><strong>Expired Date</strong></td>
            </tr>
            ${renderCompetencyTable(this.state.competencies)}
        </tbody>
    </table>

    <table id="logo-table-for-certificate" style="margin-bottom: 10px; left: 0px; right: 0px; bottom: 15px; width: 100%; max-width: 100%; border-spacing: 0px; border-collapse: collapse; background-color: transparent; position: static; margin-top: 50px;">
        <tbody style="bottom: 0;width: 100%;left: 0;right: 0;">
            <tr>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: bottom;border-top: 0px solid #ddd; text-align:left;">
                    <img style="width: 130px;" src="${WEB_URL}/uploads/users/${this.props.profile.signature}">
                    <p>Signature</p>
                </td>
                <td style="padding: 4px 0;line-height: 1.42857143;vertical-align: bottom;border-top: 0px solid #ddd;text-align:right;">
                    <img style="width: 130px;" src="${WEB_URL}/images/cassa_logo_new.png">
                </td>
            </tr>
        </tbody>
    </table>
     </div>       
      </body>
            `,
        };

        let file = await RNHTMLtoPDF.convert(options)
        //     console.warn(file.filePath);

        const array = file.filePath.split('/');
        navigate('Export1', { path: file.filePath, name: array[array.length - 1], profile: true });
    }

    callback() {
        this.props.getQualifications(this.props.token).then(data => data.json()).then(data => {
            if (data.success) {
                this.setState({ 'qualifications': data.result });
            }
        }).catch(err => console.log(err));

        this.props.getCompetencies(this.props.token).then(data => data.json()).then(data => {
            if (data.success) {
                this.setState({ 'competencies': data.result });
            }
        }).catch(err => console.log(err));

        this.props.getProfile(this.props.token).then(data => data.json()).then(data => {
            //console.log("L918:", data);
        }).catch(err => console.log(err));
    }

    navigateToQualification(record) {
        if (!record) {
            navigate('Qualification', { title: 'Add New', qualification: undefined, callback: this.callback.bind(this) });
        } else {
            navigate('Qualification', { title: 'Edit', qualification: record, callback: this.callback.bind(this) });
        }
    }

    navigateToCompetency(record) {
        //        console.warn(record)
        if (!record) {
            navigate('Competency', { title: 'Add New', competency: undefined, callback: this.callback.bind(this) });
        } else {
            navigate('Competency', { title: 'Edit', competency: record, callback: this.callback.bind(this) });
        }
    }

    renderGeneral() {
        return (
            <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.firstName}
                        onChangeText={(value) => this.handle('firstName', value)} placeholder="First Name*" />
                </Wrapper>
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.lastName}
                        onChangeText={(value) => this.handle('lastName', value)} placeholder="Last Name*" />
                </Wrapper>
                <DatePickerDialog ref="datePicker" onDatePicked={this.onDatePickedFunction.bind(this)} />
                <Wrapper><TouchableOpacity onPress={this.datePickerMainFunctionCall.bind(this)} >
                    <View style={styles.datePickerBox}>
                        <Text style={[styles.datePickerText]}>{(this.state.dob && this.state.dobText) ? this.state.dobText : 'Date of Birth'}</Text>
                        <Image style={{ width: 15, height: 15, justifyContent: 'center' }} source={require('../../assets/images/task/date.png')} />
                    </View>
                </TouchableOpacity></Wrapper>
                <ProfilePicSection image={this.state.image} uploadClick={async () => this.setState({ modalVisible: !this.state.modalVisible })} />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose={() => {
                        alert('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, padding: 10, backgroundColor: 'rgba(38, 50, 56, .86)', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Image source={Close} />
                            </TouchableHighlight>
                        </View>
                        <View styel={{ flex: 15, alignItems: 'center' }}>
                            <TouchableOpacity underlayColor={COLOR.PRIMARY} style={[styles.loginBtn, { margin: 10, alignItems: 'center', }]} onPress={async () => {
                                this.uploadPic();
                            }
                            }><Text style={styles.txt}>Upload from Gallery</Text></TouchableOpacity>

                            <TouchableOpacity underlayColor={COLOR.PRIMARY} style={[styles.loginBtn, { margin: 10, }]} onPress={ () => {

                                this.cameraPic();
                                this.setModalVisible(!this.state.modalVisible);
                            }
                            }><Text style={styles.txt}>Take Photo From camera</Text></TouchableOpacity>

                        </View>

                    </View>

                </Modal>

                {
                    renderGenericPicker('gender', [{
                        id: 'male',
                        name: 'Male'
                    }, {
                        id: 'female',
                        name: 'Female'
                    }], 'Gender*', this)
                }
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.email}
                        onChangeText={(value) => this.handle('email', value)} placeholder="Email*" />
                </Wrapper>
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.address1}
                        onChangeText={(value) => this.handle('address1', value)} placeholder="Address Line 1*" />
                </Wrapper>
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.address2}
                        onChangeText={(value) => this.handle('address2', value)} placeholder="Address Line 2*" />
                </Wrapper>
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.city}
                        onChangeText={(value) => this.handle('city', value)} placeholder="City*" />
                </Wrapper>
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.state}
                        onChangeText={(value) => this.handle('state', value)} placeholder="State*" />
                </Wrapper>
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.zipcode}
                        onChangeText={(value) => this.handle('zipcode', value)} placeholder="ZipCode*" />
                </Wrapper>
                {renderGenericPicker('country', this.props.countries, 'Country*', this)}
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.mobile}
                        onChangeText={(value) => this.handle('mobile', value)} placeholder="Mobile Phone*" />
                </Wrapper>
                <Wrapper>
                    <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' style={[styles.txtInput, {
                        color: '#000000',
                        ...Platform.select({
                            ios: {
                                height: 70
                            }
                        })
                    }]} value={this.state.usi}
                        onChangeText={(value) => this.handle('usi', value)} placeholder="Unique Student Identifier (USI) Number*" />
                </Wrapper>
                <TouchableOpacity underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={this.saveGeneral.bind(this)}>
                    <Text style={styles.txt}>Save</Text>
                </TouchableOpacity>
                <View style={{ marginBottom: 20 }}></View>
            </View >
        )
    }

    renderQualification() {
        const qualifications = [];

        if (this.state.qualifications) {
            this.state.qualifications.forEach(i => {
                qualifications.push(<QualificationRecord record={i} title={i.name} onEdit={(value) => this.navigateToQualification(value)} onDelete={(id) => this.deleteQualification(id)} />);
            })
            // console.warn(this.state.qualifications)
        }
        return (
            <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 2, paddingBottom: 80, }}>

                {qualifications}
                <TouchableOpacity underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={() => this.navigateToQualification()}>
                    <Text style={styles.txt}>Add New Qualification</Text>
                </TouchableOpacity>

            </View>
        )
    }

    renderVerification() {
        let competencies = [];
        if (this.state.competencies) {
            this.state.competencies.forEach(i => {
                competencies.push(<CompetencyRecord record={i} title={i.name} onEdit={(value) => this.navigateToCompetency(value)} onDelete={(id) => this.deleteCompetency(id)} />);
            })
        }
        return (
            <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 2, paddingBottom: 80 }}>
                {competencies}
                <TouchableOpacity underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={() => this.navigateToCompetency()}>
                    <Text style={styles.txt}>Add New Competency</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />

                    <View style={{ flex: 1, justifyContent: 'center', 'alignItems': 'center' }}>
                        <ActivityIndicator animating={true}
                            color={COLOR.PRIMARYDARK}
                            size="large" />
                    </View>
                </View>
            )
        }

        console.warn(this.props.id)
        return (
            <View style={styles.container}>
                <ScrollView style={styles.containerInner}>

                    <View
                        style={{
                            backgroundColor: '#083D8B',
                            height: 150,
                            justifyContent: 'center',
                            paddingLeft: '10%'
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                            {!this.props.profile ?
                                (<View style={styles.circleShapeView}></View>) :
                                (<Image resizeMode="contain" style={[styles.circleShapeView, { backgroundColor: 'transparent' }]} source={{ uri: `${WEB_URL}/uploads/users/45x45/${this.props.profile.image}` }} />)
                            }
                            <View style={styles.titleContainer}>
                                <Text style={styles.txtView1}>
                                    {
                                        this.props.lastName
                                    }
                                </Text>
                                <Text style={styles.txtView2}>
                                    {
                                        this.props.firstName
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                    <ProfileExpandableView title='General Information'
                    >
                        {this.renderGeneral()}
                    </ProfileExpandableView>
                    <ProfileExpandableView title='Add Qualification'>
                        {this.renderQualification()}
                    </ProfileExpandableView>
                    <ProfileExpandableView title='Verification of Competency / Proficiency Assesment'>
                        {this.renderVerification()}
                    </ProfileExpandableView>
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>

                        <SignatureView
                            ref={r => this._signatureCompletedView = r}
                            onSave={this._onSave.bind(this)} />
                        <TouchableOpacity underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={() => this._signatureCompletedView.show(true)}>
                            <Text style={styles.txt}>Signature</Text>
                        </TouchableOpacity>

                        <TouchableOpacity underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={this.emailPersonalProfileTest.bind(this)}>
                            <Text style={styles.txt}>Email Personal Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} underlayColor={COLOR.PRIMARY} style={[styles.loginBtn, { marginBottom: 5 }]}>
                            <Text style={styles.txt}>Done</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
        )
    }
}

const Wrapper = (props) => (
    <View style={styles.wrapper}>
        {props.children}
    </View>
)

const mapStateToProps = (state, ownProps) => {
    return {

        firstName: state.auth.firstName,
        lastName: state.auth.lastName,
        profilePic: state.auth.profileImg,
        countries: state.lookup.countries,
        token: state.auth.token,
        username: state.auth.username,
        password: state.auth.password,
        profile: state.auth.profile,
        id: state.auth.id,
        team: state.company.team
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        getProfile: (token, callback) => { dispatch(profile(token, callback)) },
        //getProfile: (username, password, callback) => { dispatch(profile(username, password, callback)) },
        updateProfile: (token, profile, callback) => { dispatch(updateProfile(token, profile, callback)) },
        getQualifications: (token) => { return AuthApi.qualifications(token) },
        getCompetencies: (token) => { return AuthApi.competencies(token) }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

    //     let pathName = Platform.OS === 'android' ? `file://${data.pathName}` : data.pathName;
    //     let array = data.pathName.split('/');
    //     let fileName = array[array.length - 1];
    //     fileName = fileName.replace(new RegExp('%20', 'g'), '');
    //     RNFetchBlob.fetch('POST', 'http://staging.cassa.io/api/user/signatureupload', {
    //     'Content-Type' : 'multipart/form-data',
    //   }, [
    //     { name : 'signature', filename : fileName.toString(), data: RNFetchBlob.wrap(pathName)},
    //     {name:'user_id',data:this.state.id.toString()}

    //   ]).then((resp) => {
    //  console.warn(resp)
    //     alert('File Upload Succefully')
    //     this.props.getProfile(this.props.token, () => {
    //     }); 
    // })

//         console.log(data)
//         const pdfHelper = new pdfhelper();
//         const keyString = "signature"+ moment(new Date()).format('DD-MMM-YYYY') + '.png';
//         //instance.setState({loading: true});
//         pdfHelper.uploadBase64(data.encoded, keyString).then(data1 => {
//             let array = data1.split('/');
//             let fileName = array[array.length - 1];
//             fileName = fileName.replace(new RegExp('%20', 'g'), '');

//         RNFetchBlob.config({
//             fileCache : true,
//             appendExt : 'png'
//           })
//           .fetch('GET', data1, {
//           })
//           .then((res) => {
//    //         Platform.OS === 'android' ? console.log('file://' + res.path()) : '' + console.log(res.path())
//         const filePath=Platform.OS === 'android' ?'file:/' + data.path : '' + data.path();
//      //   console.log(filePath)
//             RNFetchBlob.fetch('POST', 'http://staging.cassa.io/api/user/signatureupload', {
//                 'Content-Type' : 'multipart/form-data',
//               }, [
//                 { name : 'signature', filename : fileName.toString(), type:'image/png', data: RNFetchBlob.wrap(filePath)},
//                     {name:'user_id',data:this.state.id.toString()}

//               ]).then((resp) => {
//                 console.log(resp)
//      alert('ok')
//         })
//     })
// })
//}
//             console.log(data1,this.state.id)            
//             let array = data1.split('/');
//                 let fileName = array[array.length - 1];
//                 fileName = fileName.replace(new RegExp('%20', 'g'), '');

//                 RNFS.downloadFile({
//                     fromUrl: data1,
//                     toFile: `${Platform.OS === 'android' ? RNFS.ExternalStorageDirectoryPath : RNFS.DocumentDirectoryPath}/${fileName}`,
//                   }).promise.then((r) => {
// console.log(r)

// const formdata = new FormData();
//                 formdata.append('user_id', this.props.userId);
//                 formdata.append('signature', {type: 'image/png', name: fileName, uri: 
//                 Platform.OS === 'android' ? `${RNFS.ExternalStorageDirectoryPath}/${fileName}` :
//                 `${RNFS.DocumentDirectoryPath}/${fileName}`
//                 });

//                 this.uploadSignature(formdata).then(data => data.json()).then(data => {
//                     console.log(data)
//                     //this.setState({'loading': false});
//                    atert('k')
//                     // this.props.showAlert('Success', 'Form Uploaded Successfully !');
//                 })

        //         //         Platform.OS === 'android' ? console.log('file://' + res.path()) : '' + console.log(res.path())
        //     const filePath=Platform.OS === 'android' ?'file://' + res.path() : '' + res.path();
        //  console.log(filePath,fileName)
        //         RNFetchBlob.fetch('POST', 'http://staging.cassa.io/api/user/signatureupload', {
        //             'Content-Type' : 'multipart/form-data',
        //           }, [
        //             { name : 'signature', filename : fileName.toString(),  data: RNFetchBlob.wrap(filePath)},
        //             {name:'user_id',data:this.state.id.toString()}

        //           ]).then((resp) => {
        //             console.log(resp)
        //             alert('File Upload successfully')

        //           })

        // console.log(data)
        // let uri = data.pathName;
        // uri = uri.replace('file://', '');

        // let array = data.pathName.split('/');
        //     let fileName = array[array.length - 1];
        //     fileName = fileName.replace(new RegExp('%20', 'g'), '');

        //     RNFetchBlob.fetch('POST', 'http://staging.cassa.io/api/user/signatureupload', {
        //     'Content-Type' : 'multipart/form-data',
        //   }, [
        //     { name : 'signature', filename : fileName.toString(), data: RNFetchBlob.base64.encode(data.encoded)},
        //     {name:'user_id',data:this.state.id.toString()}

        //   ]).then((resp) => {
        //  console.log(resp)
        //     alert('File Upload Succefully')
        //     // this.props.getProfile(this.props.token, () => {
        //     // }); 
        // })

        //         this.state.completedBy.signature = data.encoded;
//         console.warn(this.props.id,this.state.completedBy.signature)
//         const base64String = `data:image/png;base64,${data.encoded}`;
//         buf = new Buffer(base64String.replace(/^data:image\/\w+;base64,/, ""), 'base64');
//        console.log(data.path)
//         // const data1 = new FormData();
//         // data1.append('item_id', this.props.navigation.state.params['item_id']);
//         // data1.append('project_id', 0);

//       //  fs.writeFile('image.png', base64Image, {encoding: 'base64'}, function(err) {
//         RNFetchBlob.fetch('POST', 'http://staging.cassa.io/api/user/signatureupload', {
//    // Authorization : "Bearer access-token",
//     //otherHeader : "foo",
//     'Content-Type' : 'multipart/form-data',
//   }, [
//     // element with property `filename` will be transformed into `file` in form data
//     { name : 'signature', filename : 'signature.png',data:data.pathName},
//     {name:'user_id',data:this.props.id.toString()}
// ]).then((resp) => {
//     console.log(resp)
//     alert("Signatire uploaded successfully")
//   }).catch((err) => {
//     console.log(err)
//     alert("Their is some uploading error kindly try again")
//   })
//         this.setState(this.state);

//})

                        // <TouchableOpacity underlayColor={COLOR.PRIMARY} style={styles.loginBtn} onPress={this.emailPersonalProfile.bind(this)}>
                        //     <Text style={styles.txt}>Email Personal Profile</Text>                        // </TouchableOpacity>