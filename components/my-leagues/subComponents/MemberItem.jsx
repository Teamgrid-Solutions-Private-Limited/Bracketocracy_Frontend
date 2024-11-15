import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {  fetchMultipleProfiles } from "@/components/redux/leaguesSlice";
import { StyleSheet, View, Text, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import profileImage from '../../../assets/images/EmptyProfile.png';
import Loader from "@/components/loader/Loader";
const MemberItem = ({ userIds, handleDeleteMembers, userMain ,league}) => {
    const [profiles, setProfiles] = useState([]);
    const dispatch = useDispatch();
    const { allUserId,status } = useSelector((state) => state.leagues);
    useEffect(() => {
        if (league.userId.length > 0) {
            dispatch(fetchMultipleProfiles(league.userId));
        }
    }, [league.userId]);
    useEffect(() => {
        if (allUserId?.length > 0) {
            setProfiles(allUserId?.filter((profile) => league.userId.includes(profile._id)).sort((a, b) => b.score - a.score));
        }
    }, [ allUserId]);
    return (
        <View style={styles.memberItem}>
            {status === "loading" ? <Loader /> : profiles && profiles?.map((profile) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }} key={profile._id}>
                    <View style={styles.memberTextContainer}>
                        <View style={styles.memberImageContainer}><Image  source={profile.profilePhoto ? { uri: profile.profilePhoto } : profileImage} style={styles.memberImage} /><Text style={styles.memberText}>{profile.firstName + " " + profile.lastName}</Text></View>
                        <Text style={[styles.memberText, styles.memberScore]}>{profile.score}</Text>
                    </View>
                    {userIds[0] === userMain && (
                        userMain !== profile._id &&
                        <Feather name="minus-circle" size={20} color="red" opacity={0.7} onPress={() => handleDeleteMembers(profile._id)} />
                    )
                    }
                </View>
            ))}

        </View>
    );
};

export default MemberItem;

const styles = StyleSheet.create({
    memberItem: {
        padding: 15,
        paddingTop: 5,
        paddingBottom: 0,
        width: "100%",
    },
    memberText: {
        fontSize: 14,
        // fontFamily: "nova",
        paddingVertical: 10,
        fontWeight: "600"
    },
    memberScore: {
        fontWeight: "400",
    },
    memberTextContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 2,
        paddingHorizontal: 10,
        paddingRight: 25,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,

    },
    memberImage: {
        width: 15,
        height: 15,
        borderRadius: 15,
        marginRight: 10
    },
    memberImageContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }
})