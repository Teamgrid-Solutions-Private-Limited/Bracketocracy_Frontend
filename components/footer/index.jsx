import { Image, StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSponsor } from '../redux/sponsorSlice';

const Footer = () => {
  const dispatch = useDispatch();
  const { sponsors } = useSelector((state) => state.sponsor);

  useEffect(() => {
    dispatch(getSponsor());
  }, [dispatch]);

  const handlePress = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Failed to open the sponsor link');
    });
  };
  const activeSponsor = sponsors.find(sponsor => sponsor.status === 'yes');
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.sponsorText}>This year's bracket is sponsored by</Text>
      {activeSponsor ? (<>
        <TouchableOpacity onPress={() => handlePress(activeSponsor.website)} style={{width: "100%"}}>
          <Image
            source={{ uri: activeSponsor?.logo }}
            style={styles.sponsorImage}
          />
        </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.sponsorText1}>No active sponsors at the moment</Text>
      )}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2
  },
  sponsorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  sponsorText1: {
    fontSize: 15,
    textAlign: 'center',
    height: 40,
    paddingTop: 10
  },
  sponsorImage: {
    width: "100%",
    height: 40,
    resizeMode: 'contain',
  },
});
