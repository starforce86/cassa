import { Platform, ScrollView, StatusBar, Dimensions, Picker, TouchableOpacity, Text, TextInput, View, Button, StyleSheet, Alert, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { COLOR, ASSET_STYLE, STYLE } from '../config/theme';
import React from 'react';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import { pdfhelper } from './pdf-helper';
import ExpandableView from '../components/common/expandable.view';
import SignatureView from '../components/common/signature.view';
import CheckBox from 'react-native-check-box';
import AutoCompletePicker from '../components/common/picker.view';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Dropdown } from 'react-native-material-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
import RNFetchBlob from 'react-native-fetch-blob';

export function renderGenericPicker(key, options, placeholder, instance) {
    const array = [];
    options.forEach(i => {
        array.push({
            value: i.name,
            key: i.id
        });
    });
    if (!instance.state[key] && array.length > 0) handleGeneric(key, array[0]['value'], instance, array);
    if (instance.state[key]) {
        array.forEach(i => {
            if (i.key === instance.state[key]) {
                instance.state[key] = i.value;
                instance.setState(instance.state);
            }
        });
    }
    return (
        <Dropdown
            inputContainerStyle={{ borderBottomColor: 'transparent', paddingLeft: 5 }}
            dropdownOffset={{ top: 15, left: 0 }}
            style={{ marginTop: 0, borderBottomColor: 'transparant' }}
            containerStyle={[{ backgroundColor: '#ffffff', marginTop: 15 }, styles.txtInputWrapper]}
            data={array}
            value={instance.state[key]}
            onChangeText={(itemValue, index, data) => {
                handleGeneric(key, itemValue, instance, array);
            }}
        />
    )
}

function handleGeneric(key, value, instance, options) {
    options.forEach(i => {
        if (i.value === value) {
            instance.state[key] = i.key;
            instance.setState(instance.state);
        }
    });
}

function renderPicker(key, options, placeholder, instance) {
    const array = [];
    options.map(i => {
        array.push({
            value: i
        });
    });
    return (
        <Dropdown
            inputContainerStyle={{ borderBottomColor: 'transparent', paddingLeft: 5 }}
            dropdownOffset={{ top: 15, left: 0 }}
            style={{ marginTop: 0, borderBottomColor: 'transparant' }}
            containerStyle={[{ backgroundColor: '#ffffff' }, styles.txtInputWrapper]}
            label={placeholder}
            data={array}
            value={instance.state['form'][key].value}
            onChangeText={(itemValue) => handle(key, itemValue, instance)}
        />
    )
}

function renderPicker2(key, options, instance) {
    return (
        <View style={styles.txtInputWrapper}><Picker selectedValue={instance.state['form'][key].value}
            onValueChange={(itemValue, itemIndex) => handle(key, itemValue, instance)}>
            {options.map((i, index) => (
                <Picker.Item label={i} value={i} key={index} />
            ))}
        </Picker></View>
    )
}

function renderAutoCompletePicker(key, options, instance) {
    const builtOptions = [];
    options.forEach(i => {
        builtOptions.push({
            key: i,
            value: i
        });
    });
    return (
        <View style={styles.txtInputWrapper}><AutoCompletePicker {...instance.props}
            onSelect={(option) => handle(key, option, instance)}
            onConfirm={(option) => handle(key, option.key, instance)}
            value={instance.state['form'][key].value}
            options={builtOptions}
        /></View>
    )
}

