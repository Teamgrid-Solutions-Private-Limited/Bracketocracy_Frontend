import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getLeaguesInMessage } from '@/components/redux/messageSlice';
import MemberItem from './MemberItem';
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteLeaguesUser, getLeagues } from "@/components/redux/leaguesSlice";
const LeagueItem = ({ isExpanded, onClick, onEdit, league, openModal, handleDelete }) => {
    const navigation = useNavigation();
    const [userMain, setUserMain] = useState(null);
    const dispatch = useDispatch();
    const handleLeagueTitleClick = (league) => {
        navigation.navigate("message")
        dispatch(getLeaguesInMessage(league))
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserMain(storedUserId);
                }
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };
        fetchUserData();
    }, [dispatch])


    const handleDeleteMembers = (userId) => {
        const leagueId = league._id;
        dispatch(deleteLeaguesUser({ leagueId, userId })).unwrap().then(() => {
            dispatch(getLeagues(userMain));
        })
    };
    return (<>
        <View style={styles.leagueItem} >
            <View style={styles.leagueTextContainer}>
                <Text style={styles.leagueName} onPress={() => handleLeagueTitleClick(league)}>{league.title}</Text>
                {league.userId[0] === userMain && <FontAwesome6 name="edit" size={20} color="red" onPress={() => onEdit(league)} />}
            </View>
            <AntDesign name={isExpanded ? "upcircle" : "downcircle"} size={20} onPress={onClick} color="#ebb04b" />
        </View>
        {isExpanded && (<>
            <View style={styles.memberContainer}>
                <View style={styles.memberHeader}>
                    <Text style={styles.memberHeaderText}>Members</Text>
                    <Text style={styles.memberHeaderText}>Points</Text>
                </View>
            </View>
            {league.userId?.length > 0 && (
                <MemberItem userIds={league.userId} league={league} />
            )}
            <View style={styles.chckboxContainer}>
                <Checkbox
                    value={league.allowInvitation}
                />
                <Text style={styles.checkboxLabel}>Allow members to invite friends?</Text>
            </View>
            <View style={styles.buttonContainer}>
                {league.userId[0] !== userMain ? (
                    league.allowInvitation &&
                    <TouchableOpacity style={styles.submitButton} onPress={openModal}>
                        <Text style={styles.buttonText} >Invite Friend</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.submitButton} onPress={openModal}>
                        <Text style={styles.buttonText} >Invite Friend</Text>
                    </TouchableOpacity>
                )}

                {league.userId[0] === userMain ? (
                    <TouchableOpacity style={styles.cancelButton} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Delete League</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleDeleteMembers(userMain)}>
                        <Text style={styles.buttonText}>Leave League</Text>
                    </TouchableOpacity>
                )}

            </View>
        </>)}
    </>
    )

}
export default LeagueItem;
const styles = StyleSheet.create({
    leagueName: {
        fontFamily: "nova",
        fontSize: 16,
        textTransform: "lowercase",
        fontWeight: "semibold"
    },

    memberHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 15,
        paddingVertical: 15,
    },
    leagueTextContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    memberContainer: {
        width: "87%",
    },
    memberHeaderText: {
        fontFamily: "nova",
        color: "#ebb04b",
        textTransform: "uppercase",
    },
    leagueItem: {
        width: "100%",
        height:"auto",
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 3,
        // marginBottom: 10,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        gap: 10
    }
    , submitButton: {
        flex: 1,
        backgroundColor: '#ebb04b',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
    , cancelButton: {
        flex: 1,
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    chckboxContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
        textTransform: "uppercase",
    },
})