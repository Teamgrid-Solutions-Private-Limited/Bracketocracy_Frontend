import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import profileImage from "@/assets/images/user.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { fetchEditProfile } from '../redux/editProfileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteLeagues, fetchAllUsers, getLeagues, getRankArr } from '../redux/leaguesSlice';
import CreateLeagueModal from './CreateLeagueModal';
import InviteFriendModal from './InviteFriendModal';
import Header from '../header';
import Footer from '../footer';
import LeaderboardItem from "./subComponents/LeaderboardItem"
import ProfileItem from "./subComponents/ProfileItem"
import StatsItem from "./subComponents/StatsItem"
import LeagueItem from "./subComponents/LeagueItem"
const Index = () => {
    const dispatch = useDispatch();
    const { editProfile, status } = useSelector((state) => state.editProfile);
    const { leagues, rankArr } = useSelector((state) => state.leagues);
    const [modalVisible, setModalVisible] = useState(false);
    const [invitemodalVisible, setInviteModalVisible] = useState(false);
    const [expandedLeagueIndex, setExpandedLeagueIndex] = useState(null);
    const [currentLeague, setCurrentLeague] = useState(null);
    const [title, setTitle] = useState('');
    const [emails, setEmails] = useState('');
    const [inviteEmails, setInviteEmails] = useState('');
    const [allowInvitation, setAllowInvitation] = useState(false);

    const openModal = (action) => {
        if (action === "invite") {
            setInviteModalVisible(true);
        }
        else {
            setModalVisible(true);
        }
    };
    const onEdit = (league) => {
        setCurrentLeague(league);
        openModal();
    }
    const closeModal = (action) => {
        if (action === "invite") {
            setInviteModalVisible(false);
            setInviteEmails('');
        } else {
            setCurrentLeague(null);
            setTitle('');
            setEmails('');
            setAllowInvitation(false);
            setModalVisible(false);
        }
    };
    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(getRankArr());
        const fetchUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    dispatch(fetchEditProfile(storedUserId));
                }
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };
        fetchUserData();

    }, [dispatch]);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    dispatch(getLeagues(storedUserId));
                }
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };
        fetchUserData();
    }, [deleteLeagues, dispatch])

    const userRank = rankArr.find(rank => rank.userId._id === editProfile?._id);

    const handleLeaguePress = (index, league) => {
        setExpandedLeagueIndex(expandedLeagueIndex === index ? null : index);
    };
    const handleDelete = (leagueId) => {
        dispatch(deleteLeagues(leagueId))
    };
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <ScrollView style={styles.main} contentContainerStyle={{ alignItems: "center" }}>
                <View style={styles.scorecard}>
                    <Text style={styles.scorecardText}>MY SCORECARD</Text>
                </View>
                <View style={styles.profileContainer}>
                    <ProfileItem
                        imageSource={profileImage}
                        mainText={editProfile?.userName}
                        subText={editProfile?.email}
                    />
                    <View style={styles.statsContainer}>
                        <StatsItem label="Rank" value={userRank && userRank.rank} />
                        <StatsItem label="Points" value={editProfile?.score} />
                        <StatsItem label="Selection" isButton />
                    </View>
                </View>
                <View style={styles.scorecard}>
                    <Text style={styles.scorecardText}>My Leagues</Text>
                </View>
                {leagues && leagues.length > 0 ? (leagues?.map((league, index) => (
                    <View style={styles.myLeagues} key={index}>
                        <LeagueItem
                            isExpanded={expandedLeagueIndex === index}
                            onClick={() => handleLeaguePress(index, league)
                            }
                            onEdit={onEdit}
                            league={league}
                            openModal={() => openModal("invite")}
                            handleDelete={() => handleDelete(league._id)}
                        />

                        {expandedLeagueIndex === index && (<>
                            <InviteFriendModal visible={invitemodalVisible} onClose={() => closeModal("invite")} emails={inviteEmails} setEmails={setInviteEmails} league={league._id} />
                        </>
                        )}

                    </View>
                ))) : <View style={styles.noLeagues} ><Text>No Leagues Found</Text></View>}

                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.createButton} onPress={openModal}>
                        <Text style={styles.buttonText}>CREATE NEW LEAGUE</Text>
                    </TouchableOpacity>
                </View>
                <CreateLeagueModal visible={modalVisible} onClose={closeModal} currentLeague={currentLeague} title={title} emails={emails} allowInvitation={allowInvitation} setTitle={setTitle} setEmails={setEmails} setAllowInvitation={setAllowInvitation} />
                <View style={styles.scorecard}>
                    <Text style={styles.scorecardText}>Global Leaderboard</Text>
                </View>
                <View style={styles.leaderBoardTableHeader}>
                    <View style={styles.leaderBoardTableContent}>
                        <Text style={styles.tableHeaderText}>Name</Text>
                    </View>
                    <View style={styles.leaderBoardTableContent2}>
                        <Text style={styles.tableHeaderText}>Points</Text>
                        <Text style={styles.tableHeaderText}>Rank</Text>
                    </View>
                </View>
                {rankArr?.map((value, index) => (
                    <LeaderboardItem
                        key={index}
                        imageSource={profileImage}
                        name={value.userId.userName}
                        points={value.userId.score}
                        rank={value.rank}
                    />
                ))}
            </ScrollView>
            <Footer />
        </View>
    );
};
export default Index;

const styles = StyleSheet.create({
    main: {
        marginTop: 10,
        flex: 1,
        backgroundColor: "#f2f1ed",
    },
    scorecard: {
        marginVertical: 15,
        width: "85%",
        backgroundColor: "#454134",
        borderRadius: 3,
        padding: 10,
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    scorecardText: {
        fontFamily: "nova",
        fontSize: 22,
        textAlign: "center",
        color: "white",
        textTransform: "uppercase"
    },
    profileContainer: {
        width: "85%",
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    buttonWrapper: {
        width: "85%",
        display: "flex",
        alignItems: "flex-end",
    },
    createButton: {
        backgroundColor: "#ebb04b",
        padding: 10,
        textTransform: "uppercase",
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
        textTransform: "uppercase",
    },
    subHeader: {
        display: "flex",
        justifyContent: "center",
    },
    subHeaderText: {
        width: "85%",
        backgroundColor: "#454134"
    },
    myLeagues: {
        marginBottom: 12,
        width: "85%",
        borderRadius: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    leaderBoardTableHeader: {
        width: "85%",
        flexDirection: "row",
        marginBottom: 10
    },
    leaderBoardTableContent: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        paddingLeft: 10
    },
    leaderBoardTableContent2: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    tableHeaderText: {
        fontSize: 15,
        fontFamily: "nova",
        color: "#ebb04b",
        textTransform: "uppercase"
    },
    
    rightArrow: {
        width: 10,
        height: 10,
        resizeMode: 'contain',
        marginLeft: 10
    },
    noLeagues: {
        fontFamily: "nova",
        color: "#ebb04b",
        textTransform: "uppercase",
        justifyContent: "center",
        borderRadius: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
        width: "85%",
        padding: 15,
        marginBottom: 10,
    },
});
