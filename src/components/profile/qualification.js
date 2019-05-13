import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, ScrollView, Dimensions, Picker, TouchableOpacity, Text, TextInput, View, Button, StyleSheet, Modal, Alert, Image, TouchableHighlight, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { login, validateEmail, alertBox } from '../../action/auth';
import { getAutocompleteQualification } from '../../action/lookup';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { COLOR, ASSET_STYLE, STYLE } from '../../config/theme';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import { headerHelper } from '../../util/ui-helper';
import { Dropdown } from 'react-native-material-dropdown';
import CassaStatusBar from '../common/status.bar';
import Autocomplete from '../common/autocomplete.view';
import AuthApi from '../../api/auth';
import CheckBox from 'react-native-check-box';
import DatePicker from 'react-native-datepicker'
import Autocomplete1 from 'react-native-autocomplete-input'
import { pdfhelper } from '../../util/pdf-helper';
import RNFetchBlob from 'react-native-fetch-blob';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import Close from './popupcloseicon.png';

const UploadSection = (props) => {
    return <Wrapper><TouchableOpacity onPress={() => props.upload()} >
        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{
                color: '#000000',
                flex: 1,
                marginLeft: 5,
                justifyContent: 'center',
                ...STYLE.bodyfontStyle
            }}>{props.image ? props.image : props.placeholder}</Text>
            <View style={{
                alignSelf: 'stretch',
                alignItems: 'flex-end', paddingRight: 5
            }}>
                <View style={styles.teamCount}>
                    <Text style={styles.teamCountTxt}>Upload</Text></View>
            </View>
        </View>
    </TouchableOpacity></Wrapper>;
}

class Competency extends Component {

