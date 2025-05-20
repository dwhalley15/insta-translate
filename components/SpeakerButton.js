/**
 * @fileoverview
 * This file defines the `SpeakerButton` component, which allows the user to
 * play or stop speech for translated text. The component includes an animated
 * border effect to visually indicate the playing state and interacts with
 * the `expo-speech` library to handle text-to-speech functionality.
 *
 * The button toggles between playing and stopping speech, with visual feedback
 * provided through an animated border. The component also supports accessibility
 * features such as role and hints for screen readers.
 * 
 * @module SpeakerButton
 */

import React, { useState, useRef, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity, View, Alert, Animated, Easing } from "react-native";
import ButtonStyles from "../styles/ButtonStyles";
import ColourStyles from "../styles/ColourStyles";
import ContainerStyles from "../styles/ContainerStyles";
import * as Speech from "expo-speech";

/**
 * `SpeakerButton` is a button component that triggers text-to-speech functionality.
 * It animates a border when the speech is playing and toggles between play and
 * stop actions for the translated text. It uses the `expo-speech` library to
 * manage the text-to-speech playback.
 *
 * @param {Object} props The component props.
 * @param {string} props.translatedText The text to be spoken.
 * @param {string} props.language The language of the text to be spoken.
 * @returns {JSX.Element} The SpeakerButton component with an animated border and speech functionality.
 */
const SpeakerButton = ({ translatedText, language }) => {
  const [playing, setPlaying] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  /**
   * Starts or stops the border animation based on whether speech is playing.
   */
  useEffect(() => {
    if (playing) {
      startBorderAnimation();
    } else {
      stopBorderAnimation();
    }
  }, [playing]);

  /**
   * Starts the border animation when speech is playing.
   * The border color animates between transparent and blue in a loop.
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
   * Stops the border animation and resets it to the initial state.
   */
  const stopBorderAnimation = () => {
    borderAnim.stopAnimation();
    borderAnim.setValue(0);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "blue"],
  });

  /**
   * Plays or stops the speech based on the current state.
   * If speech is playing, it stops it; otherwise, it starts speaking the translated text.
   *
   * @returns {void}
   */
  const playSpeech = () => {
    if (!translatedText) {
      Alert.alert("Error", "Failed to play the audio.");
      console.error("Error playing audio");
      return;
    }
    if (playing) {
      Speech.stop();
      setPlaying(false);
    } else {
      Speech.speak(translatedText, {
        language: language || "en",
        onStart: () => setPlaying(true),
        onDone: () => setPlaying(false),
        onError: (error) => {
          console.error("Speech error:", error);
          setPlaying(false);
        },
      });
    }
  };

  return (
    <View style={ContainerStyles.buttonContainer}>
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
          onPress={playSpeech}
          accessible={true}
          accessibilityLabel={playing ? "Stop Speech" : "Play Speech"}
          accessibilityRole="button"
          accessibilityHint="Press to start or stop speech for the translated text"
        >
          <MaterialCommunityIcons
            name={playing ? "stop" : "speaker"}
            color={"white"}
            size={100}
            accessibilityLabel={playing ? "Stop icon" : "Speaker icon"}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SpeakerButton;
