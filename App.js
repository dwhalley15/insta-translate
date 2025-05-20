/**
 * @fileoverview
 * This file initializes the app by setting up the database and loading the initial data.
 * It renders the main navigation component for the app.
 * 
 * @module App
 */

import React, { useEffect } from "react";
import StackNavigator from "./navigation/StackNavigator";
import { setupDatabase, loadInitialData } from "./services/DatabaseService";

/**
 * The main App component that initializes the database and loads the initial data.
 * Once initialization is complete, it renders the StackNavigator component.
 *
 * @returns {JSX.Element} The main navigation component for the app.
 */
export default function App() {
  useEffect(() => {
    /**
     * Asynchronously initializes the app by setting up the database and loading initial data.
     * Logs an error to the console if initialization fails.
     */
    const initialise = async () => {
      try {
        await setupDatabase();
        await loadInitialData();
      } catch (error) {
        console.error("Error initialising app:", error);
      }
    };
    initialise();
  }, []);

  return <StackNavigator />;
}
