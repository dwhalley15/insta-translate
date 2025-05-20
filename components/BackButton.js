/**
 * @fileoverview
 * This file contains the BackButton component used for navigating to the previous screen.
 * The component uses React Navigation to navigate back when the button is pressed.
 *
 * The BackButton component is used to create a customisable back navigation button
 * with an icon, which can be placed in different screens to allow users to go back to the previous page.
 * 
 * @module BackButton
 */

import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ContainerStyles from "../styles/ContainerStyles";
import ButtonStyles from "../styles/ButtonStyles";
import ColourStyles from "../styles/ColourStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * BackButton is a component that renders a back button with an icon.
 * When pressed, it uses React Navigation to navigate back to the previous screen.
 *
 * @component
 * @returns {JSX.Element} A TouchableOpacity component containing the back icon.
 */
const BackButton = () => {
  const navigation = useNavigation();

  /**
   * Handles the press event for the back button.
   * This function uses the React Navigation hook to navigate back to the previous screen.
   *
   * @function
   * @returns {void} No return value. The function triggers the navigation action.
   */
  const handlePress = () => {
    navigation.goBack();
  };
  return (
    <View style={ContainerStyles.backButtonContainer}>
      <TouchableOpacity
        style={[ButtonStyles.backButton, ColourStyles.blackBg]}
        onPress={handlePress}
        accessible={true}
        accessibilityLabel="Back"
        accessibilityRole="button"
        accessibilityHint="Takes you back to the previous screen"
      >
        <MaterialCommunityIcons
          name={"keyboard-return"}
          color={"white"}
          size={50}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
