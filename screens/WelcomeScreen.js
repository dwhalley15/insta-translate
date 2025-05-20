/**
 * @fileoverview This file defines the WelcomeScreen component, which serves as the introductory screen for the app.
 * The screen displays a background image, a logo, and automatically navigates to the Microphone screen after a short delay.
 *
 * @module WelcomeScreen
 */

import React, { useEffect } from "react";
import { SafeAreaView, ImageBackground, Image } from "react-native";
import ContainerStyles from "../styles/ContainerStyles";
import ImageStyles from "../styles/ImageStyles";
import Logo from "../components/Logo";

/**
 * WelcomeScreen component for displaying an introduction screen with an automatic navigation transition.
 *
 * @component
 * @param {Object} navigation - Navigation prop for transitioning between screens.
 * @returns {JSX.Element} The rendered WelcomeScreen component.
 */
const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    /**
     * Sets a timer to automatically navigate to the Microphone screen after 3 seconds.
     * The timer is cleared on component unmount.
     */
    const timer = setTimeout(() => {
      navigation.replace("Microphone");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/s5416741/data-api/refs/heads/main/welcomeScreenBg.jpg",
      }}
      style={ImageStyles.backGroundImage}
      accessibilityRole="image"
      accessibilityLabel="Background image for welcome screen"
    >
      <SafeAreaView
        style={ContainerStyles.container}
        accessibilityRole="main"
        accessibilityLabel="Welcome screen container"
      >
        <Logo
          style={ImageStyles.logoImage}
          imageURL={
            "https://raw.githubusercontent.com/s5416741/data-api/refs/heads/main/insta-translate-logo.png"
          }
          accessibilityRole="image"
          accessibilityLabel="App logo: Insta Translate"
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WelcomeScreen;
