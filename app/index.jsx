import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, ActivityIndicator, Platform } from 'react-native';
import RootNavigator from './RootNavigator';
import * as Font from 'expo-font';
import { store } from '../components/redux/store';
import { Provider } from 'react-redux';

export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'nova': require('../assets/fonts/ProximaNova-Bold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();

    // Make sure the status bar is visible on both platforms
    StatusBar.setHidden(false);

    // Customize the status bar for iOS and Android differently if needed
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#000000'); // Android-specific
    }
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000000" 
        translucent={Platform.OS === 'ios' ? true : false} // iOS might need translucent to true
      />
      <RootNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
