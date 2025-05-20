/**
 * @fileoverview
 * This component displays a translation item with the original text, translated text, and language label.
 * It allows users to swipe and delete the translation item. Users can also tap on the item to view the
 * transcription and translated text in the Speaker screen.
 *
 * @module TranslationItem
 */

import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import ButtonStyles from "../styles/ButtonStyles";
import ContainerStyles from "../styles/ContainerStyles";
import TextStyles from "../styles/TextStyles";
import ColourStyles from "../styles/ColourStyles";
import { languages } from "../constants/LanguageConstants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

/**
 * A component representing a translation item with original text, translated text, and language label.
 * The item can be deleted via swipe actions, and users can tap on the item to view the translation.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the translation item.
 * @param {string} props.originalText - The original text to be translated.
 * @param {string} props.translatedText - The translated text.
 * @param {string} props.language - The language of the translation.
 * @param {Function} props.onDelete - Function to handle the deletion of the item.
 *
 * @returns {JSX.Element} The rendered TranslationItem component.
 */
const TranslationItem = ({
  id,
  originalText,
  translatedText,
  language,
  onDelete,
}) => {
  const navigation = useNavigation();

  const languageLabel =
    languages.find((lang) => lang.value === language)?.label || language;

  /**
   * Handles the press event for navigating to the Speaker screen with the transcription and translation.
   *
   * Navigates to the Speaker screen where the user can hear the transcription and translation.
   */
  const handlePress = () => {
    navigation.navigate("Speaker", {
      transcription: originalText,
      selectedLanguage: language,
      translatedText: translatedText,
    });
  };

  /**
   * Renders the swipeable right actions for deleting the translation item.
   *
   * @param {Animated.Value} progress - The animated progress value for the swipe action.
   * @returns {JSX.Element} The rendered delete button for swipe actions.
   */
  const renderRightActions = (progress) => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(progress.value, [0, 1], [0, 1]);
      return {
        opacity,
      };
    });
    return (
      <Animated.View
        style={[ButtonStyles.deleteButton, animatedStyle, ColourStyles.blackBg]}
      >
        <TouchableOpacity
          onPress={() => onDelete(id)}
          accessible={true}
          accessibilityLabel={"Delete translation"}
          accessibilityHint={"Delete the translation item."}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name={"trash-can-outline"}
            color={"white"}
            size={50}
            accessibilityLabel="Delete icon"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[ContainerStyles.translationContainer, ColourStyles.whiteBg]}>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          onPress={handlePress}
          accessible={true}
          accessibilityLabel="View translation"
          accessibilityHint="Tap to view the transcription and translated text"
          accessibilityRole="button"
        >
          <Text style={[ColourStyles.black, TextStyles.translationItemText]}>
            {originalText}
          </Text>
          <Text style={[ColourStyles.black, TextStyles.translationItemText]}>
            {languageLabel}
          </Text>
          <Text style={[ColourStyles.black, TextStyles.translationItemText]}>
            {translatedText}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
};

export default TranslationItem;