function renderActionBlock(action, instance) {
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableHighlight underlayColor={'transparant'} onPress={() => {
                const data = {};
                data.key = action.key;
                data.type = 'action';
                data.data = instance.state['form'][action.key]['action'] ?
                    instance.state['form'][action.key]['action'] : {};
                instance.actionClick(data);
            }} style={{ flex: 0.45, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <Image resizeMode="contain" style={{ height: 50, width: 50 }} source={require('../assets/images/forms/action.png')} />
                    <Text style={[styles.txt, { color: '#000080', paddingLeft: 10, fontSize: 18 }]}>Action</Text></View>
            </TouchableHighlight>
            <View style={{ borderRightWidth: 1, borderRightColor: '#000000', flex: 0.05, paddingTop: 5, paddingBottom: 5 }} />
            <TouchableHighlight underlayColor={'transparant'} onPress={() => {
                const data = {};
                data.key = action.key;
                data.type = 'photo';
                data.data = instance.state['form'][action.key]['photo'] ?
                    instance.state['form'][action.key]['photo'] : [];
                instance.photoClick(data);
            }} style={{ flex: 0.45, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <Image resizeMode="contain" style={{ height: 50, width: 50 }} source={require('../assets/images/forms/photo.png')} />
                    <Text style={[styles.txt, { color: '#000080', paddingLeft: 10, fontSize: 18 }]}>Photo</Text></View>
            </TouchableHighlight>
        </View>
    )
}

function renderTextInput(key, placeholder, instance, isEditable) {
    return (
        <View style={styles.txtInputWrapper}><TextInput multiline={true} editable={isEditable} underlineColorAndroid='transparent' style={styles.txtInput} placeholder={placeholder} value={instance.state['form'][key].value} onChangeText={(value) => handle(key, value, instance)} />
        </View>
    )
}

function renderNumberInput(key, placeholder, instance) {
    return (
        <View style={styles.txtInputWrapper}><TextInput multiline={true} autoCapitalize={'none'} keyboardType={'phone-pad'} maxLength={10} underlineColorAndroid='transparent' style={styles.txtInput} placeholder={placeholder} value={instance.state['form'][key].value} onChangeText={(value) => handle(key, value, instance)} />
        </View>
    )
}

function renderMulticheck(key, instance, options) {
    const checkoptions = [];
    return {
        init: function () {
            const existingValue = instance.state['form'][key].value;
            if (checkoptions && checkoptions.length == 0) {
                options.forEach((i, index) => {
                    const array = existingValue ? existingValue.split(',') : [];
                    const flag = existingValue && array.indexOf(options[index]) > -1 ? true : false;
                    checkoptions.push({
                        key: options[index],
                        value: options[index],
                        checked: flag
                    });
                });
            }
        },
        toggleCheck: function (i, index) {
            checkoptions[index].checked = !checkoptions[index].checked;
            let value = '';
            const filtered = checkoptions.filter((i, index) => {
                return i.checked;
            });
            filtered.forEach((i, index) => {
                value += i.key + ((index === filtered.length - 1) ? '' : ',');
            });
            handle(key, value, instance);
        },
        renderChecks: function () {
            return (
                <View>{renderTextInput(key, 'Text goes here', instance, false)}
                    <View style={{ marginTop: 5 }}>{checkoptions.map((i, index) => {
                        return (<View style={{ flexDirection: 'row', alignSelf: 'stretch', marginTop: 2 }}>
                            <CheckBox key={i} isChecked={checkoptions[index].checked} onClick={this.toggleCheck.bind(this, i, index)}
                                checkedImage={<Image style={{ height: 20, width: 20 }}
                                    source={require('../assets/images/components/checked.jpg')} />}
                                unCheckedImage={<Image style={{ height: 20, width: 20 }}
                                    source={require('../assets/images/components/unchecked.jpg')} />} />
                            <Text style={[styles.txt, { flex: 1, color: COLOR.PRIMARYDARK, paddingLeft: 10 }]}>{i.value}</Text>
                        </View>);
                    })}</View>
                </View>
            )
        }
    }
}

function renderRadio(key, instance, options) {
    const radioOptions = [];
    options.forEach((i, index) => {
        radioOptions.push({ label: options[index], value: options[index] });
    });
    const value = instance.state['form'][key].value;
    let defaultIndex = '';
    radioOptions.forEach((i, index) => {
        if (value === i.label) {
            defaultIndex = index;
        }
    });
    // if (defaultIndex === 0 && radioOptions && radioOptions.length > 0 && !value) {
    //     instance.state['form'][key].value = radioOptions[0].label;
    // }

    return (
        <View>{renderTextInput(key, 'Text goes here', instance, false)}
            <RadioForm
                buttonColor={COLOR.PRIMARYDARK}
                labelColor={COLOR.PRIMARYDARK}
                formHorizontal={false}
                style={{ alignItems: 'flex-start', marginTop: 5 }}
                radio_props={radioOptions}
                initial={defaultIndex}
                onPress={(option) => handle(key, option, instance)}
            /></View>
    )
}

function handle(key, value, instance, isDate, isComments) {
    if (isComments) {
        instance.state.form[key].comments = value;
    } else if (isDate) {
        instance.state.form[key].dateText = value;
    } else {
        instance.state.form[key].value = value;
    }
    instance.setState(instance.state);
}

function datePicker(value, instance, key) {
    if (value) {
        handle(key, value, instance, false);
        handle(key, moment(value).format('DD-MMM-YYYY'), instance, true);
    } else {
        let DateHolder = instance.state['form'][key].value;
        if (!DateHolder || DateHolder == null) {
            DateHolder = new Date();
        }
        instance.refs[('date' + key)].open({
            date: DateHolder,
        });
    }
}

function renderDatePicker(key, placeholder, instance) {
    return (
        <View style={styles.txtInputWrapper}>

            <DatePicker
                ref={("date" + key)}

                style={{ height: 100 }}
                placeholder={<Text style={{ color: 'black', fontSize: 16 }}></Text>}
                iconComponent={<Image style={{ position: 'absolute', padding: 5, right: 7, height: 15, width: 15, justifyContent: 'center' }} source={require('../assets/images/task/date.png')} />}

                style={{ width: '100%' }} date={(instance.state['form'][key].dateText) ? instance.state['form'][key].dateText : ''}
                mode="date"
                format="DD-MMM-YYYY" confirmBtnText="Confirm"
                cancelBtnText="Cancel" customStyles={{
                    dateIcon: { position: 'absolute', right: 0, top: 4, marginLeft: 0 },
                    dateInput: {
                        padding: 10, justifyContent: 'flex-start',
                        alignItems: 'flex-start', border: 'none'
                    }
                }}
                onDateChange={(date) => datePicker(date, instance, key)}
            />

        </View>
    )
}

export function dynamicComponentRender(formDetails, instance) {
    var components = [];
    formDetails.forEach((i, index) => {
        components.push(renderCollapsePanel(i.input_field_question, index, i.input_name, '', i.form_options ? i.form_options : [], instance));
    });
    return (<View>{components}</View>)
}

function renderCollapsePanel(title, key, type, placeholder, options, instance) {

    if (type === 'signature') {
        return renderSignature(instance, key, title);
    }

    if (type === 'heading_category') {
        return renderHeadingCategory(title);
    }

    if (type === 'note') {
        return renderNote(title);
    }

    return (
        <View><ExpandableView title={title} {...instance.props}>
            {renderComponent(key, placeholder, instance, type, options)}
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableHighlight underlayColor={'transparant'} onPress={() => {
                    instance.actionClick({
                        type: 'action',
                        key: key,
                        data: instance.state['form'][key]['action'] ?
                            instance.state['form'][key]['action'] : {}
                    });
                }} style={{ flex: 0.45, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                        <Image resizeMode="contain" style={{ height: 50, width: 50 }} source={require('../assets/images/forms/action.png')} />
                        <Text style={[styles.txt, { color: '#000000', paddingLeft: 10 }]}>Action</Text>
                    </View>
                </TouchableHighlight>
                <View style={{ borderRightWidth: 1, borderRightColor: '#000000', flex: 0.05, paddingTop: 5, paddingBottom: 5 }} />
                <TouchableHighlight underlayColor={'transparant'} onPress={() => {
                    instance.photoClick({
                        type: 'photo',
                        key: key,
                        data: instance.state['form'][key]['photo'] ?
                            instance.state['form'][key]['photo'] : []
                    });
                }} style={{ flex: 0.45, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                        <Image resizeMode="contain" style={{ height: 50, width: 50 }} source={require('../assets/images/forms/photo.png')} />
                        <Text style={[styles.txt, { color: '#000000', paddingLeft: 10 }]}>Photo</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.txtInputWrapper}>
                <TextInput placeholderTextColor="#000000"
                    underlineColorAndroid='transparent' value={instance.state['form'][key]['comments']}
                    maxLength={1000} multiline={true} numberOfLines={5}
                    onChangeText={(value) => handle(key, value, instance, false, true)}
                    style={[styles.txtInput, { height: 100, textAlignVertical: "top" }]}
                    placeholder="Comments" />
            </View>
        </ExpandableView>
            <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5 }}></View></View>
    )
}

function renderSignature(instance, key, title) {
    const helper = new signatureHelper(instance, key, title);
    if (!instance.state['form'][key].value) helper.addSignature();
    return helper.renderSignatures();
}

function renderHeadingCategory(title) {
    if (title) title = title.toUpperCase();
    return (
        <View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={[styles.txt, {
                    color: '#000000',
                    fontFamily: 'Raleway-Bold', flex: 1, padding: 10, paddingLeft: 15,
                    ...Platform.select({
                        ios: {
                            fontWeight: '700'
                        }
                    })
                }]}>{title}</Text>
            </View>
            <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5 }}></View>
        </View>
    )
}

function renderNote(title) {
    if (title && title.length > 300) title = title;
    //.substring(0, 297) + '...';
    return (
        <View>
            <View key={title.length} style={{ paddingLeft: 15, paddingRight: 10, paddingBottom: 10 }}>
                <View style={{ flexDirection: 'row', marginTop: 15, flex: 1 }}>
                    <Text style={[styles.txt, { flex: 1, color: '#000000' }]}>
                        {title}
                    </Text>
                    {title.length >= 300 ? <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 5 }}>
                        <Image style={{ width: 20, height: 20, marginRight: 5 }} resizeMode="contain" source={require('../assets/images/forms/question.png')} />
                        <Image style={{ width: 20, height: 20 }} resizeMode="contain" source={require('../assets/images/forms/export.png')} />
                    </View> : <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 5 }}>
                            <Image style={{ width: 20, height: 20 }} resizeMode="contain" source={require('../assets/images/forms/export.png')} />
                        </View>}
                </View>
            </View>
            <View style={{ borderBottomColor: '#000000', borderBottomWidth: 0.5 }}></View>
        </View>
    )
}

