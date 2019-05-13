import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, ScrollView, Dimensions, Picker, KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { login, validateEmail, alertBox } from '../../action/auth';
import { getContractors } from '../../action/company';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getAutocompleteUsers } from '../../action/lookup';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { COLOR, ASSET_STYLE, STYLE } from '../../config/theme';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import { headerHelper } from '../../util/ui-helper';
import { Dropdown } from 'react-native-material-dropdown';
import CassaStatusBar from '../common/status.bar';
import Autocomplete from '../common/autocomplete.view';
import DatePicker from 'react-native-datepicker'

import Autocomplete1 from 'react-native-autocomplete-input'
import CompanyApi from '../../api/company'

class ActionForm extends Component {

    navigate = undefined;
    categories = [];
    companies = [];

    static navigationOptions = ({ navigation, setParams }) => {
        const params = navigation.state.params || {};
        params.title = 'Action';
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
            teamContractor: '',
            category: '',
            detail: '',
            actionToBeTaken: '',
            company: '',
            date: new Date(),
            person: '',
            dateText: '',
            textAreaHeight: 0,
            data: [],
            hideAutoComplete: false
        };
    }

    checkErrors() {
        if (this.state.category === '') {
            this.props.showAlert('All fields are required', 'Please enter Category.');
            return true;
        }
        if (this.state.detail === '') {
            this.props.showAlert('All fields are required', 'Please enter Detail of Issue.');
            return true;
        }

        if (this.state.actionToBeTaken === '') {
            this.props.showAlert('All fields are required', 'Enter value Action to be Taken.');
            return true;
        }

        if (this.state.dateText === '') {
            this.props.showAlert('All fields are required', 'Date to be closed to be Taken.');
            return true;
        }

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

    doneClicked() {
        if (!this.checkErrors()) {
            const { params } = this.props.navigation.state;
            const { textAreaHeight, data, hideAutoComplete, ...state } = this.state;
            this.setState({ state }, () => {
                params.shareData('action', params.data.key, this.state);
                this.props.navigation.goBack(null);
            });
        }
    }

    datePickerMainFunctionCall = () => {
        let DateHolder = this.state.date;
        if (!DateHolder || DateHolder == null) {
            DateHolder = new Date();
            this.setState({
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
        this.setState({
            date: date,
            dateText: moment(date).format('DD-MMM-YYYY')
        });
    }

    async  componentWillMount() {
        //TODO Get data from params if there , and populate.
        //  console.warn(this.props.teamId)
        this.props.getContractors(this.props.token, this.props.team.id);

        await CompanyApi.getCategories(this.props.token, this.props.team.id).then(
            data => data.json()
        ).then(
            data => {
                //   console.warn(data)
                data.result.map(i => {
                    this.categories.push({
                        value: i.title
                    });
                })

            })
        this.setState({ teamContractor: this.props.team.id })
        await CompanyApi.getContractors(this.props.token, this.props.team.id).then(
            data => data.json()
        ).then(
            data => {
                //console.warn(data)
                data.result[0].map(i => {
                    //    console.warn(i)
                    this.companies.push({
                        value: i.company_name,
                        teamId: i.team_id
                    });
                });

                //            console.warn(data)
            })

        if (this.categories && this.categories.length > 0) this.handle('category', this.categories[0].value);
        if (this.companies && this.companies.length > 0) this.handle('company', this.companies[0].value);
        if (this.props.navigation.state.params['data'].data) this.setState({
            ...this.props.navigation.state.params['data'].data
        });
        this.setState({
            textAreaHeight: Dimensions.get('window').height / 7
        });
        //this.handle('date', new Date());
        //this.handle('dateText', moment(new Date()).format('DD-MMM-YYYY'));
    }

    loadUsers(phrase) {
        this.props.autoCompleteUsers(this.props.token, this.state.teamContractor, phrase).then(data => {
            // console.warn(data)
            const data1 = data.result.map(data => `${data.first_name}[${data.email}]`)
            this.setState({
                data: data1
            })
        }).catch(err => {
            this.setState({
                data: []
            })
        });
    }

    handleScroll() {
        Keyboard.dismiss();
    }

    render() {
        //        console.warn(this.state.teamContractor)
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff', flexDirection: 'column' }}>
                <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
                <View style={styles.containerInner}>
                    <KeyboardAwareScrollView>
                        <Dropdown
                            placeholderTextColor="#000000"
                            inputContainerStyle={{ borderBottomColor: 'transparent', paddingLeft: 5 }}
                            dropdownOffset={{ top: 15, left: 0 }}
                            style={{ marginTop: 0, fontSize: 14, borderBottomColor: 'transparant' }}
                            containerStyle={[{ backgroundColor: '#ffffff' }, styles.wrapper]}
                            data={this.categories}
                            value={this.state['category']}
                            onChangeText={(itemValue) => this.handle('category', itemValue)}
                        />
                        <Wrapper><TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' value={this.state.detail} maxLength={1000} multiline={true} numberOfLines={5} returnKeyType="next" onChangeText={(value) => this.handle('detail', value)} style={[styles.txtInput, { height: 110, textAlignVertical: "top" }]} placeholder="Details of issue" /></Wrapper>
                        <Wrapper><TextInput placeholderTextColor="#000000" underlineColorAndroid='transparent' value={this.state.actionToBeTaken} maxLength={1000} multiline={true} numberOfLines={5} onChangeText={(value) => this.handle('actionToBeTaken', value)} style={[styles.txtInput, { height: 110, textAlignVertical: "top" }]} placeholder="Action to be taken" /></Wrapper>

                        <Dropdown
                            inputContainerStyle={{ borderBottomColor: 'transparent', paddingLeft: 5 }}
                            dropdownOffset={{ top: 15, left: 0 }}
                            style={{ marginTop: 0, fontSize: 14, borderBottomColor: 'transparant' }}
                            containerStyle={[{ backgroundColor: '#ffffff' }, styles.wrapper]}
                            data={this.companies}
                            value={this.state['company']}
                            onChangeText={(itemValue, index, data) => {
                                //console.log(data)
                                data.map((data1, i) => {
                                    if (data1.value === itemValue) {
                                        console.log(data1)
                                        this.handle('company', itemValue)
                                        this.setState({ teamContractor: data1.teamId })
                                        this.setState({ person: '' })
                                        //   console.warn(this.state.teamContractor, data1.teamId)
                                    }
                                })

                            }}
                        />

                        <Wrapper>

                        </Wrapper>
                        <Autocomplete1
                            underlineColorAndroid='transparent'
                            placeholder="Responsible Person"
                            placeholderTextColor="black"
                            data={this.state.data}
                            defaultValue={this.state.person}
                            onChangeText={text => {
                                this.loadUsers(text);
                                this.setState({ person: text }
                                )
                            }
                            }
                            renderItem={item => (
                                <TouchableOpacity onPress={() => {

                                    this.setState({ person: item, data: [] })
                                }

                                }>

                                    <Text style={{ padding: 2 }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <Wrapper>
                            <DatePicker
                                style={{ height: 100 }}
                                placeholder={<Text style={{ color: 'black', fontSize: 16 }}>Date to be closed out by</Text>}
                                iconComponent={<Image style={{ position: 'absolute', padding: 5, right: 7, height: 15, width: 15, justifyContent: 'center' }} source={require('../../assets/images/task/date.png')} />}

                                style={{ width: '100%' }} date={this.state.dateText}
                                mode="date"
                                format="DD-MMM-YYYY" confirmBtnText="Confirm"
                                cancelBtnText="Cancel" customStyles={{
                                    dateIcon: { position: 'absolute', right: 0, top: 4, marginLeft: 0 },
                                    dateInput: {
                                        padding: 10, justifyContent: 'flex-start',
                                        alignItems: 'flex-start', border: 'none'
                                    }
                                }}
                                onDateChange={(date) => { this.setState({ dateText: date }) }}
                            />
                        </Wrapper>
                        <TouchableHighlight style={styles.loginBtn} onPress={this.doneClicked.bind(this)}>
                            <Text style={[styles.txt, { fontSize: 15 }]}>Done</Text>
                        </TouchableHighlight>
                    </KeyboardAwareScrollView>
                </View>
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
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 5,
        backgroundColor: '#fff',
        paddingRight: 5
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
        zIndex: 0,
        ...STYLE.bodyfontStyle
    },
    loginBtn: {
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 15,
        marginTop: 15
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
        categories: state.company.catagories,
        contractors: state.company.contractors,
        token: state.auth.token,
        team: state.company.team
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showAlert: (title, msg) => { dispatch(alertBox(title, msg)) },
        validateEmail: (email) => { return validateEmail(email); },
        autoCompleteUsers: (token, teamId, pharse) => { return getAutocompleteUsers(token, teamId, pharse) },
        getContractors: (token, teamId, pharse) => { return getContractors(token, teamId, pharse) }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);

// </Wrapper>
//                         <DatePickerDialog ref="datePicker" onDatePicked={this.onDatePickedFunction.bind(this)} />
//                         <Wrapper style={{
//                             marginBottom: 15,marginTop:20
//                         }}><TouchableOpacity onPress={this.datePickerMainFunctionCall.bind(this)} >
//                                 <View style={styles.datePickerBox}>
//                                     <Text style={[styles.datePickerText]}>{(this.state && this.state.dateText) ? this.state.dateText : 'Date to be closed out by'}</Text>
//                                     <Image style={{ height: 20, width: 20, justifyContent: 'center' }} source={require('../../assets/images/task/date.png')} />
//                                 </View>
//                             </TouchableOpacity>
//                             </Wrapper>
//                         <Wrapper>