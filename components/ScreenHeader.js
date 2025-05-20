/**
 * @fileoverview
 * This file defines the `ScreenHeader` component, which is used as the header
 * section of a screen. The header contains three navigation buttons: one for
 * accessing the Settings screen, another for accessing the Microphone screen,
 * and one for accessing the History screen. It also includes a logo that serves
 * as a button to navigate to the Microphone screen.
 *
 * The component uses `TouchableOpacity` to wrap each button and `MaterialCommunityIcons`
 * for the icons, with accessible labels and hints for better screen reader support.
 * 
 * @module ScreenHeader
 */

import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "./Logo";
import ContainerStyles from "../styles/ContainerStyles";
import ImageStyles from "../styles/ImageStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * `ScreenHeader` renders a header section with three navigation buttons.
 * It allows users to navigate to the Settings, Microphone, and History screens.
 * Each button is wrapped in a `TouchableOpacity` component for touch handling, and
 * includes an icon (using `MaterialCommunityIcons`), providing accessible labels
 * for screen readers.
 *
 * @returns {JSX.Element} The header component with navigation buttons.
 */
const ScreenHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={ContainerStyles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        accessible={true}
        accessibilityLabel="Navigate to Settings"
        accessibilityRole="button"
        accessibilityHint="Navigates to the Settings screen"
      >
        <MaterialCommunityIcons
          name={"cog"}
          color={"white"}
          size={40}
          accessibilityLabel="Settings"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Microphone")}
        accessible={true}
        accessibilityLabel="Navigate to Microphone"
        accessibilityRole="button"
        accessibilityHint="Navigates to the Microphone screen"
      >
        <Logo
          style={ImageStyles.logoHeader}
          imageURL={
            "https://raw.githubusercontent.com/s5416741/data-api/refs/heads/main/insta-translate-logo-transparent.png"
          }
          accessibilityLabel="App Logo"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("History")}
        accessible={true}
        accessibilityLabel="Navigate to History"
        accessibilityRole="button"
        accessibilityHint="Navigates to the History screen"
      >
        <MaterialCommunityIcons
          name={"history"}
          color={"white"}
          size={40}
          accessibilityLabel="History"
        />
      </TouchableOpacity>
    </View>
  );
};

export default ScreenHeader;
