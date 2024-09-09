import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteLeaguesUser, fetchMultipleProfiles, getLeagues } from "@/components/redux/leaguesSlice";
import { StyleSheet, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
const MemberItem = ({ userIds, league }) => {
    const { allUserId, status } = useSelector((state) => state.leagues);
    const [userMain, setUserMain] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserMain = async () => {
            try {
                const userIdFromStorage = await AsyncStorage.getItem('userId');
                setUserMain(userIdFromStorage);
            } catch (error) {
                console.error('Failed to fetch userMain from AsyncStorage:', error);
            }
        };
        fetchUserMain();
    }, []);

    useEffect(() => {
        if (userMain) {
            dispatch(getLeagues(userMain));
        }
    }, [userMain, dispatch]);

    useEffect(() => {
        if (userIds.length > 0) {
            dispatch(fetchMultipleProfiles(userIds));
        }
    }, [userIds, dispatch]);

    const handleDeleteMembers = (userId) => {
        const leagueId = league._id;
        dispatch(deleteLeaguesUser({ leagueId, userId })).unwrap().then(() => {
            dispatch(getLeagues(userMain));
        })
    };
    const profiles = allUserId
        .filter((profile) => userIds.includes(profile._id))
        .sort((a, b) => b.score - a.score);
    return (
        <View style={styles.memberItem}>
            {profiles.map((profile, index) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }} key={index}>
                    <View style={styles.memberTextContainer}>
                        <Text style={styles.memberText}>{profile.userName}</Text>
                        <Text style={styles.memberText}>{profile.score}</Text>
                    </View>
                    {userIds[0] === userMain && (
                        userMain !== profile._id &&
                        <Feather name="minus-circle" size={22} color="red" onPress={() => handleDeleteMembers(profile._id)} />
                    )
                    }
                </View>))}
        </View>
    );
};

export default MemberItem;

const styles = StyleSheet.create({
    memberItem: {
        padding: 15,
        paddingVertical: 5,
        width: "100%"
    },
    memberText: {
        fontSize: 14,
        // fontFamily: "nova",
        paddingVertical: 10,
    },
    memberTextContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 2,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 2,
        marginBottom: 10
    },
})