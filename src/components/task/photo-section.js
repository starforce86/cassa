import React, { Component } from 'react';
import PhotoGrid from '../common/photo.grid';
import RNFS from 'react-native-fs';
import { pdfhelper, uploadPDF } from '../../util/pdf-helper';

import { Modal, ActivityIndicator, Image, View, FlatList, TouchableOpacity, StyleSheet, TouchableHighlight, Text, Platform, PermissionsAndroid } from 'react-native';
import { ASSET_STYLE, STYLE, COLOR } from '../../config/theme';

import Camera from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
import CheckBox from 'react-native-check-box';
import { headerHelper } from '../../util/ui-helper';
import CassaStatusBar from '../common/status.bar';
import CassaPrompt from '../common/cassa-prompt.view';
import Paint from './brush';
import ImageResizer from 'react-native-image-resizer';

//Menu
import { MenuPopoverView, PopoverContainer } from '../common/popover.view';

class ImageMenuPopover extends Component {

  tooltip = undefined;

  constructor(props) {
    super(props);
    this.state = {
      menus: [
        {
          title: 'Take Photo',
          action: () => {
            this.checkPermission().then(data => {
              this.props.navigation.navigate('Camera', { cameraCb: this.props.cameraCb });
            });
          }
        },
        {
          title: 'Open Photo',
          action: () => {
            var options = {
              title: 'Select Photo',
              storageOptions: {
                skipBackup: true,
                path: 'images'
              }
            };
            ImagePicker.launchImageLibrary(options, (response) => {
              //  console.warn(response)
              if (response.didCancel) {

                //            this.props.pickerCb(response)

              }
              else {
                this.props.pickerCb(response)
              }
            });
          }
        }
      ]
    }
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

  render() {
    return (
      <MenuPopoverView menu={this.state.menus} image={true} trigger={require('../../assets/images/components/plus.png')} />
    )
  }
}

class ImageSection extends Component {

  navigate = undefined;

  title = 'Media';
  pdfHelper = undefined;

  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this.camera = null;
    this.state = {
      modalVisible: false,

      items: [], menuVisible: false, isEdit: false, showCheck: false, selectedIds: [],
      showPrompt: false
    };
  }

  componentWillUpdate(props, state) {
    if (state && state.items !== this.state.items) {
      this.props.navigation.setParams({
        data: {
          ...this.props.navigation.state.params.data,
          data: state.items
        }
      })
    }
  }

  onDelete() {
    if (this.state.selectedIds && this.state.selectedIds.length !== 0) {
      const newItems = this.state.items.filter(i => {
        if (this.state.selectedIds.indexOf(i.id) == -1) return true;
      });
      this.setState({ items: newItems });
      this.setState({ selectedIds: [] });
    }
    this.setState({ showCheck: false });
    this.setState({
      showPrompt: false
    })
  }

  toggleEdit() {
    this.setState({ isEdit: !this.state.isEdit }, () => {
      if (this.state.isEdit) {
        this.setState({ showCheck: true });
      } else {
        if (this.state.selectedIds.length > 0) {
          this.setState({
            showPrompt: true
          })
        } else {
          this.onDelete();
        }
      }
    });
  }

  componentWillMount() {
    this.setState({ selectedIds: [] });
    //TODO Get data from params if there , and populate.
    if (this.props.navigation.state.params['data']['data']) this.setState({
      items: this.props.navigation.state.params['data']['data']
    });
    this.pdfHelper = new pdfhelper();
  }

  async  pickerCb(response) {

    // console.warn(response)
    const filePath = Platform.OS === 'android' ? ('file://' + response.path) : response.uri.replace('file://', '');

    const array = filePath.split('/');
    this.setState({ loading: true });

    const data1 = await ImageResizer.createResizedImage(filePath, 300, 200, 'PNG', 100, rotation = 0, )
    console.warn(data1)

    const base64image = await RNFS.readFile(Platform.OS === 'android' ? data1.uri : data1.path, 'base64');

    this.state.items.push({
      id: this.state.items.length, src: base64image, checked: false, key: filePath + 1, filePath: filePath
    });
    this.setState({
      items: this.state.items,
      loading: false
    });

    // this.pdfHelper.upload(filePath, array[array.length - 1], false).then(data => {
    //   this.state.items.push({
    //     id: this.state.items.length, src: data.postResponse.location, checked: false, key: data.key, filePath: filePath
    //   });
    //   this.setState({
    //     items: this.state.items,
    //     loading: false
    //   });
    // });
  }

  async   editorCb(id, response) {

    const filePath = Platform.OS === 'android' ? ('file://' + response) : response;
    const array = filePath.split('/');

    this.setState({ loading: true });

    const data1 = await ImageResizer.createResizedImage(filePath, 300, 200, 'PNG', 100, rotation = 0, )
    //console.warn(data1)

    const base64image = await RNFS.readFile(Platform.OS === 'android' ? data1.uri : data1.path, 'base64');

    this.state.items.map(data => {
      if (data.id == id) {
        data.src = base64image;
        data.filePath = response;
      }
    })

    this.setState({
      items: this.state.items,
      loading: false
    });

    // this.pdfHelper.upload(filePath, array[array.length - 1], false).then(data1 => {
    //   console.log(data1)
    //   this.state.items.map(data => {
    //     if (data.id == id) {
    //       data.src = data1.postResponse.location;
    //       data.filePath = response;
    //     }
    //   })

    // this.state.items.push({
    //   id: this.state.items.length, src: data.postResponse.location, checked: false, key: data.key, filePath: response
    // });

  }

