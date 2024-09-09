import { Image, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import React from 'react';

const Footer = () => {
  const handlePress = () => {
    Linking.openURL('https://godigitalalchemy.com/');
  };

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.sponsorText}>This year's bracket is sponsored by</Text>
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={require('../../assets/images/digitalacademy.png')}
          style={styles.sponsorImage}
        />
      </TouchableOpacity>
    </View>
  );
}

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    alignItems: 'center',
    // marginTop: 20,
    backgroundColor: '#fff',
    width: '100%',
    height: '10%',
  },
  sponsorText: {
    fontSize: 15,
    textAlign: 'center',
    zIndex: 15,
    marginTop: 5,
  },
  sponsorImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginTop: -25,
    zIndex: 10,
  },
});
