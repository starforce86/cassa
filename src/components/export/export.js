import React, { Component } from 'react';

import { Image, View, Dimensions, Alert, TouchableOpacity, StyleSheet, RFNS, TouchableHighlight, Text, PermissionsAndroid, Platform } from 'react-native';
import { ASSET_STYLE, STYLE } from '../../config/theme';

import ImagePicker from 'react-native-image-picker';
import CheckBox from 'react-native-check-box';
import { headerHelper } from '../../util/ui-helper';
import { pdfhelper } from '../../util/pdf-helper';
import CassaStatusBar from '../common/status.bar';
import Pdf from 'react-native-pdf';
import Mailer from 'react-native-mail';
import { connect } from 'react-redux';
import APICONSTANTS from '../../api/constant'
import { getActionSubmitData } from '../../action/lookup';
import RNFetchBlob from 'react-native-fetch-blob';
import Share, { ShareSheet, Button } from 'react-native-share';

var Mailer1 = require('NativeModules').RNMail;

import { MenuPopoverView, PopoverContainer } from '../common/popover.view';

//var Mailer = Platform.OS === 'android' ? require('react-native-mail') : require('NativeModules').RNMail;

class ExportMenuPopover extends Component {

  tooltip = undefined;

  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      menus: [
        {
          title: 'Export To CASSA',
          action: () => {
            //            console.warn(this.props.navigation.state.params['form'].form);
            props.navigation.navigate('Management', { form: this.props.navigation.state.params['form'], path: this.props.navigation.state.params['path'] });
          }
        },
        {
          title: 'Export To Email',
          action: () => {
            let array = this.props.navigation.state.params['path'].split('/');
            let fileName = array[array.length - 1];
            fileName = fileName.replace(new RegExp('%20', 'g'), '');
            var MailerSend = Platform.OS === 'android' ? Mailer : Mailer1;

            RNFetchBlob.config({ fileCache: true, appendExt: 'pdf' })
              .fetch('GET', this.props.navigation.state.params['path'], {
              })
              .then((res) => {
                const filePath = Platform.OS === 'android' ? 'file:/' + res.path() : '' + res.path();
                //  console.warn(filePath)
                // console.warn('yes')

                Mailer.mail({
                  subject: this.props.navigation.state.params['name'],
                  recipients: [],
                  ccRecipients: [],
                  bccRecipients: [],
                  body: '<b></b>',
                  isHTML: true,
                  attachment: {
                    path: res.path(),
                    type: 'pdf',
                    name: this.props.navigation.state.params['name'],
                  }
                }, (error, event) => {
                  Alert.alert(
                    // error,
                    // event,
                    "Error",
                    "Please check your device email configuration.",
                    [
                      { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                      { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
                    ],
                    { cancelable: true }
                  )
                });
              })
          }
        },
        {
          title: 'Share',
          action: () => {
            let array = this.props.navigation.state.params['path'].split('/');
            let fileName = array[array.length - 1];
            fileName = fileName.replace(new RegExp('%20', 'g'), '');
            RNFetchBlob.config({ fileCache: true, path: `${RNFetchBlob.fs.dirs.DocumentDir}/${this.props.navigation.state.params['name']}.pdf` })
              .fetch('GET', this.props.navigation.state.params['path'], {
              })
              .then(async (res) => {
                const filePath = Platform.OS === 'android' ?
                  `${RNFetchBlob.fs.dirs.DocumentDir}/${this.props.navigation.state.params['name']}.pdf`
                  : '' + res.path();
                //console.warn(filePath)
                //console.warn('yes')
                // const granted = await PermissionsAndroid.check(
                //   'android.permission.READ_EXTERNAL_STORAGE'
                // );
                // if (!granted) {
                //   const response = await PermissionsAndroid.request(
                //     'android.permission.READ_EXTERNAL_STORAGE'
                //   );
                //   if (!response) {
                //     return;
                //   }
                // }

                let shareOptions = {
                  message: 'Shared a pdf with from CASSA',
                  url: filePath,//res.path(),
                  title: this.props.navigation.state.params['name'],
                  subject: "Share Link" //  for email
                };
                // Share.open(shareImageBase64).catch((err) => { err && console.warn(err); })

                // let shareOptions = {
                //   title: "React Native",
                //   message: "Hola mundo",
                //   url: "http://facebook.github.io/react-native/",
                //   subject: "Share Link" //  for email
                // };

                Share.open(shareOptions).catch((err) => { err && console.log(err); })

                //        Share.shareSingle(Object.assign(shareImageBase64, {
                //        "social": "dropbox"
                //}));
              })

          }
        }
      ]
    }
    if (this.props.navigation.state.params['profile'])
      this.setState({
        menus: this.state.menus.splice(0, 1)
      })
  }

  componentDidMount() {
  }

  render() {

    //    console.log(this.props.navigation.state.params['path'])

    return (

      <MenuPopoverView menu={this.state.menus} image={false} trigger="Export" />

    )
  }
}

class Export extends Component {

  navigate = undefined;

  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this.state = {
      menuVisible: false,
      path: ''
    }
  }

  renderHeader() {
    //    console.warn(this.state.path)
    const { params } = this.props.navigation.state;
    params.title = '';
    return (
      <View style={{ flexDirection: 'row', marginTop: 40, paddingBottom: 10, elevation: 0, shadowOpacity: 0, borderBottomColor: '#808080', borderBottomWidth: 0.3 }}>
        <TouchableOpacity underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
          this.props.navigation.goBack(null);
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../../assets/images/forms/left-arrow.png')} />
            <Text style={[STYLE.subHeadingfontStyle, { color: '#000000' }]}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={[{ flex: 1 }, { textAlign: 'center', color: '#000000', ...STYLE.headingfontStyle }]}>{params.title}</Text>
        <View style={{ flexDirection: 'row' }}>
          <ExportMenuPopover {...this.props} />
        </View>
      </View>
    );
  }

  componentDidMount() {
  }

  componentWillUpdate(props, state) {

  }

  componentWillMount() {
    this.setState({
      path: this.props.navigation.state.params['path']
    });
    //    console.warn(this.props.navigation.state.params['path'])
    let array = this.props.navigation.state.params['path'].split('/');
    let fileName = array[array.length - 1];
    fileName = fileName.replace(new RegExp('%20', 'g'), '');
    RNFetchBlob.config({ fileCache: true, appendExt: 'pdf' })
      .fetch('GET', this.props.navigation.state.params['path'], {
      })
      .then((res) => {
        //  console.warn(res.path())
      })
  }

  render() {
    // console.warn(this.state.path)
    const source = require('../../assets/pdf/exported.pdf');//{uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
    return (
      <PopoverContainer>
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ffffff' }}>
          <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
          {this.renderHeader()}
          <View style={styles.outerBlock}>
            <Pdf
              source={{ uri: this.state.path }}
              onLoadComplete={(numberOfPages, filePath) => {
              }}
              onPageChanged={(page, numberOfPages) => {
              }}
              onError={(error) => {
              }}
              style={styles.pdf} />
          </View>
        </View>
      </PopoverContainer>
    );
  }
}

const styles = StyleSheet.create({
  outerBlock: {
    alignItems: 'center',
    margin: 5,
    flex: 1,
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderColor: '#000000'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  headingLayout: {
    flexDirection: 'row',
    marginTop: 150,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.company.catagories,
    team: state.company.team,
    token: state.auth.token,

  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getActionSubmitData: (action) => { dispatch(getActionSubmitData(action)) },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Export);