/**
 * @fileoverview
 * This file contains the MicrophoneButton component, which allows the user to start
 * and stop recording audio using the device's microphone. It handles microphone
 * permission requests, recording state, and animation effects.
 *
 * The component manages microphone recording, controls the button state, and displays
 * a visual indicator based on the recording status.
 *
 * @module MicrophoneButton
 */

import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ButtonStyles from "../styles/ButtonStyles";
import ColourStyles from "../styles/ColourStyles";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

/**
 * MicrophoneButton component allows the user to start and stop audio recording.
 * It displays different UI elements based on the recording state and permission status.
 *
 * @component
 * @returns {JSX.Element} The MicrophoneButton component
 */
const MicrophoneButton = () => {
  const [recording, setRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [audioPermission, setAudioPermission] = useState(null);

  const navigation = useNavigation();
  const borderAnim = useRef(new Animated.Value(0)).current;

  /**
   * Requests microphone permissions on component mount.
   */
  useEffect(() => {
    async function getMicrophonePermission() {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          Alert.alert("Permission Denied", "Microphone access is required.");
        }
        setAudioPermission(granted);
      } catch (error) {
        console.error("Error requesting microphone permission:", error);
      }
    }

    getMicrophonePermission();

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  useEffect(() => {
    if (recordingStatus === "recording") {
      startBorderAnimation();
    } else {
      stopBorderAnimation();
    }
  }, [recordingStatus]);

  /**
   * Starts the border animation when recording begins.
   */
  const startBorderAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  /**
   * Stops the border animation when recording stops.
   */
  const stopBorderAnimation = () => {
    borderAnim.stopAnimation();
    borderAnim.setValue(0);
  };

  /**
   * Starts recording the audio with the appropriate settings for the platform.
   */
  async function startRecording() {
    try {
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const newRecording = new Audio.Recording();

      const recordingOptions = {
        isMeteringEnabled: true,
        android: {
          extension: ".webm",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WEBM,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 64000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus("recording");
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  /**
   * Stops the current recording, saves the file, and returns the file path.
   */
  async function stopRecording() {
    try {
      if (recordingStatus === "recording") {
        await recording.stopAndUnloadAsync();
        const recordingUri = recording.getURI();

        const fileExtension = Platform.OS === "android" ? ".webm" : ".wav";
        const fileName = `recording-${Date.now()}${fileExtension}`;

        const filePath =
          FileSystem.documentDirectory + "recordings/" + fileName;

        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + "recordings/",
          { intermediates: true }
        );

        await FileSystem.moveAsync({
          from: recordingUri,
          to: filePath,
        });

        setRecording(null);
        setRecordingStatus("stopped");

        return filePath;
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
      throw error;
    }
  }

  /**
   * Handles the button press by either starting or stopping the recording.
   */
  async function handleButtonPress() {
    if (recording) {
      try {
        const filePath = await stopRecording();
        if (filePath) {
          navigation.navigate("Translate", { recordingUri: filePath });
        } else {
          console.error("Failed to navigate due to missing file path");
        }
      } catch (error) {
        console.error("Error stopping recording or navigating:", error);
      }
    } else {
      await startRecording();
    }
  }

  /**
   * Requests microphone permission when the permission button is pressed.
   */
  async function handlePermissionPress() {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      setAudioPermission(granted);
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  }

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "red"],
  });

  return (
    <View>
      {audioPermission === null && (
        <ActivityIndicator
          size="large"
          color={ColourStyles.white.color}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading microphone permission"
        />
      )}
      {audioPermission === false && (
        <TouchableOpacity
          style={[ButtonStyles.microphoneButton, ColourStyles.blackBg]}
          onPress={handlePermissionPress}
          accessible={true}
          accessibilityLabel="Request microphone permission"
          accessibilityRole="button"
          accessibilityHint="Tap to enable microphone access for recording"
        >
          <MaterialCommunityIcons
            name={"cellphone-lock"}
            color={"white"}
            size={100}
          />
        </TouchableOpacity>
      )}
      {audioPermission === true && (
        <Animated.View
          style={[
            {
              borderWidth: 10,
              borderColor: borderColor,
              borderRadius: 120,
              width: 220,
              height: 220,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={[ButtonStyles.microphoneButton, ColourStyles.blackBg]}
            onPress={handleButtonPress}
            accessible={true}
            accessibilityLabel={
              recording ? "Stop recording" : "Start recording"
            }
            accessibilityRole="button"
            accessibilityHint="Tap to start or stop the audio recording"
          >
            <MaterialCommunityIcons
              name={recording ? "stop" : "microphone"}
              color={"white"}
              size={100}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default MicrophoneButton;
