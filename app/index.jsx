import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
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
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor='black'
          translucent={false}
        />
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
