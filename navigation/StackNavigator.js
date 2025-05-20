/**
 * @fileoverview
 * This file contains the StackNavigator component which sets up the navigation for the app.
 * It uses the React Navigation library to create a stack navigator with multiple screens.
 * The app has the following screens: Welcome, Microphone, Translate, Speaker, History, and Settings.
 * 
 * @module navigation/StackNavigator
 */

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import MicrophoneScreen from "../screens/MicrophoneScreen";
import SpeakerScreen from "../screens/SpeakerScreen";
import TranslateScreen from "../screens/TranslateScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();

/**
 * StackNavigator component that sets up the app's navigation structure.
 * It contains a stack of screens that users can navigate through, starting from the Welcome screen.
 * Each screen is configured with its respective component and options to hide the header.
 *
 * @returns {JSX.Element} The navigation container that holds the stack navigator and its screens.
 */
const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Microphone"
          component={MicrophoneScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Translate"
          component={TranslateScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Speaker"
          component={SpeakerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
