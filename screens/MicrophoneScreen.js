/**
 * @fileoverview This file defines the MicrophoneScreen component, which provides a microphone interface
 * for users to interact with. The screen includes a background image, a header, and a button
 * to activate microphone functionality.
 *
 * @module screens/MicrophoneScreen
 */

import React from "react";
import { SafeAreaView, ImageBackground } from "react-native";
import ContainerStyles from "../styles/ContainerStyles";
import ImageStyles from "../styles/ImageStyles";
import MicrophoneButton from "../components/MicrophoneButton";
import ScreenHeader from "../components/ScreenHeader";

/**
 * MicrophoneScreen component provides a microphone interface for voice input.
 *
 * @component
 * @returns {JSX.Element} The rendered MicrophoneScreen component.
 */
const MicrophoneScreen = () => {
  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/s5416741/data-api/refs/heads/main/microphoneScreenBg.jpg",
      }}
      style={ImageStyles.backGroundImage}
      accessibilityRole="image"
      accessibilityLabel="Background image for microphone screen"
    >
      <SafeAreaView
        style={ContainerStyles.container}
        accessibilityRole="main"
        accessibilityLabel="Microphone screen container"
      >
        <ScreenHeader />
        <MicrophoneButton />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default MicrophoneScreen;