function renderComponent(key, placeholder, instance, type, options) {
    switch (type) {
        case 'textarea':
            return renderTextInput(key, placeholder, instance, true);
        case 'text':
            return renderTextInput(key, placeholder, instance, true);
        case 'number':
            return renderNumberInput(key, placeholder, instance);
        case 'select':
            return renderPicker(key, options, placeholder, instance);
        case 'autocomplete':
            return renderAutoCompletePicker(key, options, instance);
        case 'date':
            return renderDatePicker(key, placeholder, instance);
        case 'single_select':
            return renderRadio(key, instance, options);
        case 'radio':
            return renderRadio(key, instance, options);
        case 'checkbox':
            const multicheck = new renderMulticheck(key, instance, options);
            multicheck.init();
            return multicheck.renderChecks();
        default:
            break;
    }
}

export function headerHelper(params, headerLeft, headerRight, navigation) {
    if (params.title && params.title.length > 20) {
        params.actualTitle = params.title;
        params.title = params.title
    }
    if (params.prevTitle && params.prevTitle.length > 10) {
        params.actualPrevTitle = params.prevTitle;
        params.prevTitle = params.prevTitle
    }
    const marginTop = Platform.OS === 'android' ? 24 : 0;
    return {
        title: params.title,
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', flex: 1, ...STYLE.headingfontStyle },
        headerStyle: { marginTop: marginTop, elevation: 0, shadowOpacity: 0, borderBottomColor: '#000000', borderBottomWidth: 0.6, ...STYLE.headingfontStyle },
        headerLeft: headerLeft ? headerLeft : (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            navigation.goBack(null);
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../assets/images/forms/left-arrow.png')} />
                {Platform.OS === 'ios' ? (<Text style={[STYLE.subHeadingfontStyle, { color: '#000000' }]}>{params.prevTitle}</Text>) : <Text style={[styles.txt, { color: '#000000' }]}>{params.prevTitle}</Text>}
            </View>
        </TouchableHighlight>),
        headerRight: headerRight ? headerRight : (<View></View>)
    }
}

