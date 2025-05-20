/**
 * @fileoverview This file defines the SettingsScreen component, which allows users to update
 * their app settings through a form interface. The screen includes a background image,
 * a settings form, and a back button for navigation.
 *
 * @module screens/SettingsScreen
 */

import React from "react";
import { SafeAreaView, ImageBackground } from "react-native";
import ContainerStyles from "../styles/ContainerStyles";
import ImageStyles from "../styles/ImageStyles";
import BackButton from "../components/BackButton";
import SettingsForm from "../components/SettingsForm";

/**
 * SettingsScreen component provides a user interface to update application settings.
 *
 * @component
 * @returns {JSX.Element} The rendered SettingsScreen component.
 */
const SettingsScreen = () => {
  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/s5416741/data-api/refs/heads/main/settingsScreenBg.jpg",
      }}
      style={ImageStyles.backGroundImage}
      accessibilityRole="image"
      accessibilityLabel="Background image for settings screen"
    >
      <SafeAreaView
        style={ContainerStyles.container}
        accessibilityRole="main"
        accessibilityLabel="Settings screen container"
      >
        <SettingsForm />
        <BackButton />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SettingsScreen;
