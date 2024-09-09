import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const StatsItem = ({ label, value, isButton }) => (
    <View style={styles.statsItem}>
        <Text style={styles.statsText}>{label}</Text>
        {isButton ? (
            <TouchableOpacity style={styles.selectionHistoryButton}>
                <Text style={styles.statsValue}>History</Text>
                <FontAwesome name="angle-right" size={24} color="#ebb04b" />
            </TouchableOpacity>
        ) : (
            <Text style={styles.statsValue}>{value}</Text>
        )}
    </View>
);

export default StatsItem;

const styles = StyleSheet.create({
    statsItem: {
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    selectionHistoryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 5
    },
    statsText: {
        fontFamily: "nova",
        fontSize: 14,
        color: "#ebb04b",
        textTransform: "uppercase",
    },
    statsValue: {
        fontFamily: "nova",
        fontSize: 16,
        textTransform: "uppercase"
    },
})