export function completedListheaderHelper(params, headerLeft, headerRight, navigation) {
    console.warn(params)
    if (params.title && params.title.length > 20) {
        params.actualTitle = params.title;
        params.title = params.title.substring(0, 17) + '...';
    }
    if (params.prevTitle && params.prevTitle.length > 10) {
        params.actualPrevTitle = params.prevTitle;
        params.prevTitle = params.prevTitle.substring(0, 7) + '...';
    }
    const marginTop = Platform.OS === 'android' ? 24 : 0;
    return {
        title: params.title,
        headerTitleStyle: { alignSelf: 'center', textAlign: 'center', flex: 1, ...STYLE.headingfontStyle },
        headerStyle: { marginTop: marginTop, elevation: 0, shadowOpacity: 0, borderBottomColor: '#000000', borderBottomWidth: 0.6, ...STYLE.headingfontStyle },
        headerLeft: headerLeft ? headerLeft : (<TouchableHighlight style={styles.headerLeft} underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
            navigation.goBack(null);
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../assets/images/forms/left-arrow.png')} />
                {Platform.OS === 'ios' ? (<Text style={[STYLE.subHeadingfontStyle, { color: '#000000' }]}>{params.prevTitle}</Text>) : <Text style={[styles.txt, { color: '#000000' }]}>{params.prevTitle}</Text>}
            </View>
        </TouchableHighlight>),
        headerRight: headerRight ? headerRight : (<View></View>)
    }
}

