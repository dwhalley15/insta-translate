/**
 * @fileoverview This file defines the HistoryScreen component for displaying a list of saved translations.
 * The component fetches translations from a database, allows users to delete them, and displays the list in a FlatList.
 *
 * The screen includes a background image, a back button for navigation, and appropriate styling.
 * It uses the TranslationItem component to render individual translations.
 *
 * @module screens/HistoryScreen
 */

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ImageBackground,
  FlatList,
  Text,
  Alert,
} from "react-native";
import ContainerStyles from "../styles/ContainerStyles";
import ColourStyles from "../styles/ColourStyles";
import TextStyles from "../styles/TextStyles";
import ImageStyles from "../styles/ImageStyles";
import BackButton from "../components/BackButton";
import {
  fetchTranslations,
  deleteTranslation,
} from "../services/DatabaseService";
import TranslationItem from "../components/TranslationItem";

/**
 * HistoryScreen component displays a list of previously saved translations.
 *
 * @component
 * @returns {JSX.Element} The rendered HistoryScreen component.
 */
const HistoryScreen = () => {
  const [translations, setTranslations] = useState([]);

  /**
   * Fetch translations from the database on component mount.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const fetch = async () => {
      const translations = await fetchTranslations();
      setTranslations(translations);
    };
    fetch();
  }, []);

  /**
   * Deletes a translation by its ID and updates the list.
   *
   * @function
   * @param {number} id - The ID of the translation to delete.
   * @returns {Promise<void>} A promise that resolves once the translation is deleted.
   */
  const handleDelete = async (id) => {
    await deleteTranslation(id);
    Alert.alert("Translation deleted");
    setTranslations((prevTranslations) =>
      prevTranslations.filter((item) => item.id !== id)
    );
  };

  return (
    <ImageBackground
      source={{
        uri: "https://raw.githubusercontent.com/s5416741/data-api/refs/heads/main/historyScreenBg.jpg",
      }}
      style={ImageStyles.backGroundImage}
      accessibilityRole="image"
      accessibilityLabel="Background image for history screen"
    >
      <SafeAreaView
        style={ContainerStyles.container}
        accessibilityRole="main"
        accessibilityLabel="History screen container"
      >
        {translations.length > 0 ? (
          <FlatList
            data={translations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TranslationItem
                id={item.id}
                originalText={item.original_text}
                translatedText={item.translated_text}
                language={item.language}
                onDelete={handleDelete}
              />
            )}
            contentContainerStyle={ContainerStyles.listContainer}
            accessibilityRole="list"
            accessibilityLabel="List of saved translations"
          />
        ) : (
          <Text
            style={[TextStyles.translationText, ColourStyles.white]}
            accessibilityRole="text"
            accessibilityLabel="No translations found message"
          >
            No translations found
          </Text>
        )}
        <BackButton />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HistoryScreen;
