const { StyleSheet, View, Image, Text } = require("react-native");

const ProfileItem = ({ imageSource, mainText, subText }) => (
    <View style={styles.profileDetails}>
        <Image source={imageSource} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
            <Text style={styles.profileTextMain}>{mainText}</Text>
            <Text style={styles.profileText}>{subText}</Text>
        </View>
    </View>
);
export default ProfileItem;

const styles = StyleSheet.create({
    
    profileDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    },
    profileTextContainer: {
        flexDirection: "column"
    },
    profileTextMain: {
        fontFamily: "nova",
        fontSize: 16,
    },
    profileText: {
        fontSize: 14,
        color: "#ebb04b"
    },
})