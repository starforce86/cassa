import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    TextInput,
    Image
} from 'react-native';

//import BaseComponent from './baseComponent';
import SinglePicker from 'mkp-react-native-picker';

class AutoCompletePicker extends Component {

    static defaultProps = {
        onSelect: (option) => {

        },
        onConfirm: (option) => {

        },
        value: '',
        options: []
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={[{ flex: 1, flexDirection: 'row' }, styles.txtInputWrapper]}>
                <TextInput underlineColorAndroid='transparent' value={this.props.value} onChangeText={(value) => this.props.onSelect(value)} style={[{ flex: 1 }, styles.txtInput]} />
                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.singlePicker.show();
                    }}>
                    <Image resizeMode="contain" style={{ width: 25, height: 25, marginRight: 5 }} source={require('../../assets/images/components/down-arrow.png')} />
                </TouchableOpacity>
            </View>
            <SinglePicker
                style={{ justifyContent: 'flex-end', backgroundColor: 'white' }}
                lang="en-US"
                ref={ref => this.singlePicker = ref}
                onConfirm={(option) => {
                    this.props.onConfirm(option);
                    this.singlePicker.hide();
                }}
                options={this.props.options}
            >
            </SinglePicker>
        </View>
    }
}

AutoCompletePicker.propTypes = {
    onSelect: PropTypes.func,
    onConfirm: PropTypes.func,
    value: PropTypes.any,
    options: PropTypes.array.isRequired
}

export default AutoCompletePicker;

const styles = StyleSheet.create({
    txtInput: {
        color: '#000000',
        fontFamily: 'Raleway-Medium'
    },
    txt: {
        color: '#000000',
        fontFamily: 'Raleway-Medium'
    },
    txtInputWrapper: {
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    },
})