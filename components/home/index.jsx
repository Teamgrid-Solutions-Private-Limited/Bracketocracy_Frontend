import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Users from "@/assets/images/user.jpg";
import { Ionicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import UsersBackground from '@/assets/images/basket-ball.svg';
import Header from '../header';
import Footer from '../footer';
import { fetchEditProfile } from '../redux/editProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


const IconBox = ({ title, IconComponent, iconName, iconSize, notificationsCount, onPress }) => (
    <View style={styles.contentWrapper}>
        <Text style={styles.contentWrapperText}>{title}</Text>
        <View style={styles.circle}>
            {onPress ? (
                <TouchableOpacity onPress={onPress}>
                    <IconComponent name={iconName} size={iconSize} color="#333333" />
                </TouchableOpacity>
            ) : (
                <IconComponent name={iconName} size={iconSize} color="#333333" />
            )}
            {notificationsCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationsCount}</Text>
                </View>
            )}
        </View>
    </View>
);

const Home = (props) => {
   
    const handleNavigateToMenu = () => {
        props.navigation.navigate("menu");
    };

    const handleNavigateToLeagues = () => {
        props.navigation.navigate("my-leagues");
    };

    const handleNavigateToBracket = () => {
        props.navigation.navigate("bracket");
    };
    
    const notificationsCount = 3;

    return (
        <View style={styles.main}>
            <Header />
            <View style={styles.content}>
                <View style={styles.contentBox}>
                    <IconBox
                        title="RANK"
                        IconComponent={FontAwesome5}
                        iconName="users"
                        iconSize={30}
                        onPress={handleNavigateToLeagues} 
                    />
                    <IconBox
                        title="NOTIFICATIONS"
                        IconComponent={Ionicons}
                        iconName="notifications"
                        iconSize={30}
                        notificationsCount={notificationsCount}
                    />
                </View>

                <View style={styles.middleContentBoxWrapper}>
                    <UsersBackground width={350} height={350} style={styles.background} />
                    <View style={styles.middleContentBox}>
                        <Image source={Users} style={styles.user} />
                    </View>
                </View>

                <View style={styles.contentBox}>
                    <IconBox
                        title="PICKS"
                        IconComponent={AntDesign}
                        iconName="checkcircle"
                        iconSize={30}
                        onPress={handleNavigateToBracket}
                    />
                    <IconBox
                        title="MAIN MENU"
                        IconComponent={Ionicons}
                        iconName="menu"
                        iconSize={35}
                        onPress={handleNavigateToMenu} 
                    />
                </View>
            </View>
            <Footer />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#f0efe9"
    },
    content: {
        marginTop: 10,
        flex: 1,
        justifyContent: 'space-between',
        padding: 25
    },
    contentBox: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    contentWrapper: {
        // justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 5
    },
    contentWrapperText: {
        fontFamily: "nova",
        fontSize: 18
    },
    middleContentBox: {
        height: 204,
        width: 204,
        borderRadius: 102,
        borderWidth: 4,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#CE9D3E",
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    middleContentBoxWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    background: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    user: {
        height: 200,
        width: 200,
        borderRadius: 100,
        resizeMode: 'cover',
    },
    circle: {
        height: 60,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#ebb04b',
        borderRadius: 30,
        borderWidth: 4,
        borderColor: "#CE9D3E",
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: 5,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold'
    }
});
