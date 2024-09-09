import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View, Image } from 'react-native';
import Background from "../../assets/images/bk-Splash-screen.jpg";
import Logo from "@/assets/images/logoLight.png";

const Index = (props) => {
    const logoPosition = useRef(new Animated.Value(-100)).current;
    const textScale = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        setTimeout(() => {
            props.navigation.replace("home")
        }, 3000)
        Animated.timing(logoPosition, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
        Animated.timing(textScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);
  
    return (
        <ImageBackground source={Background} style={styles.main}>
            <View style={styles.container}>
                <Animated.View style={{ transform: [{ translateY: logoPosition }] }}>
                    <Image source={Logo} style={styles.logo} />
                </Animated.View>
                <Animated.Text style={[styles.madnessText, { transform: [{ scale: textScale }] }]}>
                    Let madness reign
                </Animated.Text>
            </View>
        </ImageBackground>
    );
}

export default Index;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    container: {
        marginTop: 50,
        width: "85%",
        height: "30%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    madnessText: {
        fontSize: 20,
        color: "#D88D28",
        textAlign: "center",
        textTransform: "uppercase"
    },
    logo: {
        width: 220,
        height: 40,
    }
});
