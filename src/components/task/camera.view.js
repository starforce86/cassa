import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, Image } from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';

const landmarkSize = 2;

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

export default class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    //ratio: '16:9',
    ratio: '4:3',
    ratios: [],
    photoId: 1,
    showGallery: false,
    photos: [],
    faces: [],
  };

  getRatios = async function () {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleView() {
    this.setState({
      showGallery: !this.state.showGallery,
    });
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  setRatio(ratio) {
    this.setState({
      ratio,
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function () {
    if (this.camera) {
      const options = {
        forceUpOrientation: true, fixOrientation: true, quality: 0.20, base64: true, skipProcessing: true
      };

      this.camera.takePictureAsync(options).then(data => {
        if (this.props.navigation.state.params.cameraCb) this.props.navigation.state.params.cameraCb(data.uri);
        this.props.navigation.goBack(null);
        // console.warn('data: ', data);
      });
    }
  };

  onFacesDetected = ({ faces }) => this.setState({ faces });
  onFaceDetectionError = state => console.warn('Faces detection error:', state);

  renderFace({ bounds, faceID, rollAngle, yawAngle }) {
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      >
        <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    );
  }

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderFace)}
      </View>
    );
  }

  renderLandmarks() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderLandmarksOfFace)}
      </View>
    );
  }

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      >
        <View
          style={{
            flex: 0.5,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >

        </View>
        <View
          style={{
            flex: 0.4,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}
        >
          <Slider
            style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
            onValueChange={this.setFocusDepth.bind(this)}
            step={0.1}
            disabled={this.state.autoFocus === 'on'}
          />
        </View>
        <View
          style={{
            flex: 0.1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'center',
          }}
        >
          <TouchableOpacity
            style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
            onPress={this.takePicture.bind(this)}
          >
            <Image source={require('../../assets/images/camera/ic_photo_camera_36pt.png')} />

          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
            onPress={this.toggleFacing.bind(this)}
          >
            <Text>  Toggle Camera</Text>

          </TouchableOpacity>
        </View>

        {this.renderFaces()}
        {this.renderLandmarks()}
      </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderCamera()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  navigation: {
    flex: 1,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  item: {
    margin: 4,
    backgroundColor: 'indianred',
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  galleryButton: {
    backgroundColor: 'indianred',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
});

// import React from 'react';
// import { Image, StatusBar, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
// import Camera from 'react-native-camera';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center'
//   },
//   overlay: {
//     position: 'absolute',
//     padding: 16,
//     right: 0,
//     left: 0,
//     alignItems: 'center',
//   },
//   topOverlay: {
//     top: 0,
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   bottomOverlay: {
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   captureButton: {
//     padding: 15,
//     backgroundColor: 'white',
//     borderRadius: 40,
//   },
//   typeButton: {
//     padding: 5,
//   },
//   flashButton: {
//     padding: 5,
//   },
//   buttonsSpace: {
//     width: 10,
//   },
// });

// export default class CameraView extends React.Component {

//     static navigationOptions = ({ navigation, setParams }) => {
//         return {
//             header: null
//         }
//     }
//   constructor(props) {
//     super(props);

//     this.camera = null;

//     this.state = {
//       camera: {
// aspect: Camera.constants.Aspect.fill,
// captureTarget: Platform.OS === 'android' ?  Camera.constants.CaptureTarget.cameraRoll :  Camera.constants.CaptureTarget.disk,
// type: Camera.constants.Type.back,
// orientation: Camera.constants.Orientation.auto,
// flashMode: Camera.constants.FlashMode.auto,

//       },
//       isRecording: false,
//     };
//   }

//   takePicture = () => {
//     if (this.camera) {
//       this.camera
//         .capture()
//         .then(data => {
//           if (this.props.navigation.state.params.cameraCb) this.props.navigation.state.params.cameraCb(data);
//           this.props.navigation.goBack(null);
//         })
//         .catch(err => console.error(err));
//     }
//   };

//   startRecording = () => {
//     if (this.camera) {
//       this.camera
//         .capture({ mode: Camera.constants.CaptureMode.video })
//         .then(data => console.log(data))
//         .catch(err => console.error(err));
//       this.setState({
//         isRecording: true,
//       });
//     }
//   };

//   stopRecording = () => {
//     if (this.camera) {
//       this.camera.stopCapture();
//       this.setState({
//         isRecording: false,
//       });
//     }
//   };

//   switchType = () => {
//     let newType;
//     const { back, front } = Camera.constants.Type;

//     if (this.state.camera.type === back) {
//       newType = front;
//     } else if (this.state.camera.type === front) {
//       newType = back;
//     }

//     this.setState({
//       camera: {
//         ...this.state.camera,
//         type: newType,
//       },
//     });
//   };

//   get typeIcon() {
//     let icon;
//     const { back, front } = Camera.constants.Type;

//     if (this.state.camera.type === back) {
//       icon = require('../../assets/images/camera/ic_camera_rear_white.png');
//     } else if (this.state.camera.type === front) {
//       icon = require('../../assets/images/camera/ic_camera_front_white.png');
//     }

//     return icon;
//   }

//   switchFlash = () => {
//     let newFlashMode;
//     const { auto, on, off } = Camera.constants.FlashMode;

//     if (this.state.camera.flashMode === auto) {
//       newFlashMode = on;
//     } else if (this.state.camera.flashMode === on) {
//       newFlashMode = off;
//     } else if (this.state.camera.flashMode === off) {
//       newFlashMode = auto;
//     }

//     this.setState({
//       camera: {
//         ...this.state.camera,
//         flashMode: newFlashMode,
//       },
//     });
//   };

//   get flashIcon() {
//     let icon;
//     const { auto, on, off } = Camera.constants.FlashMode;

//     if (this.state.camera.flashMode === auto) {
//       icon = require('../../assets/images/camera/ic_flash_auto_white.png');
//     } else if (this.state.camera.flashMode === on) {
//       icon = require('../../assets/images/camera/ic_flash_on_white.png');
//     } else if (this.state.camera.flashMode === off) {
//       icon = require('../../assets/images/camera/ic_flash_off_white.png');
//     }

//     return icon;
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <StatusBar animated hidden />
//         <Camera
//           ref={cam => {
//             this.camera = cam;

//           }}
//           style={styles.preview}
//           aspect={this.state.camera.aspect}
//           captureTarget={this.state.camera.captureTarget}
//           type={this.state.camera.type}
//           flashMode={this.state.camera.flashMode}
//           onFocusChanged={() => {}}
//           onZoomChanged={() => {}}
//           defaultTouchToFocus
//           mirrorImage={false}

//           cropToPreview={false}

//         />
//         <View style={[styles.overlay, styles.topOverlay]}>
//           <TouchableOpacity style={styles.typeButton} onPress={this.switchType}>
//             <Image source={this.typeIcon} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.flashButton} onPress={this.switchFlash}>
//             <Image source={this.flashIcon} />
//           </TouchableOpacity>
//         </View>
//         <View style={[styles.overlay, styles.bottomOverlay]}>
//           {(!this.state.isRecording && (
//             <TouchableOpacity style={styles.captureButton} onPress={this.takePicture}>
//               <Image source={require('../../assets/images/camera/ic_photo_camera_36pt.png')} />
//             </TouchableOpacity>
//           )) ||
//             null}
//         </View>
//       </View>
//     );
//   }
// }
