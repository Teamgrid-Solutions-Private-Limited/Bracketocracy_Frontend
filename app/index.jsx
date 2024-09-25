import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, StatusBar, ActivityIndicator, Platform } from 'react-native';
import RootNavigator from './RootNavigator';
import * as Font from 'expo-font';
import { store } from '../components/redux/store';
import { Provider } from 'react-redux';

export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [color, setColor] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("")
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'nova': require('../assets/fonts/ProximaNova-Bold.ttf'),
      });
      setFontsLoaded(true);
    };
    if (Platform.OS === 'android') {
      setColor("light")
      setBackgroundColor("#000000")
    }
    else {
      setColor("dark")
      setBackgroundColor("#ffffff")
    }
    loadFonts();

  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={backgroundColor} barStyle={color} />
        <Provider store={store} >
          <RootNavigator />
        </Provider>
      </SafeAreaView>
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
