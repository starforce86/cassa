import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Alert,
} from 'react-native';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';

export default class example extends Component {

    render() {
        //        console.warn(this.props.filePath)
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <RNSketchCanvas
                        containerStyle={{ flex: 1, marginTop: 30}}
                        canvasStyle={{ flex: 1 }}
                        defaultStrokeIndex={0}
                        defaultStrokeWidth={5}
                        localSourceImagePath={this.props.filePath}

                        closeComponent={<TouchableOpacity onPress={this.props.close}>
                            <View style={styles.functionButton}><Text style={{ color: 'white' }}>Close</Text>
                            </View>
                        </TouchableOpacity>}
                        undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Undo</Text></View>}
                        clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Clear</Text></View>}
                        eraseComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Eraser</Text></View>}
                        strokeComponent={color => (
                            <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
                        )}
                        strokeSelectedComponent={(color, index, changed) => {
                            return (
                                <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
                            )
                        }}
                        strokeWidthComponent={(w) => {
                            return (<View style={styles.strokeWidthButton}>
                                <View style={{
                                    backgroundColor: 'white', marginHorizontal: 2.5,
                                    width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                                }} />
                            </View>
                            )
                        }}
                        saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Save</Text></View>}
                        onSketchSaved={(success, path) => {
                            this.props.editorCb(this.props.id, path)
                            this.props.close();
                            //                           Alert.alert(success ? 'Image saved!' : 'Failed to save image!', path)
                        }}

                        savePreference={() => {
                            return {
                                folder: 'RNSketchCanvas',
                                filename: String(Math.ceil(Math.random() * 100000000)),
                                transparent: false,
                                imageType: 'png'
                            }
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
    },
    strokeColorButton: {
        display: 'flex',
        marginHorizontal: 4.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
    },
    strokeWidthButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
    },
    functionButton: {
        marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 60,
        backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
    }
});