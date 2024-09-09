import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchEditProfile } from "../redux/editProfileSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = (props) => {
  const profileData = props.editProfile
  const navigation = useNavigation();
  const route = useRoute();
  const isHomeScreen = route.name === 'home';
  const isEditProfile = route.name === 'edit-profile';
  const dispatch = useDispatch();
  const { editProfile } = useSelector((state) => state.editProfile);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          dispatch(fetchEditProfile(storedUserId));
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };
    if (!isEditProfile) {
      fetchUserData();
    }

  }, [dispatch]);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../../assets/images/bracketocracy-mob-logo-light.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.subtitle}>{editProfile ? editProfile.firstName + " " + editProfile.lastName : profileData?.firstName + " " +  profileData?.lastName}</Text>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('edit-profile')}>
            <Image
              source={require("../../assets/images/user.png")}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {!isHomeScreen && (
        <TouchableOpacity style={styles.bottomRow} onPress={() => navigation.navigate('menu')}>
          <Ionicons name="menu" size={24} color="white" />
          <Text style={styles.menuText}>MAIN MENU</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 1000,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    backgroundColor: "#454134",
    borderColor: "#CE9D3E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderBottomWidth: 3,
    
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    height: 60,
    
  },
  rightContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 170,
    height: 33,
  },
  subtitle: {
    display: "flex",
    fontSize: 12,
    flexWrap:"nowrap",
    color: "#fff",
    textTransform: "uppercase",
   
  },
  profileButton: {
    display: "flex",
    width: 35,
    height: 35,
    borderWidth: 2,
    borderColor: "#CE9D3E",
    borderRadius: 17.5,
    backgroundColor: "gray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 30,
    height: 30,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom:-15,
    backgroundColor: "#d38f14",
    width: "70%",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#CE9D3E",
    paddingVertical: 1,
   gap: 5
  },
  menuButton: {
    marginRight: 10,
    padding: 3,
  },
  menuImage: {
    width: 25,
    height: 20,
  },
  menuText: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "#fff",
   
    fontFamily: "nova",
  },
});
