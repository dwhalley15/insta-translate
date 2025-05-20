/**
 * @fileoverview TranslateScreen component responsible for transcribing audio recordings
 * and displaying the transcription along with options for translation.
 * This screen integrates Google Speech-to-Text API and fetches user preferences for language.
 *
 * @module screens/TranslateScreen
 */

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ImageBackground,
  View,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import ContainerStyles from "../styles/ContainerStyles";
import ImageStyles from "../styles/ImageStyles";
import ColourStyles from "../styles/ColourStyles";
import { useRoute } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import * as FileSystem from "expo-file-system";
import TranslationForm from "../components/TranslationForm";
import ScreenHeader from "../components/ScreenHeader";
import { fetchSettings } from "../services/DatabaseService";
import { googleApiKey } from "../constants/ApiKeys";
import { languageMapping } from "../constants/LanguageMapping";

/**
 * TranslateScreen component.
 * Renders a screen where users can transcribe audio recordings and translate the transcription.
 * Integrates Google Speech-to-Text API for transcription based on user-selected language preferences.
 * Handles platform-specific encoding and manages API communication for transcription.
 * Displays the transcription and provides a translation form once the transcription is complete.
 *
 * @returns {JSX.Element} Rendered TranslateScreen component.
 */
const TranslateScreen = () => {
  const route = useRoute();
  const { recordingUri } = route.params;
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Sends the audio recording to Google Speech-to-Text API for transcription.
   * Applies user language preferences and handles errors during API communication.
   *
   * @async
   * @function
   * @returns {Promise<void>} Resolves after processing transcription or upon error handling.
   */
  const sendAudioForTranscription = async () => {
    setLoading(true);
    try {
      const settings = await fetchSettings();
      const shortCode =
        settings.length > 0 && settings[0].language
          ? settings[0].language
          : "en-GB";
      const languageCode = languageMapping[shortCode] || "en-GB";

      const fileInfo = await FileSystem.getInfoAsync(recordingUri);

      if (!fileInfo.exists) {
        Alert.alert("Error", "Audio file does not exist.");
        setLoading(false);
        return;
      }

      const fileContent = await FileSystem.readAsStringAsync(recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      let base64Content = fileContent;
      if (Platform.OS === "ios") {
        base64Content = base64Content.replace(
          "data:audio/vnd.wave;base64,",
          ""
        );
      } else if (Platform.OS === "android") {
        base64Content = base64Content.replace("data:audio/aac;base64,", "");
      }

      const encoding = Platform.OS === "android" ? "WEBM_OPUS" : "LINEAR16";
      const sampleRateHertz = Platform.OS === "android" ? 16000 : 44100;

      const formData = {
        config: {
          encoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: languageCode,
        },
        audio: {
          content: base64Content,
        },
      };

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const responseJson = await response.json();

      if (response.ok && responseJson.results) {
        setTranscription(
          responseJson.results
            .map((result) => result.alternatives[0].transcript)
            .join("\n")
        );
      } else {
        Alert.alert("Error", "Failed to transcribe the audio.");
        console.error("Error transcribing audio");
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      Alert.alert("Error", "Failed to transcribe the audio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recordingUri) {
      sendAudioForTranscription();
    }
  }, [recordingUri]);

  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/s5416741/data-api/refs/heads/main/translateScreenBg.jpg",
      }}
      style={ImageStyles.backGroundImage}
      accessibilityRole="image"
      accessibilityLabel="Background image for translate screen"
    >
      <SafeAreaView
        style={ContainerStyles.container}
        accessibilityRole="main"
        accessibilityLabel="Translate screen container"
      >
        <ScreenHeader />
        <View style={{ marginVertical: 20 }}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={ColourStyles.white.color}
              accessibilityRole="progressbar"
              accessibilityLabel="Loading transcription progress"
            />
          ) : (
            transcription && <TranslationForm transcription={transcription} />
          )}
        </View>
        <BackButton />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default TranslateScreen;
