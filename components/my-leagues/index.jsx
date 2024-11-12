import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import profileImage from '../../assets/images/EmptyProfile.png';
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
import Loader from '../loader/Loader';
import { useFocusEffect } from '@react-navigation/native';
import { fetchNewSeasonIds } from '../redux/seasonsSlice';
const Index = ({ navigation }) => {
    const dispatch = useDispatch();
    const { editProfile } = useSelector((state) => state.editProfile);
    const { leagues, rankArr, error, leagueStatus } = useSelector((state) => state.leagues);
    const [modalVisible, setModalVisible] = useState(false);
    const [invitemodalVisible, setInviteModalVisible] = useState(false);
    const [expandedLeagueIndex, setExpandedLeagueIndex] = useState(null);
    const [currentLeague, setCurrentLeague] = useState(null);
    const [title, setTitle] = useState('');
    const [emails, setEmails] = useState('');
    const [inviteEmails, setInviteEmails] = useState('');
    const [allowInvitation, setAllowInvitation] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(10);
    // const {newSeasonIds}=useSelector((state) => state.seasons);


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
       
        const fetchUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    dispatch(fetchEditProfile(storedUserId));
                    dispatch(getLeagues(storedUserId));
                }
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };
        fetchUserData();

    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const newSeasonIds = await dispatch(fetchNewSeasonIds()).unwrap();
            if (newSeasonIds.length > 0) {
              dispatch(getRankArr(newSeasonIds[0]));
            }
          } catch (error) {
            console.error('Failed to fetch new season IDs:', error);
          }
        };
      
        fetchUserData();
      }, []);

    const userRank = rankArr?.find(rank => rank.userId._id === editProfile?._id);

    const handleDelete = (leagueId) => {
        Alert.alert(
            "Delete League",
            "Are you sure you want to delete this league?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        dispatch(deleteLeagues(leagueId))
                            .unwrap()
                            .then(() => {
                                dispatch(getLeagues(editProfile?._id));
                            })
                            .catch((error) => {
                                console.error("Failed to delete league:", error);
                            });
                    },
                },
            ],
            { cancelable: true }
        );
    };
    const handleLoadMore = () => {
        setItemsToShow(prev => prev + 10);
    };

    const handleLeaguePress = (leagueId) => {
        setExpandedLeagueIndex(prev => prev === leagueId ? null : leagueId);
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
                        imageSource={editProfile?.profilePhoto ? { uri: editProfile?.profilePhoto } : profileImage}
                        mainText={editProfile?.firstName + " " + editProfile?.lastName}
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
                {error?.message === "No leagues found for this user"? (
                    <View style={styles.noLeagues}>
                        <Text>No Leagues Found</Text>
                    </View>
                ) : (
                    leagueStatus === "loading" ? (
                        <View style={[styles.myLeagues, { paddingVertical: 20, backgroundColor: "transparent", shadowColor: "transparent" }]}>
                            <Loader size={35} />
                        </View>
                    ) : (
                        leagues.length > 0 &&
                        leagues.map((league) => (
                            <View style={styles.myLeagues} key={league._id}>
                                <LeagueItem
                                    handleLeaguePress={handleLeaguePress}
                                    isExpanded={expandedLeagueIndex === league._id}
                                    onEdit={onEdit}
                                    league={league}
                                    openModal={() => openModal("invite")}
                                    handleDelete={() => handleDelete(league._id)}
                                    invitemodalVisible={invitemodalVisible}
                                    inviteEmails={inviteEmails}
                                    setInviteEmails={setInviteEmails}
                                    closeModal={closeModal}
                                />
                            </View>
                        ))
                    )

                )}

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
                        <Text style={styles.tableHeaderText}>Members</Text>
                    </View>
                    <View style={styles.leaderBoardTableContent2}>
                        <Text style={styles.tableHeaderText}>Points</Text>
                        <Text style={styles.tableHeaderText}>Rank</Text>
                    </View>
                </View>
                {rankArr?.slice(0, itemsToShow).map((value, index) => (
                    <LeaderboardItem
                        key={index}
                        imageSource={value.userId.profilePhoto ? { uri: value.userId.profilePhoto } : profileImage}
                        name={value.userId.userName}
                        points={value.userId.score}
                        rank={value.rank}
                    />
                ))}
                {rankArr && rankArr.length > itemsToShow && (
                    <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                        <Text style={styles.buttonText}>Tap to See More</Text>
                    </TouchableOpacity>
                )}
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
        borderRadius: 5,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    scorecardText: {
        fontFamily: "nova",
        fontSize: 18,
        textAlign: "center",
        color: "white",
        textTransform: "uppercase"
    },
    profileContainer: {
        width: "85%",
        padding: 10,
        paddingTop: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
        borderRadius: 3,
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
        paddingHorizontal: 20,
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
        fontSize: 14,
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
        paddingHorizontal: 6,
        paddingVertical: 3,
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
    loadMoreButton: {
        backgroundColor: "#ebb04b",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
});
