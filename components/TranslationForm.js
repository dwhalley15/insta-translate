/**
 *  * @fileoverview
 * This component allows users to view a transcription and translate it into a selected language.
 * It fetches the user's stored language settings, displays a language picker, and allows the user
 * to translate the transcription using the Google Translate API. Once the translation is completed,
 * the user is navigated to the Speaker screen where they can listen to the translation.
 * 
 * @module TranslationForm
 */

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchSettings } from "../services/DatabaseService";
import ContainerStyles from "../styles/ContainerStyles";
import ColourStyles from "../styles/ColourStyles";
import TextStyles from "../styles/TextStyles";
import ButtonStyles from "../styles/ButtonStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { languages } from "../constants/LanguageConstants";
import { googleApiKey } from "../constants/ApiKeys";

/**
 * A form for displaying transcription and selecting the target language for translation.
 *
 * @param {Object} props - The component props.
 * @param {string} props.transcription - The transcription text to be translated.
 *
 * @returns {JSX.Element} The rendered TranslationForm component.
 */
const TranslationForm = ({ transcription }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [storedLanguage, setStoredLanguage] = useState(null);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const navigation = useNavigation();

  /**
   * Loads the user's language settings when the component mounts.
   * Fetches the stored language from the database and updates the language picker.
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        if (settings.length > 0) {
          const language = settings[0].language || "en";
          setStoredLanguage(language);
          const updatedLanguages = languages.filter(
            (lang) => lang.value !== language
          );
          setFilteredLanguages(updatedLanguages);
          if (updatedLanguages.length > 0) {
            setSelectedLanguage(updatedLanguages[0].value);
          }
        } else {
          setFilteredLanguages(languages);
          setSelectedLanguage(languages[0].value);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  /**
   * Handles the translation process by sending a request to the Google Translate API.
   * After receiving the translated text, it navigates to the Speaker screen to display the translation.
   */
  const handleTranslate = async () => {
    try {
      const requestBody = {
        q: transcription,
        source: storedLanguage || "en",
        target: selectedLanguage,
        format: "text",
      };

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const translatedText = result.data.translations[0].translatedText;
        navigation.navigate("Speaker", {
          transcription,
          selectedLanguage,
          translatedText,
        });
      } else {
        Alert.alert("Error", "Failed to translate.");
        console.error("Translation failed:", result.error || result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to translate.");
      console.error("Error during translation:", error);
    }
  };

  return (
    <View style={[ContainerStyles.formContainer, ColourStyles.blackBg]}>
      <View style={[ContainerStyles.textContainer]}>
        <Text style={[ColourStyles.white, TextStyles.translationText]}>
          {transcription}
        </Text>
      </View>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        style={[ColourStyles.whiteBg, ButtonStyles.picker]}
        enabled={filteredLanguages.length > 0}
        accessible={true}
        accessibilityLabel="Select a language for translation"
        accessibilityHint="Choose the language you want to translate the text to"
        accessibilityRole="combobox"
      >
        {filteredLanguages.map((lang) => (
          <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
        ))}
      </Picker>
      <TouchableOpacity
        style={[ButtonStyles.translateButton, ColourStyles.whiteBg]}
        onPress={handleTranslate}
        accessible={true}
        accessibilityLabel="Translate the text"
        accessibilityHint="Press to translate the transcription to the selected language"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name={"translate"}
          color={"black"}
          size={50}
          accessibilityLabel="Translate icon"
        />
      </TouchableOpacity>
    </View>
  );
};

export default TranslationForm;
