/**
 * @fileoverview
 * This file contains database-related functions for handling translations and settings.
 * It uses SQLite through the expo-sqlite library to manage the application's local database.
 *
 * The functions in this file include:
 * - setupDatabase: Initializes the database and creates the necessary tables.
 * - loadInitialData: Loads initial data into the database if no records exist.
 * - checkIfTranslationExists: Checks if a translation already exists for a given text and language.
 * - addTranslation: Adds a new translation to the database.
 * - fetchTranslations: Fetches all translations from the database.
 * - fetchSettings: Fetches the application settings from the database.
 * - updateSettings: Updates the application settings (language).
 * - deleteTranslation: Deletes a translation from the database.
 * 
 * @module DatabaseService
 */

import * as SQLite from "expo-sqlite";

let db;

/**
 * Initializes the database and creates the necessary tables if they don't exist.
 * This function sets up the database with tables for storing settings and translations.
 *
 * @async
 * @returns {Promise<void>} Resolves when the database setup is complete.
 */
async function setupDatabase() {
  try {
    db = await SQLite.openDatabaseSync("insta-translate.db");
    await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY NOT NULL,
            language TEXT DEFAULT 'en'
            );
            `);

    await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS translations (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          original_text TEXT NOT NULL,
          language TEXT NOT NULL,
          translated_text TEXT NOT NULL
        );
        `);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

/**
 * Loads initial data into the database if no settings exist.
 * It ensures that a default language setting is present in the settings table.
 *
 * @async
 * @returns {Promise<void>} Resolves when the initial data load is complete.
 */
async function loadInitialData() {
  try {
    const settingsCountResult = await db.getFirstAsync(
      "SELECT COUNT(*) as count FROM settings"
    );

    const settingsCount = settingsCountResult.count;

    if (settingsCount === 0) {
      await db.runAsync("INSERT INTO settings (id, language) VALUES (1, 'en')");
    }
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
}

/**
 * Checks if a translation exists in the database for a given original text and language.
 *
 * @async
 * @param {string} originalText - The original text to check for translation.
 * @param {string} language - The language in which the translation is needed.
 * @returns {Promise<Object|null>} A promise that resolves to the translation if it exists, otherwise null.
 */
async function checkIfTranslationExists(originalText, language) {
  try {
    const translation = await db.getFirstAsync(
      "SELECT * FROM translations WHERE original_text = ? AND language = ?",
      [originalText, language]
    );

    return translation;
  } catch (error) {
    console.error("Error checking if translation exists:", error);
    return null;
  }
}

/**
 * Adds a new translation to the database.
 *
 * @async
 * @param {string} originalText - The original text to be translated.
 * @param {string} language - The language in which the text is translated.
 * @param {string} translatedText - The translated text.
 * @returns {Promise<void>} Resolves when the translation is successfully added.
 */
async function addTranslation(originalText, langauge, translatedText) {
  try {
    await db.runAsync(
      "INSERT INTO translations (original_text, language, translated_text) VALUES (?, ?, ?)",
      [originalText, langauge, translatedText]
    );
  } catch (error) {
    console.error("Error adding translation", error);
  }
}

/**
 * Fetches all translations from the database.
 *
 * @async
 * @returns {Promise<Array>} A promise that resolves to an array of all translations.
 */
async function fetchTranslations() {
  try {
    const translations = await db.getAllAsync("SELECT * FROM translations");
    return translations;
  } catch (error) {
    console.error("Error fetching translations:", error);
    return [];
  }
}

/**
 * Fetches all translations from the database.
 *
 * @async
 * @returns {Promise<Array>} A promise that resolves to an array of all translations.
 */
async function fetchSettings() {
  try {
    const settings = await db.getAllAsync("SELECT *  FROM settings");
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return [];
  }
}

/**
 * Updates the language setting in the database.
 *
 * @async
 * @param {string} language - The new language setting.
 * @returns {Promise<void>} Resolves when the settings are updated.
 */
async function updateSettings(language) {
  try {
    await db.runAsync(`UPDATE settings SET language = ? WHERE id = 1`, [
      language,
    ]);
  } catch (error) {
    console.error("Error updating settings:", error);
  }
}

/**
 * Deletes a translation from the database by its ID.
 *
 * @async
 * @param {number} id - The ID of the translation to be deleted.
 * @returns {Promise<void>} Resolves when the translation is deleted.
 */
async function deleteTranslation(id) {
  try {
    await db.runAsync("DELETE FROM translations WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting translation:", error);
  }
}

export {
  setupDatabase,
  loadInitialData,
  addTranslation,
  fetchTranslations,
  fetchSettings,
  updateSettings,
  deleteTranslation,
  checkIfTranslationExists,
};
