import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const StatsItem = ({ label, value, isButton }) => {
    const navigation =useNavigation();
    return(<View style={styles.statsItem}>
        <Text style={styles.statsText}>{label}</Text>
        {isButton ? (
            <TouchableOpacity style={styles.selectionHistoryButton} onPress={() => { navigation.navigate("history")}}>
                <Text style={styles.statsValue}>History</Text>
                <FontAwesome name="angle-right" size={20} color="#ebb04b" />
            </TouchableOpacity>
        ) : (
            <Text style={styles.statsValue}>{value}</Text>
        )}
    </View>)
    
};

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
        gap: 20
    },
    statsText: {
        fontFamily: "nova",
        fontSize: 14,
        color: "#ebb04b",
    },
    statsValue: {
        fontFamily: "nova",
        fontSize: 16,
    },
})