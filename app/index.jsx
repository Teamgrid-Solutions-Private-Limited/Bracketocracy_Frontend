import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, View, StatusBar } from 'react-native';
import RootNavigator from './RootNavigator';
import * as Font from 'expo-font';
import { store } from '../components/redux/store';
import { Provider } from 'react-redux';
import Splash from '../components/splash_screen/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function setGlobalStatusBar(color, backgroundColor) {
  StatusBar.setBarStyle(color);
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(backgroundColor);
  }
}

export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await Font.loadAsync({
          'nova': require('../assets/fonts/ProximaNova-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    };

    loadResources();

    const splashTimeout = setTimeout(() => {
      setIsSplashComplete(true);
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  useEffect(() => {
    setGlobalStatusBar(
      Platform.OS === 'android' ? "light-content" : "dark-content",
      Platform.OS === 'android' ? "black" : "#ffffff"
    );
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {isSplashComplete && fontsLoaded ? (
          <Provider store={store}>
            <RootNavigator />
          </Provider>
        ) : (
          <Splash />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
