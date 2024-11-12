import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import React from 'react';
import { Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import menu from "@/assets/images/bk-menu.jpg";
import { useDispatch } from 'react-redux';
import { logOut } from '../redux/loginSlice';
import { resetLeagues } from '../redux/leaguesSlice';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NavigationButton = ({ onPress, text, icon }) => (
    <TouchableOpacity onPress={onPress} style={styles.navigationButton}>
        {icon && <Entypo name={icon} size={30} color="white" />}
        <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
);

const BottomButton = ({ onPress, text, IconComponent, iconName, iconSize }) => (
    <TouchableOpacity style={styles.bottomIcon} onPress={onPress}>
        <IconComponent name={iconName} size={iconSize} color="#ebb04b" />
        <Text style={styles.bottomText}>{text}</Text>
    </TouchableOpacity>
);

const Index = (props) => {
    const dispatch = useDispatch();
    const handleCloseComponent = () => {
        props.navigation.navigate("home");
    };
    const handleGoToInstractions = () => {
        props.navigation.navigate("how-to-play");
    };
    const handleGoToLeagues = () => {
        props.navigation.navigate("my-leagues");
    };
    const handleGoToEditProfile = () => {
        props.navigation.navigate("edit-profile");
    };
    const handleGoToBrackets = () => {
        props.navigation.navigate("bracket");
    };
    async function googleLogout() {
        try {
          const userAccessToken = await AsyncStorage.getItem('userToken');
          console.log("User access token:", userAccessToken);
          await AuthSession.revokeAsync(
            {
              token: userAccessToken, // Replace this with the actual access token
            },
            {
              revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
            }
          );
      
          // Perform any additional logout actions here, like clearing the Redux or AsyncStorage state.
          console.log("Logged out from Google");
        } catch (error) {
          console.error("Failed to log out", error);
        }
      }
    const handleLogout = async() => {
        if (Platform.OS === 'web') {
            const confirmation = window.confirm('Are you sure you want to log out?');
            if (!confirmation) return;
         await googleLogout();
            dispatch(resetLeagues());
            dispatch(logOut());
           
            props.navigation.replace("sign-in")
        }
        else {
            Alert.alert(
                "Logout",
                "Are you sure you want to log out?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Yes",
                        onPress: async () => {
                            try {
                                dispatch(resetLeagues());
                                await dispatch(logOut());
                                props.navigation.replace("sign-in")
                            } catch (error) {
                                console.error("Failed to logout:", error);
                                Alert.alert("Logout Failed", "There was an issue logging out. Please try again.");
                            }
                        },
                    },
                ],
                { cancelable: true }
            );
        }

    };

    return (
        <ImageBackground style={styles.menuMain} source={menu}>
            <View style={styles.topWrapper}>
                <View style={styles.buttonWrapper}>
                    <NavigationButton onPress={handleCloseComponent} icon="cross" />
                </View>
                <View style={styles.container}>
                    <NavigationButton onPress={handleCloseComponent} text="Home" />
                    <NavigationButton onPress={handleGoToBrackets} text="The Bracket" />
                    <NavigationButton onPress={handleGoToLeagues} text="My leagues" />
                    <NavigationButton onPress={handleGoToInstractions} text="How to play" />
                </View>
            </View>

            <View style={styles.bottomWrapper}>
                <BottomButton
                    onPress={handleGoToEditProfile}
                    text="Edit profile"
                    IconComponent={FontAwesome5}
                    iconName="edit"
                    iconSize={16}
                />
                <BottomButton
                    onPress={handleLogout}
                    text="Logout"
                    IconComponent={MaterialIcons}
                    iconName="logout"
                    iconSize={22}
                />
            </View>
        </ImageBackground>
    );
};

export default Index;

const styles = StyleSheet.create({
    menuMain: {
        flex: 1,
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-between",
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 30,
        alignItems: "center",
    },
    text: {
        fontFamily: "nova",
        fontSize: 30,
        color: "white",
        textTransform: "uppercase",
    },
    topWrapper: {
        flex: 1,
    },
    buttonWrapper: {
        width: "100%",
        padding: 12,
        paddingBottom: 0,
        paddingBottom: 0,
        alignItems: "flex-end",
    },
    navigationButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    bottomIcon: {
        display: "flex",
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    bottomWrapper: {
        // marginTop: 20,
        alignItems:'flex-end',
        flex: 1,
        padding: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bottomText: {
        fontFamily: "nova",
        fontSize: 15,
        color: "white",
        textTransform: "uppercase",
    },
});
