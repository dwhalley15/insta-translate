/**
 * @fileoverview This file defines the SpeakerScreen component, responsible for displaying a refined translation of a given text.
 * The component interacts with the OpenAI API to improve translations and manages translation persistence using a database service.
 *
 * The screen includes a background image, a text display area, and buttons for audio playback and navigation.
 *
 * @module SpeakerScreen
 */

import React, { useEffect, useState } from "react";
import { SafeAreaView, ImageBackground, Text } from "react-native";
import ContainerStyles from "../styles/ContainerStyles";
import ImageStyles from "../styles/ImageStyles";
import TextStyles from "../styles/TextStyles";
import ColourStyles from "../styles/ColourStyles";
import BackButton from "../components/BackButton";
import SpeakerButton from "../components/SpeakerButton";
import ScreenHeader from "../components/ScreenHeader";
import {
  addTranslation,
  checkIfTranslationExists,
} from "../services/DatabaseService";
import { openAiKey } from "../constants/ApiKeys";

/**
 * SpeakerScreen component for displaying refined translations and managing audio playback.
 *
 * @component
 * @param {Object} route - The route object containing parameters passed to the screen.
 * @returns {JSX.Element} The rendered SpeakerScreen component.
 */
const SpeakerScreen = ({ route }) => {
  const { transcription, selectedLanguage, translatedText } = route.params;
  const [refinedText, setRefinedText] = useState(translatedText);

  useEffect(() => {
    /**
     * Refines the provided translation text using the OpenAI API.
     *
     * @async
     * @function
     * @param {string} text - The text to refine.
     * @returns {Promise<void>} A promise that resolves once the text is refined.
     */
    const refineTextWithOpenAI = async (text) => {
      const apiUrl = "https://api.openai.com/v1/chat/completions";

      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an assistant helping refine translations.",
          },
          {
            role: "user",
            content: `Refine this translation for grammar and context: ${text}`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        const refined = data.choices[0]?.text?.trim();
        if (refined) {
          setRefinedText(refined);
        }
      } catch (error) {
        console.error("Error refining translation:", error);
        Alert.alert(
          "Error",
          "Failed to refine the translation. Displaying the original text."
        );
      }
    };

    /**
     * Checks if the translation already exists in the database and adds it if not.
     *
     * @async
     * @function
     * @returns {Promise<void>} A promise that resolves once the check and addition are complete.
     */
    const checkTranslation = async () => {
      const translation = await checkIfTranslationExists(
        transcription,
        selectedLanguage
      );

      if (!translation) {
        addTranslation(transcription, selectedLanguage, refinedText);
      }
    };

    refineTextWithOpenAI(translatedText);
    checkTranslation();
  }, [transcription, selectedLanguage, translatedText, refinedText]);

  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/s5416741/data-api/refs/heads/main/speakerScreenBg.jpg",
      }}
      style={ImageStyles.backGroundImage}
      accessibilityRole="image"
      accessibilityLabel="Background image for speaker screen"
    >
      <SafeAreaView
        style={ContainerStyles.container}
        accessibilityRole="main"
        accessibilityLabel="Speaker screen container"
      >
        <ScreenHeader />
        <Text
          style={[ColourStyles.white, TextStyles.translationText]}
          accessibilityRole="text"
          accessibilityLabel={`Refined translation: ${refinedText}`}
        >
          {refinedText}
        </Text>
        <SpeakerButton
          translatedText={refinedText}
          language={selectedLanguage}
        />
        <BackButton />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SpeakerScreen;
