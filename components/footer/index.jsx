import { Image, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSponsor } from '../redux/sponsorSlice';

const Footer = () => {
  const dispatch = useDispatch();
  const { sponsors } = useSelector((state) => state.sponsor);

  useEffect(() => {
    dispatch(getSponsor());
  }, [dispatch]);

  // Filter sponsors to get the first one with status 'yes'
  const activeSponsor = sponsors.find(sponsor => sponsor.status === 'yes');

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.sponsorText}>This year's bracket is sponsored by</Text>
      {activeSponsor ? (
        <>
          <Text style={styles.sponsorText}>{activeSponsor.companyName}</Text>
          {/* Uncomment and use if you want to display sponsor's logo */}
          {/* <Image
            source={{ uri: activeSponsor.logo }}  // Ensure the logo URL is valid and accessible
            style={styles.sponsorImage}
          /> */}
        </>
      ) : (
        <Text style={styles.sponsorText}>No active sponsors at the moment</Text>
      )}
    </View>
  );
};

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
