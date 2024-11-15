import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaguesInMessage } from '@/components/redux/messageSlice';
import MemberItem from './MemberItem';
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteLeaguesUser, fetchMultipleProfiles, getLeagues } from "@/components/redux/leaguesSlice";
import InviteFriendModal from "../InviteFriendModal";
const LeagueItem = ({ onEdit, league, isExpanded, openModal, handleDelete, invitemodalVisible, inviteEmails, setInviteEmails, closeModal, handleLeaguePress }) => {
    const navigation = useNavigation();
    const [userMain, setUserMain] = useState("");
    const dispatch = useDispatch();
    const handleLeagueTitleClick = (clickedLeague) => {
        navigation.navigate("message")
        dispatch(getLeaguesInMessage(clickedLeague))
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
    }, [])


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
                {league.userId[0] === userMain && <FontAwesome6 name="edit" size={20} color="red" opacity={0.6} onPress={() => onEdit(league)} />}
            </View>
            <AntDesign name={isExpanded ? "upcircle" : "downcircle"} size={20} onPress={() => handleLeaguePress(league._id)} color="#ebb04b" />
        </View>
        {isExpanded && (<>
            <View style={styles.memberContainer}>
                <View style={styles.memberHeader}>
                    <Text style={styles.memberHeaderText}>Members</Text>
                    <Text style={styles.memberHeaderText}>Points</Text>
                </View>
            </View>
                <MemberItem userIds={league.userId} league={league} handleDeleteMembers={handleDeleteMembers} userMain={userMain}  />
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
            <InviteFriendModal visible={invitemodalVisible} onClose={() => closeModal("invite")} emails={inviteEmails} setEmails={setInviteEmails} league={league._id} />
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
        paddingTop: 15,
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
        height: "auto",
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
        paddingHorizontal:10,
        gap: 15
    }
    , submitButton: {
        flex: 1,
        backgroundColor: '#ebb04b',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
    , cancelButton: {
        flex: 1,
        backgroundColor: 'red',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 3,
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
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
        textTransform: "uppercase",
    },
})