import { Image, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import React from 'react';

const Footer = () => {
  const handlePress = () => {
    Linking.openURL('https://godigitalalchemy.com/');
  };

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.sponsorText}>This year's bracket is sponsored by</Text>
      {/* <TouchableOpacity onPress={handlePress}> */}
        <Image
          source={require('../../assets/images/digitalacademy.png')}
          style={styles.sponsorImage}
          
        />
      {/* </TouchableOpacity> */}
    </View>
  );
}

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '9%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  sponsorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  sponsorImage: {
    width: 200,
    height: 40,
    resizeMode: 'contain',
  },
});
