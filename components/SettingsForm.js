/**
 * @fileoverview
 * This file defines the `SettingsForm` component, which allows users to update
 * the language settings of the app. It fetches the current settings, displays
 * a Picker for language selection, and provides a button to save the selected
 * language. The component uses accessible elements to ensure compatibility with
 * screen readers and other assistive technologies.
 *
 * The `SettingsForm` uses React state management for handling the selected language,
 * and it interacts with a service (`DatabaseService`) to fetch and save settings.
 * 
 * @module SettingsForm
 */

import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { fetchSettings, updateSettings } from "../services/DatabaseService";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import ColourStyles from "../styles/ColourStyles";
import ButtonStyles from "../styles/ButtonStyles";
import ContainerStyles from "../styles/ContainerStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { languages } from "../constants/LanguageConstants";

/**
 * `SettingsForm` allows users to select and save their preferred language for the app.
 * It fetches the current language setting and displays it in a Picker component.
 * The user can select a language, and the app will update the language setting when saved.
 *
 * @returns {JSX.Element} The settings form component with a Picker and a save button.
 */
const SettingsForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const navigation = useNavigation();

  useEffect(() => {
    /**
     * Fetches the current settings when the component is mounted.
     * The settings include the current language preference.
     * If no settings are found, it defaults to "en".
     */
    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        if (settings.length > 0) {
          const language = settings[0].language || "en";
          setSelectedLanguage(language);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  /**
   * Handles saving the selected language to the database.
   * Displays an alert message when the language is successfully saved.
   * Navigates to the Microphone screen after saving.
   *
   * @async
   */
  const handleSave = async () => {
    try {
      await updateSettings(selectedLanguage);
      Alert.alert("Language updated");
      navigation.navigate("Microphone");
    } catch (error) {
      Alert.alert("Unable to save language");
      console.error("Error saving language:", error);
    }
  };

  return (
    <View style={[ContainerStyles.formContainer, ColourStyles.blackBg]}>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        style={[ColourStyles.whiteBg, ButtonStyles.picker]}
        accessible={true}
        accessibilityLabel="Select Language"
        accessibilityRole="combobox"
        accessibilityHint="Select a language from the list"
      >
        {languages.map((lang) => (
          <Picker.Item
            key={lang.value}
            label={lang.label}
            value={lang.value}
            accessibilityLabel={lang.label}
          />
        ))}
      </Picker>
      <TouchableOpacity
        onPress={handleSave}
        style={[ButtonStyles.translateButton, ColourStyles.whiteBg]}
        accessible={true}
        accessibilityLabel="Save Language"
        accessibilityRole="button"
        accessibilityHint="Save the selected language and update settings"
      >
        <MaterialCommunityIcons
          name={"content-save"}
          color={"black"}
          size={50}
          accessibilityLabel="Save icon"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SettingsForm;
