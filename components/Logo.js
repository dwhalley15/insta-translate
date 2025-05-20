/**
 * @fileoverview
 * This file contains the Logo component, which is used to display an image/logo in the app.
 * The image source and style can be customized via props.
 *
 * The Logo component renders an image from a URL and applies the provided styling.
 * It can be used in various parts of the app where a logo or image is required.
 * 
 * @module Logo
 */

import React from "react";
import { Image } from "react-native";

/**
 * Logo component renders an image (typically a logo) passed via the imageURL prop.
 * The style of the image can be customised using the style prop.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.style - Custom styles for the image
 * @param {string} props.imageURL - The URL of the image to be displayed
 * @returns {JSX.Element} An Image component rendering the image from the URL
 */
const Logo = ({ style, imageURL }) => {
  return (
    <Image
      source={{
        uri: imageURL,
      }}
      style={style}
      accessible={true}
      accessibilityLabel="App Logo"
      accessibilityRole="image"
      accessibilityHint="Displays the logo of the app"
    />
  );
};

export default Logo;
