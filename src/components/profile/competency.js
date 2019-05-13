import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, ScrollView, Dimensions, Picker, Modal, TouchableOpacity, Text, TextInput, View, Button, PermissionsAndroid, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { login, validateEmail, alertBox } from '../../action/auth';
import { getAutocompleteCompetency } from '../../action/lookup';
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
        params.title = params.title + ' Competency';
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
            copyFrontImageChange: false,
            copyBackImageUrl: '',
            copyBackImage: '',
            copyBackImageChange: false,
            qualification_id: 0,
            data: [],
            hideAutoComplete: false,
            person: '',
            modalVisible: false,
            front: true
        };
    }

    checkErrors() {
        return false;
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
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

    doneClicked() {
        //        console.warn(this.state.qualification_id)
        AuthApi.createCompetency(this.props.token, this.state, this.state.id ? false : true).then(
            data => data.json()
        ).then(
            data => {
                //              console.warn(data.result)
                if (data.success) {
                    if (this.state.id) {
                        const uri = this.state.copyFrontImage;
                        uri = uri.replace('file://', '');
                        let array = this.state.copyFrontImage.split('/');
                        let fileName = array[array.length - 1];
                        fileName = fileName.replace(new RegExp('%20', 'g'), '');

                        const uri1 = this.state.copyBackImage;
                        uri1 = uri1.replace('file://', '');
                        let array1 = this.state.copyBackImage.split('/');
                        let fileName1 = array1[array1.length - 1];
                        fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');

                        //    if(this.state.copyBackImageChange && this.state.copyBackImageChange ){ 
                        console.warn(RNFetchBlob.wrap(uri1))

                        RNFetchBlob.fetch('POST', 'https://app.cassa.io/api/user/qualificationupload', { 'Content-Type': 'multipart/form-data' },
                            [{ name: 'user_id', data: data.result.metadata.user_id.toString() }, {
                                name: 'qualification_id',
                                data: data.result.metadata.qualification_id.toString()
                            }, {
                                name: 'front', filename: this.state.copyFrontImageChange ? fileName.toString() : '',
                                data: this.state.copyFrontImageChange ? RNFetchBlob.wrap(uri) : ''
                            }, {
                                name: 'back', filename: this.state.copyBackImageChange ? fileName1.toString() : '',
                                data: this.state.copyBackImageChange ? RNFetchBlob.wrap(uri1) : ''
                            }
                            ]).then((resp) => {
                                this.props.showAlert('Alert', 'Update Competency Success');
                                this.props.navigation.state.params.callback();
                                this.props.navigation.goBack(null);
                            })

                    } else {
                        const uri = this.state.copyFrontImage;
                        uri = uri.replace('file://', '');
                        let array = this.state.copyFrontImage.split('/');
                        let fileName = array[array.length - 1];
                        fileName = fileName.replace(new RegExp('%20', 'g'), '');

                        const uri1 = this.state.copyBackImage;
                        uri1 = uri1.replace('file://', '');
                        let array1 = this.state.copyBackImage.split('/');
                        let fileName1 = array1[array1.length - 1];
                        fileName1 = fileName1.replace(new RegExp('%20', 'g'), '');

                        RNFetchBlob.fetch('POST', 'https://app.cassa.io/api/user/qualificationupload', {
                            'Content-Type': 'multipart/form-data',
                        }, [{ name: 'user_id', data: data.result.user_id.toString() },
                        { name: 'qualification_id', data: data.result.qualification_id.toString() },
                        { name: 'front', filename: this.state.copyFrontImage ? fileName.toString() : '', data: this.state.copyFrontImage ? RNFetchBlob.wrap(uri) : '' },
                        { name: 'back', filename: this.state.copyBackImage ? fileName1.toString() : '', data: this.state.copyBackImage ? RNFetchBlob.wrap(uri1) : '' }

                            ]).then((resp) => {
                                // console.warn('helo')
                                // console.warn(resp.info())
                                this.props.showAlert('Alert', 'Add New Competency Success');

                                this.props.navigation.state.params.callback();
                                this.props.navigation.goBack(null);
                            })
                    }
                } else {
                    if (this.state.id) {
                        this.props.showAlert('Error', 'Update Competency Failed');
                    } else {
                        this.props.showAlert('Error', 'Add New Competency Failed');
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
        const competency = this.props.navigation.state.params.competency;
        // console.warn(competency)

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
        ImagePicker.launchImageLibrary(options, (response) => {
            // const pdfHelper = new pdfhelper();
            this.setState({ modalVisible: false })

            if (!response || !response.uri) return;
            if (Platform.OS === 'android') {
                const array = response.path ? response.path.split('/') : [];
                filename = array[array.length - 1];
                const pathName = 'file://' + response.path
                //                pdfHelper.upload(pathName, filename, false).then(data1 => {
                //   console.warn(data1.postResponse.location)
                this.setState({
                    copyFrontImageUrl: 'file://' + response.path,
                    copyFrontImage: 'file://' + response.path,
                    copyFrontImageChange: true
                });
                //              })

            } else {
                const array = response.uri ? response.uri.split('/') : [];
                filename = array[array.length - 1];
                const pathName = response.uri
                // pdfHelper.upload(pathName, filename, false).then(data1 => {
                // console.warn(data1.postResponse.location)
                this.setState({
                    copyFrontImageUrl: response.uri,
                    copyFrontImage: response.uri,
                    copyFrontImageChange: true
                });
                //})
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
                            copyFrontImage: response,
                            copyFrontImageChange: true
                        });
                    } else {
                        const array = response ? newPath : [];
                        const array1 = array.split('/')
                        this.setState({
                            //imageUrl: response.uri.replace('file://', ''),
                            copyFrontImageUrl: newPath,
                            copyFrontImage: newPath,
                            copyFrontImageChange: true
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
                    //    console.warn(response)
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
                            copyBackImage: response,
                            copyBackImageChange: true
                        });
                    } else {
                        const array = response ? newPath : [];
                        const array1 = array.split('/')
                        //    console.warn(response)
                        this.setState({
                            //imageUrl: response.uri.replace('file://', ''),
                            copyBackImageUrl: newPath,
                            copyBackImage: newPath,
                            copyBackImageChange: true
                        });
                    }

                }
            })

        })

    }

    loadUsers(phrase) {
        this.props.autoCompleteUsers(this.props.token, this.props.team.id, phrase).then(data => {
            // console.warn(data)
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

            if (!response || !response.uri) return;
            if (Platform.OS === 'android') {
                const array = response.path ? response.path.split('/') : [];
                filename = array[array.length - 1];
                const pathName = 'file://' + response.path
                //pdfHelper.upload(pathName, filename, false).then(data1 => {
                //  console.warn(data1.postResponse.location)
                this.setState({
                    copyBackImageUrl: 'file://' + response.path,
                    copyBackImage: 'file://' + response.path,
                    copyBackImageChange: true
                });
                //})

            } else {
                const array = response.uri ? response.uri.split('/') : [];
                filename = array[array.length - 1];
                const pathName = response.uri
                //pdfHelper.upload(pathName, filename, false).then(data1 => {
                //  console.warn(data1.postResponse.location)
                this.setState({
                    copyBackImageUrl: response.uri,
                    copyBackImage: response.uri,
                    copyBackImageChange: true
                });
                // })

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
                            <View styel={{ flex: 15, alignItems: 'center' }}>
                                <TouchableOpacity underlayColor={COLOR.PRIMARY} style={[styles.loginBtn, { margin: 10, alignItems: 'center', }]} onPress={() => {

                                    if (this.state.front) {
                                        this.uploadCopyFrontPic();
                                        // this.setModalVisible(!this.state.modalVisible)
                                        // this.copyFrontCameraPic();
                                    }
                                    else {
                                        this.uploadCopyBackPic();
                                        //this.setModalVisible(!this.state.modalVisible)
                                        //   this.copyBackCameraPic()
                                    }

                                }
                                }><Text style={styles.txt}>Upload from Gallery</Text></TouchableOpacity>

                                <TouchableOpacity underlayColor={COLOR.PRIMARY} style={[styles.loginBtn, { margin: 10, }]} onPress={() => {
                                    this.checkPermission().then(data => {
                                        if (this.state.front) {
                                            // this.uploadCopyBackPic();
                                            this.copyFrontCameraPic();
                                            this.setModalVisible(!this.state.modalVisible)
                                        }
                                        else {
                                            //   this.uploadBackBackPic();
                                            this.copyBackCameraPic();
                                            this.setModalVisible(!this.state.modalVisible)

                                        }

                                    })
                                }
                                }><Text style={styles.txt}>Take Photo From camera</Text></TouchableOpacity>

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
                                underlineColorAndroid='transparent'
                                placeholderTextColor="black"
                                placeholder="Competency"
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
                                        //                                    console.warn(this.state.name, this.state.qualification_id)
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
                            }} placeholder={this.state.copyFrontImage ? this.state.copyFrontImage : 'Copy Front'} image={this.state.copyFront} />
                            <UploadSection style={[styles.txt]} placeholderTextColor="#000000" upload={() => {
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
        autoCompleteUsers: (token, teamId, pharse) => { return getAutocompleteCompetency(token, teamId, pharse) },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Competency);

// <Wrapper>
//                             <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' value={this.state.name} onChangeText={(value) => this.handle('name', value)} style={[styles.txtInput]} placeholder="Add Name" /></Wrapper>

// <DatePickerDialog ref="datePicker" onDatePicked={this.onDatePickedFunction.bind(this, 'completed')} />

// <Wrapper style={{
//     marginBottom: 10
// }}><TouchableOpacity onPress={this.datePickerMainFunctionCall.bind(this, 'completed')} >
//         <View style={styles.datePickerBox}>
//             <Text style={[styles.datePickerText]}>{(this.state && this.state.completedDateText) ? this.state.completedDateText : 'Date completed'}</Text>
//             <Image style={{ height: 20, width: 20, justifyContent: 'center' }} source={require('../../assets/images/task/date.png')} />
//         </View>
//     </TouchableOpacity></Wrapper>
// <DatePickerDialog ref="datePicker2" onDatePicked={this.onDatePickedFunction.bind(this, 'expiry')} />
// <Wrapper style={{
//     marginBottom: 10
// }}><TouchableOpacity onPress={this.datePickerMainFunctionCall.bind(this, 'expiry')} >
//         <View style={styles.datePickerBox}>
//             <Text style={[styles.datePickerText]}>{(this.state && this.state.ExpiryDateText) ? this.state.ExpiryDateText : 'Expiry date'}</Text>
//             <Image style={{ height: 20, width: 20, justifyContent: 'center' }} source={require('../../assets/images/task/date.png')} />
//         </View>
//     </TouchableOpacity></Wrapper>

// <Wrapper style={{marginBottom:this.state.data.length>1 && !this.state.hideAutoComplete?125:15}}>
// <Autocomplete
//     placeholder='Competency Name'
//     placeholderTextColor="#000000"
//     style={[styles.txtInput]}
//     data={this.state.data}
//     hideResults={this.state.hideAutoComplete}
//     defaultValue={this.state.name}
//     onChangeText={(value) => {
//         this.handle('name', value);
//         this.handle('qualification_id',0)
//         this.loadUsers(value);
//         this.setState({
//             hideAutoComplete: false
//         });
//     }}
//     renderItem={item => (
//         <TouchableOpacity onPress={() => {
//             this.handle('name', item.split(',')[0]);
//             this.handle('qualification_id', item.split(',')[1]);
//             this.setState({
//                 hideAutoComplete: true
//             })
//         }}>
//             <View style={{zIndex:1,backgroundColor:'#ffffff'}}><Text>{item.split(',')[0]}</Text></View>
//         </TouchableOpacity>
//     )}
// />
// </Wrapper>
