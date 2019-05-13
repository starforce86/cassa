import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, ScrollView, Dimensions, Picker, TouchableOpacity, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { login, validateEmail, alertBox } from '../../action/auth';
import { COLOR, ASSET_STYLE, STYLE } from '../../config/theme';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import AutoCompletePicker from '../common/picker.view';
import { dynamicComponentRender, headerHelper } from '../../util/ui-helper';
import { pdfhelper } from '../../util/pdf-helper';
import { realmRepos, realmModels } from '../../realm/index';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import CassaStatusBar from '../common/status.bar';
import CassaPrompt from '../common/cassa-prompt.view';
import SinglePicker from 'mkp-react-native-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CompanyApi from '../../api/company'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import DatePicker from 'react-native-datepicker'

class CreateContractorForm extends Component {

    navigate = undefined;

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        return headerHelper(params, (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            if (params['formEdited']) {
                Alert.alert(
                    'You have some unsaved data',
                    'Are you sure, you want to exit',
                    [
                        { text: 'NO', onPress: () => console.log('Cancel Pressed') },
                        { text: 'YES', onPress: () => navigation.goBack(null) }
                    ],
                    { cancelable: false }
                )
            } else {
                navigation.goBack(null);
            }
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
            completed: false,
            showPrompt: false,
            project: {
                name: '',
                date: new Date(),
                dateText: moment(new Date()).format('DD-MMM-YYYY'),
                address: '',
                note: '',
                options: []
            },
            loading: false,
            placeholder: '',
            form: [],
            textAreaHeight: 0
        };
    }

    checkErrors() {
        if (this.state.project && !this.state.project.name) {
            this.props.showAlert("Mandatory field required", "Project name is a mandatory field");
            return true;
        }
        /*const filtered = this.props.formDetail.filter(i => {
            return i.input_name === 'signature';
        })
        if (filtered && filtered.length > 0) {
            let flag = false;
            filtered.forEach(i => {
                if (this.props.navigation.state.params['formEdited'] && 
                i.value && i.value.length > 0) {
                    i.value[0].zature = '';
                    flag = true;
                }
            });
            if(flag) this.props.showAlert("Alert", "Please sign it again as you have updated the form !");
            return flag;
        }*/
        return false;
    }

    submitForm() {
        if (!this.checkErrors()) {
            const id = this.props.navigation.state.params['id'];
            if (!id) {
                const form = new realmModels.CassaForm(this.props.username, this.props.team.id,
                    JSON.stringify(this.state.form), "", JSON.stringify(this.state.project), this.state.project.date,
                    this.state.project.name, '', this.props.navigation.state.params.title ? this.props.navigation.state.params.title : '');
                realmRepos
                    .CassaFormRepo
                    .save(form);
                this.props.showAlert("Success", "Your form has been successfully saved");
                this.props
                    .navigation
                    .dispatch(NavigationActions.reset(
                        {
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'CompletedList' })
                            ]
                        }));
            } else {
                this.updateForm(id);
                this.props
                    .navigation
                    .dispatch(NavigationActions.reset(
                        {
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'CompletedList' })
                            ]
                        }));
                //                
            }
        }
    }
    updateForm(id) {
        const form = new realmModels.CassaForm(this.props.username, this.props.team.id,
            JSON.stringify(this.state.form), "", JSON.stringify(this.state.project), this.state.project.date,
            this.state.project.name, '',
            this.props.navigation.state.params.title ? this.props.navigation.state.params.title : '');
        form.id = id;
        realmRepos
            .CassaFormRepo
            .update(form, () => {

            });
    }

    loadProject(id) {

        const record = realmRepos.CassaFormRepo.findOne(id);
        console.log("record", record)
        const form = record.form ? JSON.parse(record.form) : [];

        const a = record.form ? JSON.parse(record.form) : [];
        //console.warn(a)
        const b = a.map(d => {
            if (d.input_name === "signature") {
                d.value = ''
            }
            return d;
        })
        // console.warn(b)

        const project = record.project ? JSON.parse(record.project) : {
            name: '',
            date: new Date(),
            dateText: moment(new Date()).format('DD-MMM-YYYY'),
            address: '',
            note: '',
            options: []
        };
        project.date = new Date(project.dateText);

        this.setState({
            form: a,
            project: project,
            loading: false
        });
    }

    doneAndExport() {

        if (!this.checkErrors()) {
            const id = this.props.navigation.state.params['id'];

            if (!id) {
                const form = new realmModels.CassaForm(this.props.username, this.props.team.id,
                    JSON.stringify(this.state.form), "", JSON.stringify(this.state.project), this.state.project.date,
                    this.state.project.name, '', this.props.navigation.state.params.title ? this.props.navigation.state.params.title : '');
                realmRepos
                    .CassaFormRepo
                    .save(form);
                this.setState({ completed: !this.state.completed })
            } else {
                this.updateForm(id);
                this.setState({ completed: !this.state.completed })
                //                this.props.navigation.goBack(null);

            }
            this.setState({
                showPrompt: true
            }, () => {
                const defaultTitle = (this.props.navigation.state.params.title ? this.props.navigation.state.params.title : '') + '_' + moment(new Date()).format('DD-MMM-YYYY');
                this.setState({
                    placeholder: defaultTitle
                });
            });
        }
    }

    handleProject(key, value) {

        this.state['project'][key] = value;
        this.setState({
            ...this.state
        });

    }

    componentWillUpdate(props, state) {
        if (state && state !== this.state) {
            this.props.navigation.setParams({ formEdited: true });
        }
    }

    async componentWillMount() {

        this.setState({
            textAreaHeight: Dimensions.get('window').height / 7
        });
        const id = this.props.navigation.state.params['id'];
        if (id) {

            this.loadProject(id);
        } else {
            //this.populateDates();
            this.setState({ form: this.props.formDetail });
            
            this.props.projects.map(i => {
                //   console.warn(i)
                if (i && i.name) {
                    this.state.project.options.push({
                        key: i.name,
                        value: i.name,
                        address: i.address
                    });
                }
            })
        }
    }

    populateDates() {
        this.props.formDetail.forEach(i => {
            if (i.input_name === 'date') {
                if (!i.date) {
                    i.date = new Date();
                    i.dateText = moment(new Date()).format('DD-MMM-YYYY');
                }
            }
        });
    }

    datePickerMainFunctionCall = () => {
        let DateHolder = this.state.project.date;
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
        this.state['project'].date = date;
        this.state['project'].dateText = moment(date).format('DD-MMM-YYYY');
        this.setState({
            ...this.state
        });
    }

    exportChange(title) {
        if (this.state.form && this.state.project)
            this.generatePdf({
                form: this.state.form,
                project: this.state.project,
                formName: this.props.navigation.state.params.title ? this.props.navigation.state.params.title : '',
            }, title && title.length > 0 ? title : undefined);
    }

    generatePdf(form, title) {
        const id = this.props.navigation.state.params['id'];
        //console.log(this.props.navigation.state.params.title)
        const defaultTitle = (this.props.navigation.state.params.title ? this.props.navigation.state.params.title : '') + '_' + moment(form.project.date).format('DD-MMM-YYYY');
        const heading = title ? title : defaultTitle;
        // const helper = new pdfhelper();
        this.setState({
            loading: true
        });

        //  console.log(form)

        this.setState({ completed: !this.state.completed })

        const getPropAdv = (props, def) => {
            return props.reduce((val, prop) => {
                if (val) {
                    return val = val[prop] || def || undefined
                }
                else
                    return val = def || undefined
            });
        }
        const getDate = (date) => {
            if (!date) return ``;
            else {
                var addZero = (date) => {
                    if (date < 10) return `0${date}`
                    else return `${date}`
                }
                let d = new Date(date);
                return formattedDate = `${addZero(d.getDate())}-${[0, 'Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]}-${d.getUTCFullYear()}`
            }
        }

        const getActions = (action) => {
            if (action) {
                let actionOutput = `
            <tr class="tr">
                <td>ACTION CATEGORY</td>
                <td colspan="2">${action.category || ''}</td>
            </tr>
            <tr class="tr">
                <td>DETAILS OF THE ISSUE</td>
                <td colspan="2">${action.detail || ''}</td>
            </tr>
            <tr class="tr">
                <td>ACTION TO BE TAKEN</td>
                <td colspan="2">${action.actionToBeTaken || ''}</td>
            </tr>
            <tr class="tr">
                <td>COMPANY / CONTRACTOR</td>
                <td colspan="2">${action.company || ''}</td>
            </tr>
            <tr class="tr">
                <td>RESPONSIBLE PERSON</td>
                <td colspan="2">${action.person || ''}</td>
            </tr>
            <tr class="tr">
                <td>DATE TO BE CLOSED OUT BY</td>
                <td colspan="2">${action.dateText || ''}</td>
            </tr>
        `;
                let temp = `
        `
                return actionOutput
            }
            else return ``
        }

        const createFields = (fields) => {
            if (fields && fields.length) {
                return fields.map((field) => {

                    if (field.input_name === 'date') {
                        field.value = `${getDate(field.value)}`
                        //        console.log(field.value);
                    }

                    if (field.input_name === "note" || field.input_name === "heading_category") {
                        return `
                <table style=" table-layout: fixed; border-collapse: collapse; width: 100%;">
                    <tr> 
                        <td class="td" colspan="3">${field.input_field_question || ``}</td>
                    </tr>
                </table>
		        <br>
                `
                    }
                    else if (field.input_name === "signature") {
                        let signatures = mapSignatures(field.value);
                        //   console.log(signatures)
                        let finalValue = `
                <table style="table-layout: fixed; border-collapse: collapse; width: 100%;">
                    <tr class="tr" >
                        <td class="td" colspan="3">
                            <h2>${field.input_field_question || ``}</h2>
                            <div style="display:flex; flex-direction: row; flex-wrap: wrap; justify-content: space-around;">
                                ${signatures}
                            </div>
                        </td>
                    </tr>
                </table>
		        <br>
                `
                        return finalValue;
                    }
                    else {
                        return `
                <table style=" table-layout: fixed; border-collapse: collapse; width: 100%;" class="table">
                    <tr class"tr">
                        <td class="td"><p style="overflow-wrap:break-word">${field.input_field_question || ``}</p></td>
                        <td class="td"><p style="overflow-wrap:break-word">${field.value || ``}</p></td>
                        <td class="td"><p style="overflow-wrap:break-word">${field.comments || ``}</p></td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <div style="display:flex; flex-direction: row; flex-wrap: wrap; justify-content: space-around; align-items: flex-start">
                                ${ mapPhotos(field.photo || ``)}
                            </div>
                        </td>
                        ${getActions(field.action)}
                    </tr>
                </table>
		        <br>
                `
                    }
                }).reduce((final, row) => final + row);
            }
            else return ``
        }

        const mapPhotos = (photos) => {

            if (photos && photos.length) {

                // const b = photos.map(async (photo) => {

                //     const d = await ImgToBase64.getBase64String(src);
                //     console.warn(d)
                //     photo.src = d
                //     return { src: photo.src };

                // })
                // console.warn(b)
                const photo1 = photos.map((photo) => {
                    // const src = Platform.OS === 'android' ? ('file://' + photo.src) : photo.src.replace('file://', '')

                    // const d = await ImgToBase64.getBase64String(src);
                    // console.log(d)

                    return `<img style="width: 150px; height: 200px; max-width: 200px; padding-top: 5px; margin-right: auto" src="data: image/png;base64,${photo.src}" alt="">`

                }).reduce((final, row) => final + row);
                //                console.warn(photo1)

                return photo1;

            }
            else return ``
        }

        const mapSignatures = (signatures) => {
            if (signatures && signatures.length) {
                return signatures.map((signature) => {
                    return `   <div>
                    <img style="width: 180px; height: 200px; max-width: 200px; padding-top: 5px; margin-right: auto" src="data: image/png;base64,${signature.signature}" alt="">

                    <h3>${signature.name}</h3>
                </div>
            `
                }).reduce((final, row) => final + row);
            }
            else return ``
        }
        //      console.warn(form)

        //    console.warn(getPropAdv([form, 'companyUrl'], ' '))

        let options = {

            fileName: `${heading}`,
            directory: 'docs',
            html: `
  <head>
    <meta charset="utf-8">
    <title>test pdf</title>
    <style type="text/css">

    @media print {
        tr.vendorListHeading {
            -webkit-print-color-adjust: exact;
        }
    }

    table, tr {
        page-break-inside: avoid !important;
    }

    html * {
        margin: 0px;
        font-size: 1em !important;
        color: #000 !important;
        font-family: Arial !important;
    }

	@media print {
  	@page { margin: 0; }
 }
       /* @page { size:8.5in 11in; margin: 2cm } */
       /* table { page-break-inside : avoid } */
    </style>
    <style>
        .table, .td, .tr {
            border: 1px solid black;
        }
        .table {
            width: 600px;
            /*margin-left: 30%;*/
        }
        .tr {
            height: 50px;
        }
	.td{
	    padding: 1cm 0.5cm;
	}
        .center {
            text-align: center;
            width: 600px;
            margin-top: 10%;
        }
    </style>
  </head>
  <body>
    <div id="border" style="border-color: black; margin: 0.05cm auto; position: relative; top: 0.05cm; width: 19cm; height: 25.3cm; border-width: 2px; border: solid;">

        <div style="display: block; margin: 1cm auto; width: fit-content; max-width:18cm; font-size: 30pt !important">
            <h5 style="float:left; line-height: 1.5;font-size:1.2cm !important; font-weight: 100">${this.props.team.name.toUpperCase()}</h5>
          </div>  
        <div style="display: block; margin: 0.7cm auto; width: fit-content; max-width:18cm; font-size: 30pt !important">
              <img style='height: 110px;' src='${this.props.team.photo_url}' />
        </div>
	
        <h3 style="display: block; margin: 1cm auto 0 auto; width: 18cm; word-break:break-word; test-align: center !important; font-size: 1cm !important; text-align:center; ">${getPropAdv([form, 'form', 0, 'form_name'], ' ').toUpperCase()}</h3>

        <div style="display: block; width: 600px; margin: 1cm auto">
            <table class="table" style="display: block; width: fit-content  ; margin: 0 auto; border-collapse: collapse">
                <tr class="tr">
                    <td class="td" style="min-width:200px" >DOCUMENT ID :</td>
                    <td class="td" style="min-width:300px">${heading.toUpperCase()}</td>
                </tr>
                <tr class="tr">
                    <td class="td">COMPLETED BY:</td>
                    <td class="td">${this.props.firstName.toUpperCase()}  ${this.props.lastName.toUpperCase()} </td>
                </tr>
                <tr class="tr">
                    <td class="td">DATE :</td>
                    <td class="td">${getPropAdv([form, 'project', 'dateText'], ' ').toUpperCase()}</td>
                </tr>
                <tr class="tr">
                    <td class="td">LOCATION :</td>
                    <td class="td">${getPropAdv([form, 'project', 'name'], ' ').toUpperCase()}</td>
                </tr>
                <tr class="tr">
                    <td class="td">NOTES :</td>
                    <td class="td">${getPropAdv([form, 'project', 'note'], ' ').toUpperCase()}</td>
                </tr>
            </table>
        </div>
    </div>
    <!-- <style>
            .headerBg {
                width: 100%;
                margin-top: 50%;
                background-color: #868584;
            }
            .table-specific {
                margin-left: 0!important;
                width: 100%;
            }
            .tr-specific {
                width: 100%;
                height: 50px;
            }
            .headerrow {
                width: 100%;
            }
            .headercol {
                width: 33.33%;
                font-size: 30px;
                padding-left: 10%;
                font-family: 'Raleway-Medium';
            }
        </style>  -->
        <div style=" margin: 45px auto; position: relative; top: 0.2cm; width: 19cm; height: 28.7cm; ">
                <table style="background-color: #808080; width: 100%;" class="table">
                        <tr class="tr">
                            <th class="th">QUESTIONS</th>
                            <th class- "th">RESPONSE</th>
                            <th class="th">DETAILS</th>
                        </tr>
                    </table>
            ${createFields(form.form)}
        </div>
    </body>    
    `
        }

        RNHTMLtoPDF.convert(options).then(file => {
            const array = file.filePath.split('/');
            //        this.navigate('Export1', { form: form, path: file.filePath, name: 'aaa' });

            this.navigate('Export', { path: file.filePath, name: array[array.length - 1], profile: false, form: form });

            this.setState({
                loading: false
            });

        })

        // helper.createPdf(form, heading, { token: this.props.token, teamid: this.props.team.id }, (path) => {
        //     this.setState({
        //         showPrompt: false,
        //         loading: false
        //     }, () => {
        //         this.props
        //             .navigation.navigate('Export', { form: form, path: path, name: heading });

        //         // this.props
        //         //     .navigation
        //         //     .dispatch(NavigationActions.reset(
        //         //         {
        //         //             index: 1,
        //         //             actions: [
        //         //                 NavigationActions.navigate({ routeName: id ? 'CompletedList' : 'NewList' }),
        //         //                 NavigationActions.navigate({ routeName: 'Export', params: { form: form, path: path, name: heading } })
        //         //             ]
        //         //         }));
        //     });
        // });
    }

    render() {
        console.log("state",this.state)
        if (this.state.loading) {
            return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator animating={true}
                color={COLOR.PRIMARYDARK}
                size="large" /></View>);
        }

        return (
            <View style={styles.container}>
                <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                <View style={styles.containerInner}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
                            <Text style={[styles.txt, { color: '#000000' }]}>Project/Workplace name</Text>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={[{ flex: 1, flexDirection: 'row' }, styles.wrapper]}>
                                    <TextInput underlineColorAndroid='transparent' value={this.state.project.name} onChangeText={(value) => this.handleProject('name', value)} style={[{ flex: 1 }, styles.txtInput, { marginTop: 0 }]} />
                                    <TouchableOpacity
                                        style={{ justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => {
                                            if (this.state.project.options.length > 0) {

                                                this.singlePicker.show();
                                            }
                                        }}>
                                        <Image resizeMode="contain" style={{ width: 15, height: 15, marginRight: 5 }} source={require('../../assets/images/components/down-arrow.png')} />
                                    </TouchableOpacity>
                                </View>
                                <SinglePicker
                                    buttonCancelStyle={{ marginLeft: 5, color: COLOR.PRIMARYDARK, ...STYLE.subHeadingfontStyle }}
                                    buttonAcceptStyle={{ marginRight: 5, color: COLOR.PRIMARYDARK, ...STYLE.subHeadingfontStyle }}
                                    headerStyle={{display:'flex', minHeight:40, backgroundColor:'white'}}
                                    style={{ justifyContent: 'flex-end', backgroundColor: 'white' }}
                                    lang="en-US"
                                    ref={ref => this.singlePicker = ref}
                                    onSelect={(option) => {
                                        //   console.warn(option)
                                        if (option) {
                                            this.handleProject('name', option.key);
                                            this.handleProject('address', option.address)
                                            // this.setState({ project: { address: option.address } })
                                        }
                                    }}

                                    options={this.state.project.options ? this.state.project.options : []}
                                >
                                </SinglePicker>
                            </View>
                            <DatePickerDialog ref="datePicker" onDatePicked={this.onDatePickedFunction.bind(this)} />
                            <Wrapper><TouchableOpacity onPress={this.datePickerMainFunctionCall.bind(this)} >
                                <View style={styles.datePickerBox}>
                                    <Text style={[styles.datePickerText]}>{(this.state.project && this.state.project.dateText) ? this.state.project.dateText : 'Date'}</Text>
                                    <Image style={{ width: 15, height: 15, justifyContent: 'center' }} source={require('../../assets/images/task/date.png')} />
                                </View>
                            </TouchableOpacity></Wrapper>

                            <Wrapper>
                                <TextInput placeholderTextColor="#000000"
                                    underlineColorAndroid='transparent' value={this.state.project.address}
                                    maxLength={1000} multiline={true} numberOfLines={5}
                                    onChangeText={(value) => this.handleProject('address', value)}
                                    style={[styles.txtInput, { height: this.state.textAreaHeight, textAlignVertical: "top" }]}
                                    placeholder="Address" /></Wrapper>
                            <Wrapper>
                                <TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent'
                                    value={this.state.project.note} maxLength={1000} multiline={true}
                                    numberOfLines={5} onChangeText={(value) => this.handleProject('note', value)}
                                    style={[styles.txtInput, { height: this.state.textAreaHeight, textAlignVertical: "top" }]}
                                    placeholder="Notes" /></Wrapper>
                        </View>
                        <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5, marginTop: 5 }}></View>
                        {dynamicComponentRender(this.props.formDetail, this)}
                        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                            <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.doneButton} onPress={this.submitForm.bind(this)}>
                                <Text style={styles.txt}>Done</Text>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor={COLOR.PRIMARY} style={styles.doneAndExport} onPress={this.doneAndExport.bind(this)}>
                                <Text style={styles.txt}>Done & Export</Text>
                            </TouchableHighlight>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <CassaPrompt num={1} cancelText="CANCEL" submitText="OK" onSubmit={this.exportChange.bind(this)} placeholder={this.state.placeholder} title="Change Pdf name" show={this.state.showPrompt} onCancel={() => {
                    this.setState({
                        showPrompt: false
                    })
                }} />
            </View>
        );
    }

    shareData(type, key, data) {
        this.state.form[key][type] = data;
        this.setState(this.state);
    }

    actionClick(event) {
        const params = this.props.navigation.state.params || {};
        navigate('Action', { prevTitle: params.title, shareData: this.shareData.bind(this), data: event });
    }

    photoClick(event) {
        const params = this.props.navigation.state.params || {};
        navigate('Photo', { prevTitle: params.title, shareData: this.shareData.bind(this), data: event });
    }
}

