import React, {
  Component
} from 'react';

import { ASSET_STYLE, COLOR } from '../../config/theme';

import ReactNative, {
  View, Text, Platform, Alert, TouchableHighlight, StyleSheet,
} from 'react-native';

import Modal from 'react-native-modal';

import SignatureCapture from 'react-native-signature-capture';

const toolbarHeight = Platform.select({
  android: 0,
  ios: 22
});

const modalViewStyle = {
  backgroundColor: "white",
  paddingTop: toolbarHeight,
  flex: 0,
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4
};

class SignatureView extends Component {

  static propTypes = {
    onSave: () => { }
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  show(display) {
    this.setState({ visible: display });
  }

  render() {
    const { visible } = this.state;

    return (
      <Modal isVisible={visible} supportedOrientations={['portrait', 'landscape']}>
        <View style={modalViewStyle}>
          <View style={{ flexDirection: 'row', padding: 15 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#000000' }}>Please sign here.</Text>
            </View>
            <TouchableHighlight onPress={() => this.setState({ visible: null })}><Text> X </Text></TouchableHighlight>
          </View>
          <SignatureCapture ref="sign" showNativeButtons={false} saveImageFileInExtStorage={true}
            style={{ height: 150 }}
            onDragEvent={this._onDragEvent.bind(this)}
            onSaveEvent={this._onSaveEvent.bind(this)}
          />
          <View style={{ flexDirection: 'column', paddingLeft: 5, paddingRight: 5 }}>
            <TouchableHighlight style={styles.resetBtn} onPress={() => this.refs["sign"].resetImage()}>
              <Text style={styles.txt}>Reset</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.saveBtn} onPress={() => {
              this.refs["sign"].saveImage();
              this.setState({ visible: false });
            }}>
              <Text style={styles.txt}>Save</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }

  _onPressClose() {
    this.show(false);
  }

  _onRequreClose() {
    this.show(false);
  }

  _onDragEvent() {
    //      console.log("dragged");
  }

  _onSaveEvent(result) {
    console.warn(result.pathName)
    this.props.onSave && this.props.onSave(result);
  }
}

const styles = StyleSheet.create({
  saveBtn: {
    marginTop: 5,
    backgroundColor: COLOR.PRIMARYDARK,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 5
  },
  resetBtn: {
    backgroundColor: ASSET_STYLE.doneColor,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  txt: {
    color: '#FFFFFF',
    fontFamily: 'Raleway-Medium'
  }
})

export default SignatureView;