    navigate = undefined;

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        params.title = params.title + ' Qualification';
        return headerHelper(params, (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            navigation.goBack(null);
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../../assets/images/forms/left-arrow.png')} />
                <Text style={[STYLE.subHeadingfontStyle, { color: '#000000' }]}>Back</Text>
            </View>
        </TouchableHighlight>), null, navigation);
    };

    constructor(props) {
        super(props);
        this.navigate = this.props.navigation.navigate;
        this.state = {
            id: 0,
            name: '',
            completedDate: '',
            completedDateText: '',
            expiryDate: '',
            expiryDateText: '',
            textAreaHeight: 0,
            copyFront: '',
            copyBack: '',
            note: '',
            active: true,
            copyFrontImageUrl: '',
            copyFrontImage: '',
            copyBackImageUrl: '',
            copyBackImage: '',
            qualification_id: 0,
            data: [],
            hideAutoComplete: false,
            person: '',
            modalVisible: false,
            front: true

        };
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    checkErrors() {
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

    async saveToApi(data) {

        let uri = this.state.copyFrontImageUrl;
        uri = uri.replace('file://', '');
        let array = this.state.copyFrontImageUrl.split('/');
        let fileName = array[array.length - 1];
        fileName = fileName.replace(new RegExp('%20', 'g'), '');

        console.log("file:", fileName);

        let uri1 = this.state.copyBackImageUrl;
        uri1 = uri1.replace('file://', '');
        let array1 = this.state.copyBackImageUrl.split('/');
        let fileName1 = array1[array1.length - 1];
        fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');

        console.log("file1:", fileName1);

        const front1 = this.state.copyFrontImageUrl ? { name: 'front', filename: fileName.toString(), data: RNFetchBlob.wrap(uri) } : { name: 'front', data: '' };
        const back1 = this.state.copyBackImageUrl ? { name: 'back', filename: fileName1.toString(), data: RNFetchBlob.wrap(uri1) } : { name: 'back', data: '' };

        await RNFetchBlob.fetch('POST', 'https://app.cassa.io/api/user/qualificationupload/', {
            'Content-Type': 'multipart/form-data',
        }, [

                { name: 'user_id', data: data.result.user_id.toString() },
                { name: 'qualification_id', data: data.result.qualification_id.toString() },
                front1,
                back1

            ])

    }
    doneClicked() {
        console.log("id:", this.state.id);
        
        AuthApi.createQualification(this.props.token, this.state, this.state.id ? false : true).then(
            data => data.json()
        ).
            then(
                data => {
                    console.log("Done clicked",data.result);
                    if (data.success) {
                        if (this.state.id) {
                            const uri = this.state.copyFrontImageUrl;
                            uri = uri.replace('file://', '');
                            let array = this.state.copyFrontImageUrl.split('/');
                            let fileName = array[array.length - 1];
                            fileName = fileName.replace(new RegExp('%20', 'g'), '');

                            const uri1 = this.state.copyBackImageUrl;
                            uri1 = uri1.replace('file://', '');
                            let array1 = this.state.copyBackImageUrl.split('/');
                            let fileName1 = array1[array1.length - 1];
                            fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');

                            //    if(this.state.copyBackImageChange && this.state.copyBackImageChange ){ 

                            RNFetchBlob.fetch('POST', 'https://app.cassa.io/api/user/qualificationupload', { 'Content-Type': 'multipart/form-data' },
                                [{ name: 'user_id', data: data.result.metadata.user_id.toString() }, {
                                    name: 'qualification_id',
                                    data: data.result.metadata.qualification_id.toString()
                                }, {
                                    name: 'front', filename: this.state.copyFrontImageUrl ? fileName.toString() : '',
                                    data: this.state.copyFrontImageUrl ? RNFetchBlob.wrap(uri) : ''
                                }, {
                                    name: 'back', filename: this.state.copyBackImageUrl ? fileName1.toString() : '',
                                    data: this.state.copyBackImageUrl ? RNFetchBlob.wrap(uri1) : ''
                                }
                                ]).then((resp) => {
                                    this.props.showAlert('Alert', 'Update Qualification Success');
                                    this.props.navigation.state.params.callback();
                                    this.props.navigation.goBack(null);
                                })

                        } else {
                            const uri = this.state.copyFrontImageUrl;
                            uri = uri.replace('file://', '');
                            let array = this.state.copyFrontImageUrl.split('/');
                            let fileName = array[array.length - 1];
                            fileName = fileName.replace(new RegExp('%20', 'g'), '');

                            const uri1 = this.state.copyBackImageUrl;
                            uri1 = uri1.replace('file://', '');
                            let array1 = this.state.copyBackImageUrl.split('/');
                            let fileName1 = array1[array1.length - 1];
                            fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');

                            RNFetchBlob.fetch('POST', 'https://app.cassa.io/api/user/qualificationupload', {
                                'Content-Type': 'multipart/form-data',
                            }, [{ name: 'user_id', data: data.result.user_id.toString() },
                            { name: 'qualification_id', data: data.result.qualification_id.toString() },
                            { name: 'front', filename: this.state.copyFrontImageUrl ? fileName.toString() : '', data: this.state.copyFrontImageUrl ? RNFetchBlob.wrap(uri) : '' },
                            { name: 'back', filename: this.state.copyBackImageUrl ? fileName1.toString() : '', data: this.state.copyBackImageUrl ? RNFetchBlob.wrap(uri1) : '' }

                                ]).then((resp) => {
                                    // console.warn('helo')
                                    // console.warn(resp.info())
                                    this.props.showAlert('Alert', 'Add New Qualification Success');

                                    this.props.navigation.state.params.callback();
                                    this.props.navigation.goBack(null);
                                })
                        }
                    } else {
                        if (this.state.id) {
                            this.props.showAlert('Error', 'Update Qualification Failed');
                        } else {
                            this.props.showAlert('Error', 'Add New Qualification Failed');
                        }
                    }
                }
            ).catch(err => {
            })

    }

    datePickerMainFunctionCall = (type) => {
        let DateHolder = (type === 'completed') ? this.state.completedDate : this.state.expiryDate;
        if (!DateHolder || DateHolder == null) {
            DateHolder = new Date();
            this.setState({
                DateHolder: DateHolder
            });
        }
        //To open the dialog
        if (type === 'completed') {
            this.refs.datePicker.open({
                date: DateHolder,
            });
        } else {
            this.refs.datePicker2.open({
                date: DateHolder,
            });
        }
    }

    /**
     * Call back for dob date picked event
     *
     */
    onDatePickedFunction = (date, type) => {
        if (type === 'completed') {
            this.setState({
                completedDate: date,
                completedDateText: moment(date).format('DD-MMM-YYYY')
            });
        } else {
            this.setState({
                expiryDate: date,
                expiryDateText: moment(date).format('DD-MMM-YYYY')
            });
        }
    }

    cancelClicked() {
        this.props.navigation.goBack(null);
    }

    componentWillMount() {
        //TODO Get data from params if there , and populate.
        this.checkEditAndUpdate();
        this.setState({
            textAreaHeight: Dimensions.get('window').height / 7
        });
    }

    checkEditAndUpdate() {
        const competency = this.props.navigation.state.params.qualification;
        console.warn(competency)

        if (competency) {
            // const copies=JSON.parse(competency.copies);
            // console.warn(copies)

            this.setState({
                id: competency.user_qualification_id,
                name: competency.name,
                qualification_id: competency.qualification_id,
                completedDate: moment(competency.date_completed).format('DD-MMM-YYYY'),
                expiryDate: moment(competency.expired_at).format('DD-MMM-YYYY'),
                note: competency.notes,
                copyFrontImage: competency.copies ? competency.copies.split(',')[0] : '',
                copyBackImage: competency.copies ? competency.copies.split(',')[1] : '',

            })
        }
    }

    handleCheck() {
        if (this.state.active) {
            this.setState({ active: false });
        } else {
            this.setState({ active: true });
        }
    }

    uploadCopyFrontPic() {
        var options = {
            title: 'Select Photo',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        //       this.setState({modalVisible:false})
        ImagePicker.launchImageLibrary(options, (response) => {
            // const pdfHelper = new pdfhelper();
            this.setState({ modalVisible: false })

            if (!response || !response.uri) return;
            if (Platform.OS === 'android') {
                const array = response.path ? response.path.split('/') : [];
                filename = array[array.length - 1];
                const pathName = 'file://' + response.path;
                //                pdfHelper.upload(pathName, filename, false).then(data1 => {
                //   console.warn(data1.postResponse.location)
                this.setState({
                    copyFrontImageUrl: 'file://' + response.path,
                    copyFrontImage: 'file://' + response.path,
                    copyFrontImageChange: false,
                });
                //              })

            } else {
                const array = response.uri ? response.uri.split('/') : [];
                filename = array[array.length - 1];
                const pathName = response.uri
                //   pdfHelper.upload(pathName, filename, false).then(data1 => {
                // console.warn(data1.postResponse.location)
                this.setState({
                    copyFrontImageUrl: response.uri,
                    copyFrontImage: response.uri,
                    copyFrontImageChange: false,
                });
                // })
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

    copyFrontCameraPic() {
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
                            copyFrontImageUrl: response,
                            copyFrontImage: array[array.length - 1],
                            copyFrontImageChange: false,
                        });
                    } else {
                        const array = response ? newPath : [];
                        const array1 = array.split('/')
                        this.setState({
                            //imageUrl: response.uri.replace('file://', ''),
                            copyFrontImageUrl: newPath,
                            copyFrontImage: array1[array1.length - 1],
                            copyFrontImageChange: false,
                        });
                    }

                }
            })

        })

    }

    copyBackCameraPic() {
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
                            copyBackImageUrl: response,
                            copyBackImage: array[array.length - 1],
                            copyBackImageChange: false,
                        });
                    } else {
                        const array = response ? newPath : [];
                        const array1 = array.split('/')
                        this.setState({
                            //imageUrl: response.uri.replace('file://', ''),
                            copyBackImageUrl: newPath,
                            copyBackImage: array1[array1.length - 1],
                            copyBackImageChange: false,
                        });
                    }

                }
            })

        })

    }

    loadUsers(phrase) {
        // console.log(phrase)

        this.props.autoCompleteUsers(this.props.token, this.props.team.id, phrase).then(data => {
            // console.warn(data,token)
            this.setState({
                data: data
            })
        }).catch(err => {
            this.setState({
                data: []
            })
        });
    }

    uploadCopyBackPic() {
        var options = {
            title: 'Select Photo',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            // const pdfHelper = new pdfhelper();
            this.setState({ modalVisible: false })

            //     this.setModalVisible(!this.state.modalVisible)
            if (!response || !response.uri) return;
            if (Platform.OS === 'android') {
                const array = response.path ? response.path.split('/') : [];
                filename = array[array.length - 1];
                const pathName = 'file://' + response.path
                //             this.setState({modalVisible:!this.state.modalVisible})
                //       pdfHelper.upload(pathName, filename, false).then(data1 => {
                //  console.warn(data1.postResponse.location)
                this.setState({
                    copyBackImageUrl: 'file://' + response.path,
                    copyBackImage: 'file://' + response.path,
                    copyBackImageChange: false,
                });
                //     })

            } else {
                const array = response.uri ? response.uri.split('/') : [];
                filename = array[array.length - 1];
                const pathName = response.uri
                //                pdfHelper.upload(pathName, filename, false).then(data1 => {
                //  console.warn(data1.postResponse.location)
                this.setState({
                    copyBackImageUrl: response.uri,
                    copyBackImage: response.uri,
                    copyBackImageChange: false,
                });
                //            })

            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff', flexDirection: 'column' }}>
                <KeyboardAwareScrollView>
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
                            <View style={{ flex: 15, alignItems: 'center' }}>
                                <TouchableOpacity underlayColor={COLOR.PRIMARY} style={[styles.loginBtn, { margin: 10, alignItems: 'center', }]} onPress={async () => {

                                    if (this.state.front) {
                                        // this.setModalVisible(!this.state.modalVisible)
                                        this.uploadCopyFrontPic();
                                        //                                        this.setModalVisible(!this.state.modalVisible);

                                        // this.setModalVisible(!this.state.modalVisible)
                                        // this.copyFrontCameraPic();
                                    }
                                    else {

                                        this.uploadCopyBackPic();

                                        //                                        this.setState({modalVisible:false})
                                        //   this.copyBackCameraPic()
                                    }
                                    //                                    this.setState({modalVisible:false})

                                    // this.setModalVisible(!this.state.modalVisible)

                                }
                                }><Text style={styles.txt}>Upload from Gallery</Text>
                                </TouchableOpacity>

                                <TouchableOpacity underlayColor={COLOR.PRIMARY} style={[styles.loginBtn, { margin: 10, }]} onPress={() => {
                                    this.checkPermission().then(data => {
                                        if (this.state.front) {
                                            // this.uploadCopyBackPic();
                                            this.copyFrontCameraPic();
                                            this.setModalVisible(!this.state.modalVisible)
                                        }
                                        else {
                                            //   this.uploadBackBackPic();
                                            this.copyBackCameraPic()
                                            this.setModalVisible(!this.state.modalVisible)
                                        }

                                    })
                                }
                                }><Text style={styles.txt}>Take Photo From camera</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </Modal>
                    <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            paddingLeft: 5,
                            backgroundColor: '#fff',
                            paddingRight: 5
                        }}
                    >
                        <ScrollView style={styles.containerInner}>

                            <Autocomplete1
                                keyboardShouldPersistTaps='always'
                                underlineColorAndroid='transparent'
                                placeholderTextColor="black"

                                placeholder="Qualification"
                                data={this.state.data}
                                defaultValue={this.state.name}
                                onChange={e => {
                                    this.setState({ name: e.nativeEvent.text })

                                    this.loadUsers(e.nativeEvent.text);

                                }
                                }
                                renderItem={item => (
                                    <TouchableOpacity onPress={() => {
                                        const name = item.split(',')[0];
                                        const qualification_id = item.split(',')[1];
                                        this.setState({ name: name, qualification_id: qualification_id })
                                        this.loadUsers();
                                        // console.warn(this.state.name,this.state.qualification_id)
                                    }

                                    }>

                                        <Text style={{ padding: 2 }}>{item.split(',')[0]}</Text>
                                    </TouchableOpacity>
                                )}
                            />

                            <Wrapper>
                                <DatePicker
                                    placeholder={<Text style={{ color: 'black', fontSize: 16 }}>Date Completed</Text>}
                                    iconComponent={<Image style={{ position: 'absolute', padding: 5, right: 7, height: 15, width: 15, justifyContent: 'center' }} source={require('../../assets/images/task/date.png')} />}
                                    style={{ width: '100%' }} date={this.state.completedDate}
                                    mode="date"
                                    format="DD-MMM-YYYY" confirmBtnText="Confirm"
                                    cancelBtnText="Cancel" customStyles={{
                                        dateIcon: { position: 'absolute', right: 0, top: 4, marginLeft: 0 },
                                        dateInput: {
                                            padding: 7, justifyContent: 'flex-start',
                                            alignItems: 'flex-start', border: 'none'
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ completedDate: date }) }}
                                />
                            </Wrapper>
                            <Wrapper>

                                <DatePicker
                                    placeholder={<Text style={{ color: 'black', fontSize: 16 }}>Expiry Date</Text>}
                                    iconComponent={<Image style={{ position: 'absolute', padding: 5, right: 7, height: 15, width: 15, justifyContent: 'center' }} source={require('../../assets/images/task/date.png')} />}

                                    style={{ width: '100%' }} date={this.state.expiryDate}
                                    mode="date"
                                    format="DD-MMM-YYYY" confirmBtnText="Confirm"
                                    cancelBtnText="Cancel" customStyles={{
                                        dateIcon: { position: 'absolute', right: 0, top: 4, },
                                        dateInput: {
                                            padding: 7, justifyContent: 'flex-start',
                                            alignItems: 'flex-start', border: 'none'
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ expiryDate: date }) }}
                                />

                            </Wrapper>
                            <UploadSection style={[styles.txt]} placeholderTextColor="#000000" upload={() => {
                                this.setState({ front: true });
                                this.setModalVisible(!this.state.modalVisible);
                            }}
                                placeholder={this.state.copyFrontImage ? this.state.copyFrontImage : 'Copy Front'} image={this.state.copyFront} />
                            <UploadSection style={[styles.txt]} placeholderTextColor="#000000"
                                upload={() => {
                                    this.setState({ front: false });
                                    this.setModalVisible(!this.state.modalVisible);
                                }}

                                placeholder={this.state.copyBackImage ? this.state.copyBackImage : 'Copy Back'} image={this.state.copyBack} />
                            <Wrapper><TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' value={this.state.note} maxLength={1000} multiline={true} numberOfLines={5} onChangeText={(value) => this.handle('note', value)} style={[styles.txtInput, { height: this.state.textAreaHeight, textAlignVertical: "top" }]} placeholder="Note" /></Wrapper>
                            <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                <CheckBox isChecked={this.state.active} onClick={this.handleCheck.bind(this)}
                                    checkedImage={<Image style={{ height: 25, width: 25 }} source={require('../../assets/images/components/qual_check.png')} />}
                                    unCheckedImage={<Image style={{ height: 25, width: 25 }} source={require('../../assets/images/components/qual_uncheck.png')} />} />
                                <Text style={[styles.txt, { marginLeft: 10, color: '#000000' }]}>Active</Text>
                            </View>
                        </ScrollView>
                        <View style={styles.bottomPanel}>
                            <View style={styles.btnHolder}>
                                <TouchableHighlight style={styles.loginBtn} onPress={this.doneClicked.bind(this)}>
                                    <Text style={[styles.txt, { fontSize: 15 }]}>Done</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={[styles.loginBtn, { backgroundColor: ASSET_STYLE.doneColor }]} onPress={this.cancelClicked.bind(this)}>
                                    <Text style={[styles.txt, { fontSize: 15 }]}>Cancel</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const Wrapper = (props) => (
    <View style={[styles.wrapper, props.style]}>
        {props.children}
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 0.9, flexDirection: 'column',
        paddingLeft: 5, paddingRight: 5, backgroundColor: '#fff'
    },
    header: {
        color: '#000000',
        textAlign: 'center',
        width: Dimensions.get('window').width - 110
    },
    headerLeft: {
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
    btnHolder: {
        flex: 1
    },
    datePickerText: {
        color: '#000000',
        flex: 1,
        paddingTop: 9,
        marginLeft: 5,
        justifyContent: 'center',
        ...STYLE.bodyfontStyle
    },
    containerInner: {
        flex: 0.9,
        flexDirection: 'column'
    },
    imgContainer: {
        alignItems: 'center'
    },
    logo: {
        width: 150,
        height: 150
    },
    txtInput: {
        marginTop: 10,
        height: 50,
        ...STYLE.bodyfontStyle
    },
    loginBtn: {
        marginBottom: 10,
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    bottomPanel: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    txt: {
        color: '#FFFFFF',
        ...STYLE.bodyfontStyle
    },
    forgotPwd: {
        alignItems: 'center',
        paddingTop: 30
    },
    teamCount: {
        backgroundColor: '#083D8B',
        width: 25 * 4,
        height: 25,
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
    errorBox: {
        backgroundColor: '#FF0000'
    },
    wrapper: {
        marginTop: 15,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderWidth: 0.5,
        paddingLeft: 5,
        paddingRight: 5
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'relative',
        right: 0,
        top: 0,
        zIndex: 1,

    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        token: state.auth.token,
        team: state.company.team
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        autoCompleteUsers: (token, teamId, pharse) => { return getAutocompleteQualification(token, teamId, pharse) },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Competency);

// if (data.success) {
//     console.warn(data.result)
//     if (this.state.id) {

//         const uri = this.state.copyFrontImageUrl;
//         //uri = uri.replace('file://', '');
//         let array = this.state.copyFrontImageUrl.split('/');
//         let fileName = array[array.length - 1];
//         fileName = fileName.replace(new RegExp('%20', 'g'), '');

//         const uri1 = this.state.copyBackImageUrl;
//         //uri1 = uri1.replace('file://', '');
//         let array1 = this.state.copyBackImageUrl.split('/');
//         let fileName1 = array1[array1.length - 1];
//         fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');

//         const front=this.state.copyFrontImageUrl?{ name : 'front', filename : fileName.toString(), data: RNFetchBlob.wrap(uri)}:'';
//         const back=this.state.copyBackImageUrl?{ name : 'back', filename : fileName1.toString(), data: RNFetchBlob.wrap(uri1)}:'';                            

//         const{qualification_id,user_id}=data.result.metadata;
//         RNFetchBlob.fetch('POST', 'https://staging.cassa.io/api/user/qualificationupload', {
//             'Content-Type' : 'multipart/form-data',
//           }, [

//             {name:'user_id',data:user_id.toString()},
//             {name:'qualification_id',data:qualification_id.toString()},
//             front,
//             back

//           ]).then((resp) => {
//               console.warn('helo')
//             console.warn(resp.info())

//         this.props.showAlert('Alert', 'Update Qualification Success');
//           })
//     } else {

//         const uri = this.state.copyFrontImageUrl;
//         //uri = uri.replace('file://', '');
//         let array = this.state.copyFrontImageUrl.split('/');
//         let fileName = array[array.length - 1];
//         fileName = fileName.replace(new RegExp('%20', 'g'), '');

//         const uri1 = this.state.copyBackImageUrl;
//         //uri1 = uri1.replace('file://', '');
//         let array1 = this.state.copyBackImageUrl.split('/');
//         let fileName1 = array1[array1.length - 1];
//         fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');

//         const front1=this.state.copyFrontImageUrl?{ name : 'front', filename : fileName.toString(), data: RNFetchBlob.wrap(uri)}:'';
//         const back1=this.state.copyBackImageUrl?{ name : 'back', filename : fileName1.toString(), data: RNFetchBlob.wrap(uri1)}:'';                            

//         const{qualification_id,user_id}=data.result;

//             RNFetchBlob.fetch('POST', 'https://staging.cassa.io/api/user/qualificationupload', {
//             'Content-Type' : 'multipart/form-data',
//           }, [
//             {name:'user_id',data:data.result.user_id.toString()},
//             {name:'qualification_id',data:data.result.qualification_id.toString()},
//             front1,
//             back1

//           ]).then((resp) => {
//             console.warn('helo')
//             console.warn(resp.info())

//         this.props.showAlert('Alert', 'Add New Qualification Success');
//           });
//     }
//     this.props.navigation.state.params.callback();
//     this.props.navigation.goBack(null);
// } else {
//     if (this.state.id) {
//         this.props.showAlert('Error', 'Update Qualification Failed');
//     } else {
//         this.props.showAlert('Error', 'Add New Qualification Failed');
//     }
// }
