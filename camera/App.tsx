/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { Camera, CameraPermissionStatus, getCameraFormat } from 'react-native-vision-camera'
import PopupComponent, { Speak } from './src/TTSPopupPage';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Permissions from './src/PermissionsPage';

function App(): JSX.Element {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<"on" | "off">("off");
  const [currentResponse, setCurrentResponse] = useState("Looks like a car in front.");
  
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>()
  const isCameraAuthorized = cameraPermissionStatus === 'granted'

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermissionStatus)
  }, [setCameraPermissionStatus])

  useEffect(() => {
    if (!isCameraAuthorized) Camera.requestCameraPermission().then(setCameraPermissionStatus)
  }, [isCameraAuthorized, setCameraPermissionStatus])

  function blobToBase64(blob: any): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob);
    })
  }

  const toggleFlash = () => {
    if (flash === "on") setFlash("off");
    else setFlash("on");
  }

  
  const capture = async () => {
    const photo = await camera.current?.takePhoto({
      qualityPrioritization: 'speed',
      flash: flash,
    });
    const width = photo?.width
    const height = photo?.height
    
    const img = await fetch(`file://${photo?.path}`);
    const blob = await img.blob();
    let base64: string = await blobToBase64(blob)
    

    base64 = base64.substring(23)
    try {
      setLoading(true)
      const response = await axios.post('https://api.assistance.ranjanrahul.me/api/', { image: base64 });
      setCurrentResponse(response.data)
      setLoading(false)
      setPopupVisible(true)
      setTimeout(() => setPopupVisible(false), 5000);
      Speak(response.data)
      
    } catch (error) {
      console.log(error)
    }
  }
  
  const devices = Camera.getAvailableCameraDevices()
  const device = devices.find((d) => d.position === 'back')
  const camera = useRef<Camera>(null);

  const format = getCameraFormat(device! , [
    { photoResolution: {width: 800, height: 450} },
  ])

  if (device == null) return <ActivityIndicator />
  return (
    <View style={{ flex: 1 }}>
      {cameraPermissionStatus !== 'granted' ? (
        <Permissions />
      ) : (
        <>
          <PopupComponent content={currentResponse} isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} />
          <Camera
            ref={camera}
            photo={true}
            device={device}
            isActive={true}
            style={StyleSheet.absoluteFill}
            format={format}
          />
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.sideButtons}
              onPress={() => setPopupVisible(true)}
            >
              <Feather name="speaker" size={30} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shutterBg}
              onPress={() => capture()}
            >
              <TouchableOpacity
                style={styles.shutterFg}
                onPress={() => capture()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sideButtons}
              onPress={toggleFlash}
            >
              {flash === "off" ?
                <Ionicons name="flash" size={30} color="#FFF" /> :
                <Ionicons name="flash-off" size={30} color="#FFF" />
              }
            </TouchableOpacity>
          </View>
        </>
      )

      }
    </View>
  );
}

const styles = StyleSheet.create({
  bottomView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,.3)',
    position: 'absolute',
    width: '100%',
    height: 180,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  sideButtons: {
    width: 60,
    height: 60,
    borderRadius: 60,
    display: 'flex',
    backgroundColor: 'rgba(0,0,0,.35)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shutterBg: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: '#BDBDBD',
  },
  shutterFg: {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