  async cameraCb(response) {
    const filePath = response;
    console.warn(response)
    const array = filePath.split('/');
    this.setState({ loading: true });
    var newPath = response.replace("file://", "");

    const data1 = await ImageResizer.createResizedImage(filePath, 300, 200, 'PNG', 100, rotation = 0, )
    //console.warn(data1)

    const base64image = await RNFS.readFile(Platform.OS === 'android' ? data1.uri : data1.path, 'base64');

    this.state.items.push({
      id: this.state.items.length, src: base64image, checked: false, key: newPath + 1, filePath: newPath
    });
    this.setState({
      items: this.state.items,
      loading: false,
      modalVisible: false,
      id: 0,
      filePath: ''
    });

    // this.pdfHelper.upload(filePath, array[array.length - 1], false).then(data => {
    //   this.state.items.push({
    //     id: this.state.items.length, src: data.postResponse.location, checked: false, key: data.key, filePath: newPath
    //   });
    //   this.setState({
    //     items: this.state.items,
    //     loading: false,
    //     modalVisible: false,
    //     id: 0,
    //     filePath: ''
    //   });
    // });
  }

  renderHeader() {
    const { params } = this.props.navigation.state;
    params.title = 'Media';
    return (
      <View style={{ flexDirection: 'row', marginTop: 40, paddingBottom: 10, elevation: 0, shadowOpacity: 0, borderBottomColor: '#808080', borderBottomWidth: 0.3 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <Paint
            editorCb={this.editorCb.bind(this)}
            id={this.state.id}
            filePath={this.state.filePath}
            close={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
          />
        </Modal>
        <TouchableOpacity underlayColor={ASSET_STYLE.underlayColor} onPress={() => {
          params.shareData('photo', params.data.key, params.data.data);
          this.props.navigation.goBack(null);
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Image style={{ width: 30, height: 30 }} source={require('../../assets/images/forms/left-arrow.png')} />
            <Text style={[STYLE.subHeadingfontStyle, { color: '#000000' }]}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={[{ flex: 1 }, { textAlign: 'center', color: '#000000', ...STYLE.headingfontStyle }]}>{params.title}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.toggleEdit.bind(this)}>
            <Image style={{ width: 25, height: 25, marginRight: 5 }} source={!this.state.isEdit ? require('../../assets/images/forms/edit.png') :
              require('../../assets/images/task/delete_new.png')} />
          </TouchableOpacity>
          <ImageMenuPopover {...this.props} cameraCb={this.cameraCb.bind(this)} pickerCb={this.pickerCb.bind(this)} />
        </View>
      </View>
    );

  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    if (this.state.loading) {
      return (
        <PopoverContainer>
          <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ffffff' }}>
            <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
            {this.renderHeader()}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator animating={true}
                color={COLOR.PRIMARYDARK}
                size="large" />
            </View></View>
        </PopoverContainer>);
    }
    return (
      <PopoverContainer>
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ffffff' }}>
          <CassaStatusBar barStyle='dark-content' translucent backgroundColor="#ffffff" />
          {this.renderHeader()}
          <PhotoGrid
            data={this.state.items}
            itemsPerRow={3}
            itemMargin={1}
            renderItem={this.renderItem.bind(this)}
          />
          <CassaPrompt cancelText="CANCEL" submitText="OK" onSubmit={this.onDelete.bind(this)} description="" title="Please confirm to delete the photo" show={this.state.showPrompt} onCancel={() => {
            this.setState({
              showPrompt: false
            })
          }} />
        </View>

      </PopoverContainer>
    );
  }

  handleImagePress(id, filePath) {
    if (!this.state.showCheck) {
      //  console.warn(id)
      //console.warn(this.state.items)
      this.setState({ modalVisible: true, filePath: filePath, id: id });

    };

    if (this.state.selectedIds.includes(id)) {
      let newSelectedIds = this.state.selectedIds.filter(curObject => {
        return curObject !== id;
      });
      this.setState({ selectedIds: newSelectedIds });
    } else {
      let newSelectedIds = [...this.state.selectedIds, id];
      this.setState({ selectedIds: newSelectedIds });
    }
  }

  handleCheck(item) {
    item.checked = !item.checked;
  }

  renderItem(item, itemSize) {
    const isSelected = this.state.selectedIds.includes(item.id);
    return (
      <TouchableOpacity style={[{ width: itemSize, height: itemSize }, styles.componentContainerStyle]} onPress={this.handleImagePress.bind(this, item.id, item.filePath)}>

        <Image

          resizeMode="cover"
          style={[{ width: itemSize, height: itemSize }, styles.componentContainerStyle]}
          source={{ uri: `data: image/png;base64,${item.src}` }}
        />
        {this.state.showCheck ? (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: itemSize, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 5, paddingBottom: 5 }}>
            <CheckBox isChecked={isSelected}
              checkedImage={<Image style={{ height: 25, width: 25 }} source={require('../../assets/images/components/checkimage.png')} />}
              unCheckedImage={<Image style={{ height: 25, width: 25 }} source={require('../../assets/images/components/uncheckimage.png')} />}
              onClick={() => {
                this.handleCheck(item);
                this.handleImagePress(item.id);
              }} on={isSelected ? true : false} /></View>) : (<View></View>)}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  componentContainerStyle: {
    borderWidth: 0.3,
    borderColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }
})

export default ImageSection;