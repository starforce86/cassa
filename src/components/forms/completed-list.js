import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, ScrollView, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { validateEmail, alertBox } from '../../action/auth';
import { deleteForm } from '../../action/company';

import { NavigationActions } from 'react-navigation';
import { COLOR, ASSET_STYLE, STYLE } from '../../config/theme';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { completedListheaderHelper, promptBox } from '../../util/ui-helper';
import { pdfhelper } from '../../util/pdf-helper';
import { realmRepos } from '../../realm';
import CassaStatusBar from '../common/status.bar';
import CassaPrompt from '../common/cassa-prompt.view';
import moment from 'moment';
import CheckBox from 'react-native-check-box';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ImageResizer from 'react-native-image-resizer';

//import ImgToBase64 from 'react-native-image-base64';

import { readFile as read, writeFile as write } from 'react-native-fs';

class CompletedFormList extends Component {

    navigate = undefined;

    cards = [];

    tableHead = ['', 'Date', 'Details', 'Edit', 'Export'];
    //selectedList=[];

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        //console.warn(navigation.state)

        return completedListheaderHelper(params, (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            navigation.goBack(null);
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../../assets/images/forms/left-arrow.png')} />
                <Text style={[STYLE.subHeadingfontStyle, { color: '#000000' }]}>Back</Text>
            </View>
        </TouchableHighlight>),
            params.deleteForm ?
                <Text onPress={() => {

                    Alert.alert(
                        '',
                        'Are you sure you want to delete this form ?',
                        [
                            { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                            { text: 'Yes', onPress: () => params.formDelete() },
                        ],
                        { cancelable: false });

                }} style={[STYLE.subHeadingfontStyle, { color: '#000000', paddingRight: 10 }]}>Delete</Text>
                : <Text onPress={() => {
                    params.deleteFormAction();

                }
                } style={[STYLE.subHeadingfontStyle, { color: '#000000', paddingRight: 10 }]}>Edit</Text>

            , <view></view>
            , navigation);
    };

    constructor(props) {
        super(props);
        this.navigate = this.props.navigation.navigate;
        this.state = {
            id: '',
            cards: [],
            loading: false,
            showPrompt: false,
            placeholder: '',
            selectedList: [],
            deleteForm: false
        };
        this.changeDeleteForm = this.changeDeleteForm.bind(this)
        this.deleteForm = this.deleteForm.bind(this)
    }

    _selectedList() {
        return this.state.selectedList
    }

    exportChange(title) {
        const form = this.state.cards.filter(i => {
            return i.id == this.state.id;
        });

        if (form) this.generatePdf(form[0], title && title.length > 0 ? title : undefined);

    }