const Wrapper = (props) => (
    <View style={styles.wrapper}>
        {props.children}
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff'
    },
    datePickerBox: {
        marginTop: 9,
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
        paddingTop: 9,
        marginLeft: 5,
        justifyContent: 'center',
        ...STYLE.bodyfontStyle
    },
    containerInner: {
        flex: 1,
        alignSelf: 'stretch'
    },
    imgContainer: {
        alignItems: 'center'
    },
    logo: {
        width: 150,
        height: 150
    },
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
    txtInput: {
        ...STYLE.bodyfontStyle,
        ...Platform.select({
            ios: {
                flex: 1,
                paddingLeft: 5
            }
        })
    },
    loginBtn: {
        marginTop: 30,
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    doneButton: {
        marginTop: 30,
        backgroundColor: ASSET_STYLE.doneColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },

    doneAndExport: {
        marginTop: 30,
        backgroundColor: ASSET_STYLE.doneColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 30
    },
    txt: {
        color: '#FFFFFF',
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
    return {
        team: state.company.team,
        token: state.auth.token,
        formDetail: state.company.formDetail,
        username: state.auth.username,
        projects: state.company.clientProjects,
        firstName: state.auth.firstName,
        lastName: state.auth.lastName,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        validateEmail: (email) => { return validateEmail(email); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateContractorForm);