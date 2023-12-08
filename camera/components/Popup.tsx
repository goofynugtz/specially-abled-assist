import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Tts from 'react-native-tts';

interface PopupComponentProps {
  content: string;
  isVisible: boolean;
  onClose: () => void;
}

const PopupComponent: React.FC<PopupComponentProps> = ({ content, isVisible, onClose }) => {

  

  return (
    <Modal transparent visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Text style={styles.popupText}>{content}</Text>
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={styles.sideButtons}
            onPress={() => onClose()}
          >
            <Ionicons name="chevron-back" size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sideButtons}
            onPress={() => Speak(content)}
          >
            <Feather name="speaker" size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sideButtons}
          >
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupText: {
    fontSize: 48,
    marginVertical: 'auto',
    marginHorizontal: 10,
    color: 'white'
  },
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
    backgroundColor: 'rgba(255,255,255,.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export const Speak = (text: string) => {
  Tts.setDucking(true);
  Tts.speak(text, {
    iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
    rate: 0.4,
    androidParams: {
      KEY_PARAM_STREAM: "STREAM_ACCESSIBILITY",
      KEY_PARAM_VOLUME: 1,
      KEY_PARAM_PAN: 0
    }
  });
}

export default PopupComponent;