    generatePdf(form, title) {
        const defaultTitle = form.formName + '_' + moment(form.actualDate).format('DD-MMM-YYYY');
        //  console.warn(defaultTitle)
        const heading = title ? title : defaultTitle;
        ///   const helper = new pdfhelper();
        this.setState({
            loading: true
        });

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
                //  console.warn(photo1)

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

        //        console.warn(form)

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
                showPrompt: false,
                loading: false
            });
        })

        //  console.warn(form)
        // helper.createPdf(form, heading, { token: this.props.token, teamid: this.props.team.id }, (path1) => {
        //     //  console.warn('a'+path1)
        //     this.navigate('Export', { form: form, path: path1, name: heading });
        //     this.setState({
        //         showPrompt: false,
        //         loading: false
        //     });
        // });
    }

    export(id) {
        this.setState({
            showPrompt: true,
            id: id
        }, () => {
            const form = this.state.cards.filter(i => {
                return i.id == id;
            });
            //      console.warn(form[0].formName)
            const defaultTitle = form[0].formName + '_' + moment(form.actualDate).format('DD-MMM-YYYY');
            this.setState({
                placeholder: defaultTitle
            });
        });
    }

    edit(id, title) {
        navigate('CreateForm', { id: id, title: title });
    }

    checkErrors() {
        this.setState({ loading: true });
        return false;
    }

    userLogin() {
        if (!this.checkErrors()) {

        }
    }

    filterList(phrase) {
        const arrayFiltered = this.cards.filter(i => {
            return i.details.toLowerCase().includes(phrase.toLowerCase()) || i.formName.toLowerCase().includes(phrase.toLowerCase())
        });
        this.setState({
            cards: arrayFiltered
        });
        if (phrase && phrase === '') {
            this.setState({
                cards: this.cards
            });
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
        this.setState({
            cards: this.loadDetails()
        });
        this.cards = this.loadDetails();
        this.props.navigation.setParams({ title: this.props.team.name })
        this.props.navigation.setParams({ deleteForm: false })
        this.props.navigation.setParams({ deleteFormAction: this.changeDeleteForm });
        this.props.navigation.setParams({ formDelete: this.deleteForm });

        // this.props.navigation.setParams({ delete: this._delete });

    }

    changeDeleteForm() {
        this.setState({ deleteForm: true })
        this.props.navigation.setParams({ deleteForm: true })
    }

    loadDetails() {
        const records = realmRepos.CassaFormRepo.findAll(this.props.username);

        //        console.warn(records)
        const data = [];

        records.forEach(i => {
            //     console.warn(i.teamId, this.props.team.id)
            if (i.teamId === this.props.team.id)
                console.warn(JSON.parse(i.project))
            const form = JSON.parse(i.form);
            const project = JSON.parse(i.project);

            data.push({
                date: moment(project.date).format('DD MMM'),
                year: moment(project.date).format('YYYY'),
                details: project.name,
                formName: i.formName,
                teamId: i.teamId,
                id: i.id,
                form: form,
                project: project,
                actualDate: project.date
            });

        });
        return data;

    }

    goBack() {
        this.props.navigation.pop();
    }

    cardClicked(card) {
        navigate('CreateForm');
    }

    renderDetail(project, form) {
        //    console.warn(form)
        if (form && form.length >= 10) form = form.substring(0, 8) + '...';
        if (project && project.length >= 10) project = project.substring(0, 8) + '...';
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[styles.rowTxt, { fontSize: 14 }]}>{project}</Text>
                <Text style={[styles.rowTxt, { color: '#808080', fontSize: 12 }]}>{form}</Text>
            </View>
        )
    }

    renderActions(data, isEdit, title) {
        return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {isEdit ? <TouchableOpacity onPress={() => {
                Alert.alert(
                    'Need Update ?',
                    'If you are going to edit this task. You must sign off on the report again.',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => this.edit(data, title) },
                    ],
                    { cancelable: false });
                //this.edit.bind(this, data, title)
            }
            }><Image resizeMode="contain" style={{ height: 25, width: 25 }} source={require('../../assets/images/task/edit.png')} /></TouchableOpacity>
                : <TouchableOpacity onPress={this.export.bind(this, data)}><Image resizeMode="contain" style={{ height: 25, width: 25 }} source={require('../../assets/images/task/export.png')} /></TouchableOpacity>}
        </View>)
    }

    renderDelete(data, isEdit, title) {
        return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <CheckBox isChecked={this.state.selectedList.indexOf(data) != -1 ? true : false} onClick={() => {
                const dataExist = this.state.selectedList.filter(d => d == data)

                //  console.warn(this.state.selectedList.indexOf(data))
                if (this.state.selectedList.indexOf(data) != -1) {
                    let update = this.state.selectedList;
                    let update1 = update.filter(data1 => data1 != data)
                    //this.setState({selectedList:this.state.selectedList.filter(data1=>data1 != data)})
                    this.state.selectedList.splice(this.state.selectedList.indexOf(data), 1);

                }
                else {
                    let add = this.state.selectedList;
                    add.push(...[data]);
                    this.setState({ selectedList: add })
                }
                //  console.warn(this.state.selectedList)

            }}
                checkedImage={<Image style={{ height: 20, width: 20, borderWidth: 1, borderColor: 'grey', padding: 10 }}
                    source={require('../../assets/images/components/checked.jpg')} />}
                unCheckedImage={<Image style={{ height: 20, width: 20, borderWidth: 1, borderColor: 'grey', padding: 10 }}
                    source={require('../../assets/images/components/unchecked.jpg')} />} />
        </View>)
    }

    parseData(rows) {
        const array = [];
        this.state.deleteForm ?
            rows.forEach(i => {
                if (i.teamId === this.props.team.id) {
                    array.push([this.renderDelete(i.id, true, i.formName), this.renderDetail(i.date.toUpperCase(), i.year), this.renderDetail(i.details, i.formName), this.renderActions(i.id, true, i.formName), this.renderActions(i.id, false, i.formName)]);
                }
            })
            :
            rows.forEach(i => {
                if (this.props.team) {
                    if (i.teamId === this.props.team.id) {
                        array.push([this.renderDetail(i.date.toUpperCase(), i.year), this.renderDetail(i.details, i.formName), this.renderActions(i.id, true, i.formName), this.renderActions(i.id, false, i.formName)]);
                    }
                }
            })

        return array;
    }

    renderRows() {
        return (
            <Rows data={this.parseData(this.state.cards)} style={styles.row} textStyle={styles.rowTxt} />
        )
    }

    buildGrid() {

        const tableHead = this.state.deleteForm ? ['', 'Date', 'Details', 'Edit', 'Export'] : ['Date', 'Details', 'Edit', 'Export'];
        return (
            <View style={{ marginTop: 10 }}>
                <Table borderStyle={{borderWidth: 0, borderColor: 'transparent'}}>
                    <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableHeadTxt} />
                    {this.renderRows()}
                </Table>
            </View>
        )
    }

    deleteForm() {
        this.state.selectedList.map(id => {
            realmRepos.CassaFormRepo.delete(id)
        })

        this.props
            .navigation
            .dispatch(NavigationActions.reset(
                {
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'CompletedList' })
                    ]
                }));

    }

    render() {
        if (this.state.loading) {
            return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator animating={true}
                color={COLOR.PRIMARYDARK}
                size="large" /></View>);
        }
        return (
            <View style={styles.container} >
                <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                <View style={styles.containerInner}>
                    <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <View style={styles.searchContainer}>
                            <Image style={{ height: 20, width: 20 }} source={require('../../assets/images/forms/search.png')} />
                            <TextInput underlineColorAndroid='transparent' style={[styles.txt, { flex: 1, marginLeft: 5 }]} placeholder="Search" placeholderTextColor={COLOR.PRIMARYDARK} onChangeText={this.filterList.bind(this)} />
                        </View>
                    </View>
                    <ScrollView>{this.buildGrid()}</ScrollView>
                </View>
                <CassaPrompt placeholder={this.state.placeholder} num={1} 
                cancelText="CANCEL" 
                submitText="OK" 
                onSubmit={this.exportChange.bind(this)}  title="Change Pdf name" show={this.state.showPrompt} onCancel={() => {
                    this.setState({
                        showPrompt: false
                    })
                }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1, flexDirection: 'column'
    },
    rowTxt: {
        color: '#000000',
        textAlign: 'center',
        ...STYLE.bodyfontStyle
    },
    row: { 
        borderWidth: 0,
        height: 50 
    },
    tableHead: {
        backgroundColor: ASSET_STYLE.containerBg,
        height: 50,
    },
    tableHeadTxt: {
        color: COLOR.PRIMARYDARK,
        textAlign: 'center',
        ...STYLE.tableHeadingfontStyle
    },
    header: {
        padding: 10
    },
    containerInner: {
        alignSelf: 'stretch'
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
        team: state.company.team,
        username: state.auth.username,
        firstName: state.auth.firstName,
        lastName: state.auth.lastName,
        deleteForm: state.company.deleteForm

    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        validateEmail: (email) => { return validateEmail(email); },
        deleteForm1: (data) => { return deleteForm(data); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompletedFormList);