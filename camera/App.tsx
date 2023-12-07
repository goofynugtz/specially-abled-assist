/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import axios from 'axios';
import { Camera, CameraDevice, useCameraDevice, useCameraDevices } from 'react-native-vision-camera'
import { Colors } from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const checkPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();
    console.log(microphonePermission, cameraPermission)
  }

  // const getBlob: Promise<Blob> | any = useCallback((fileUri: string) => {
  //   return fetch(fileUri).then(
  //     response => response.blob(),
  //     error => console.log(`Error in converting image to blob - ${error}`),
  //   )
  // }, [])

  function blobToBase64(blob: any) : Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob);
    })
  }
  

  const capture = async () => {
    // @ts-ignore
    const photo = await camera.current.takePhoto();
    const img = await fetch(`file://${photo.path}`);
    const blob = await img.blob();
    let base64: string = await blobToBase64(blob)
    base64 = base64.substring(23)
    console.log(base64.slice(0,20))
    try {
      const response = await axios.post('https://api.assistance.ranjanrahul.me/api/', { image: base64 });
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const devices = Camera.getAvailableCameraDevices()
  const device = devices.find((d) => d.position === 'back')
  const camera = useRef<Camera>(null);

  useEffect(() => {
    checkPermissions()
  }, [])

  if (device == null) return <ActivityIndicator />
  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={camera}
        photo={true}
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity style={{
        width: 80,
        height: 80,
        borderRadius: 80,
        backgroundColor: '#FF3C3C',
        position: 'absolute',
        bottom: 120,
        alignSelf: 'center'
      }}
        onPress={() => capture()}
      >
      </TouchableOpacity>
    </View>
  );
}

export default App;