export function signatureHelper(instance, key, text) {
    const pdfHelper = new pdfhelper();
    return {
        addSignature: function () {
            if (!instance.state['form'][key].value) instance.state['form'][key].value = [];
            var joined = instance.state['form'][key].value.concat({ name: '', signature: '' });
            instance.state['form'][key].value = joined;
            instance.setState({
                ...instance.state
            });
        },
        removeSignature: function (i) {
            instance.state['form'][key].value.splice(i, 1);
            var joined = [].concat(instance.state['form'][key].value);
            instance.state['form'][key].value = joined;
            instance.setState({
                ...instance.state
            });
        },
        renderSignatures: function (cb) {
            var rows = [];
            instance.state['form'][key].value.forEach((i, index) => {
                rows.push(
                    <View key={key + index} style={{ paddingLeft: 10, paddingRight: 10 }}><SignatureView ref={"signature" + key + index} onSave={(data) => {
                        const keyString = key + '_' + index + '_' + moment(new Date()).format('DD-MMM-YYYY') + '.jpg';
                        //instance.setState({ loading: true });
                        // pdfHelper.uploadBase64(data.encoded, keyString).then(data => {
                        //console.warn(data.pathName)
                        //                           RNFetchBlob.config({fileCache:true}).fetch('GET',data.pathName,{}).then(res=>{
                        instance.state['form'][key].value[index].signature = data.encoded;

                        //                         })

                        //  instance.setState({ loading: false });
                        // });
                    }} />
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ flex: 1 }}></Text>
                            <TouchableHighlight onPress={this.removeSignature.bind(this, index)}><Image style={{
                                width: 20, height: 20
                            }} source={require('../assets/images/forms/delete.png')} /></TouchableHighlight>
                        </View>
                        <View style={styles.txtInputWrapper}>
                            <TextInput
                                multiline={true}
                                value={instance.state['form'][key].value[index].name}
                                onChangeText={(value) => {
                                    instance.state['form'][key].value[index].name = value;
                                    instance.setState({
                                        ...instance.state
                                    });
                                }}
                                underlineColorAndroid='transparent' style={styles.txtInput} placeholder="Name of signee" />
                        </View>
                        <TouchableHighlight style={styles.loginBtn} onPress={() => instance.refs['signature' + key + index].show(true)}>
                            <Text style={styles.txt}>Sign</Text>
                        </TouchableHighlight>
                    </View>);
            });
            return (<View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={[styles.txt, {
                        color: '#000000',
                        fontFamily: 'Raleway-Bold', flex: 1, padding: 10, paddingLeft: 15,
                        ...Platform.select({
                            ios: {
                                fontWeight: '700'
                            }
                        })
                    }]}>{text}</Text>
                    <TouchableHighlight underlayColor={COLOR.PRIMARY} style={{ justifyContent: 'center', alignItems: 'center' }} underlayColor="#f1f1f1" onPress={this.addSignature.bind(this)}><Image
                        style={{ width: 25, height: 25, marginRight: 10 }}
                        source={require('../assets/images/components/plus.png')}
                    ></Image></TouchableHighlight>
                </View>
                {rows}</View>)
        }
    }
}

const styles = StyleSheet.create({
    datePickerBox: {
        paddingRight: 5,
        marginTop: 9,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 38,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    headerLeft: {
        padding: 10
    },
    loginBtn: {
        marginTop: 30,
        backgroundColor: COLOR.PRIMARYDARK,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    datePickerText: {
        color: '#000000',
        flex: 1,
        paddingTop: 9,
        marginLeft: 5,
        justifyContent: 'center',
        ...STYLE.bodyfontStyle
    },
    txtInput: {
        color: '#000000',
        ...STYLE.bodyfontStyle,
        ...Platform.select({
            ios: {
                flex: 1,
                paddingLeft: 5
            }
        })
    },
    txt: {
        color: '#FFFFFF',
        ...STYLE.bodyfontStyle
    },
    txtInputWrapper: {
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        ...Platform.select({
            ios: {
                height: 50
            }
        })
    },
})