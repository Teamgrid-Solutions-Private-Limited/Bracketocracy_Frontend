import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBets } from "@/components/redux/betSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRounds } from "@/components/redux/roundSlice";
import { getTeams } from "@/components/redux/teamSlice";

const HistoryItem = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const { userBets,loading } = useSelector((state) => state.bet);

  useEffect(() => {
    const getId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          setUserId(userId);
        } else {
          console.error("No userId found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error retrieving userId:", error);
      }
    };
    getId();
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserBets({ userId }));
    }
  }, [userId]);

  useEffect(() => {
    dispatch(getRounds());
    dispatch(getTeams());
  }, []);

  const rounds = useSelector((state) =>
    state.round.roundlist ? state?.round?.roundlist : []
  );
  const teams = useSelector((state) =>
    state.team.teams ? state.team.teams : []
  );

  return (
    <View style={{ flex: 1 ,position: 'relative'}}>
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>MY SELECTIONS</Text>
        </View>
        {[...userBets]?.reverse().map((match) => {
          if (!match.matchId) {
            console.warn("Missing matchId for match:", match);
            return null;
          }
          return (
            <View key={match._id} style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.label}>MATCHUP</Text>
                <Text style={styles.value}>
                  {teams.find((team) => team._id === match.matchId.teamOneId)?.name}
                  <Text style={styles.vsText}> Vs </Text>
                  {teams.find((team) => team._id === match.matchId.teamTwoId)?.name}
                </Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.label}>ROUND</Text>
                <Text style={styles.value}>
                  {rounds.find((round) => round.slug === match.matchId.roundSlug)?.name}
                </Text>
              </View>
              {match?.matchId?.zoneSlug && (
                <View style={styles.cardRow}>
                  <Text style={styles.label}>REGION</Text>
                  <Text style={styles.value}>
                    {match?.matchId?.zoneSlug}
                  </Text>
                </View>
              )}
              <View style={styles.cardRow}>
                <Text style={styles.label}>WINNER</Text>
                <Text style={styles.value}>
                  {match.matchId?.decidedWinner ? teams.find((team) => team._id === match.matchId.decidedWinner)?.name : "TBA"}
                </Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.label}>MY PICK</Text>
                <Text style={styles.value}>{match.selectedWinner.name}</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.label}>POINTS EARNED</Text>
                <Text style={styles.value}>
                  {match.matchId.roundSlug == "round-6" ?(match.matchId.decidedWinner == match.selectedWinner._id?match.points:-match.betScore) :match.points }
                </Text>
              </View>
              {match.matchId.roundSlug == "round-6" && (
                <View style={styles.cardRow}>
                  <Text style={styles.label}>BET POINTS</Text>
                  <Text style={styles.value}>
                    {match.matchId.roundSlug == "round-6" && match.betScore }
                  </Text>
                </View>
              )}

            </View>
          );
        })}
      </ScrollView>
      <Footer />
    </View>
    {loading && <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#d38f14" />
        </View>}
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  contentContainer: {
    padding: 16,
  },
  sectionHeader: {
    backgroundColor: "#454134",
    padding: 6,
    borderRadius: 6,
    marginTop: 15,
    marginBottom: 20,
  },
  sectionHeaderText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    padding: 0,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4C4C4C",
    marginLeft: 20,
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4C4C4C",
    marginRight: 20,
  },
  vsText: {
    marginHorizontal: 5,
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
});
