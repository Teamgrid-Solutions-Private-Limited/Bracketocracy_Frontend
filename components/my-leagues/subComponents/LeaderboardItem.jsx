import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
const LeaderboardItem = ({ imageSource, name, points, rank }) => (
    <View style={styles.leaderboardItem}>
        <View style={styles.leaderboardTextContainer}>
            <Image source={imageSource} style={styles.leaderboardImage} />
            <Text style={styles.leaderboardName}>{name}</Text>
        </View>
        <View style={styles.leaderboardStatsContainer}>
            <Text style={styles.leaderboardStats}>{points}</Text>
            <Text style={styles.leaderboardStats}>{rank}</Text>
        </View>
    </View>
);
export default LeaderboardItem;

const styles = StyleSheet.create({
    leaderboardItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        marginBottom: 15,
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    leaderboardImage: {
        width: 20,
        height: 20,
        borderRadius: 15,
        marginLeft: 10,
        marginRight: 10
    },
    leaderboardTextContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    leaderboardName: {
        fontSize: 14,
        fontFamily: "nova",
    },
    leaderboardStatsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    leaderboardStats: {
        fontSize: 14,

    },
})