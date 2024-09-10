import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBets, placeBet, updateRound } from "../redux/betSlice";

const ChampionMatch = ({
  matches,
  rounds,
  teams,
  getRemainingTime,
  userId,
}) => {
  const [selectedTeams, setSelectedTeams] = useState({});
  const dispatch = useDispatch();
  const userBets = useSelector((state) =>
    state.bet.userBets && state.bet.userBets.length > 0
      ? state.bet.userBets
      : []
  );
  // console.log(userBets,'userbets');

  const [disabled, setDisabled] = useState(false);
  const handleTeamSelect = (matchId, teamName) => {
    // Check if bidding period is over for the specific match
    rounds.find((round) => {
      if (round.slug === "champion-match") {
        const { formattedTime, remainingTimeInMs } = getRemainingTime(
          round.biddingEndDate
        );

        if (remainingTimeInMs <= 0) {
          // console.log(
          //   "Bidding period is over. Can't select team",
          //   remainingTimeInMs
          // );
          return setDisabled(true);
        } else return setDisabled(false);

        // console.log(`Remaining time for bidding: ${formattedTime}`);
      }
    });
    // console.log(round, "round");

    // Find the selected team's ID based on the teamName
    const selectedTeam = teams.find((team) => team.name === teamName);
    if (!selectedTeam) {
      // console.log("Team not found.");
      return;
    }

    // Update the selected team for the match using the team ID
    setSelectedTeams((prev) => ({
      ...prev,
      [matchId]: selectedTeam._id, // Store the ID instead of name
    }));

    // console.log(
    //   `Selected team ${selectedTeam.name} (ID: ${selectedTeam._id}) for match ${matchId}`
    // );
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserBets({ userId }));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (!disabled && userId && Object.keys(selectedTeams).length > 0) {
      const seasonId = "66b5e399264761b0e2656168";
      const status = 0;

      const [matchId, selectedWinnerId] = Object.entries(selectedTeams)[0]; // `selectedWinnerId` should be an ID

      // Find if the user has already placed a bet on this match
      const matchingBets = userBets.filter(
        (bet) => bet.matchId._id === matchId
      );

      if (matchingBets.length > 0) {
        // If there's an existing bet, update it
        matchingBets.forEach((existingBet) => {
          if (existingBet._id) {
            dispatch(
              updateRound({
                id: existingBet._id,
                matchId,
                userId,
                selectedWinner: selectedWinnerId, // Use ID here
                status,
                seasonId,
              })
            )
              .unwrap()
              .then(() => {
                dispatch(fetchUserBets({ userId }));
              })
              .catch((error) => {
                // console.error("Failed to update round:", error);
              });
          }
        });
      } else {
        // Place a new bet if there's no existing one
        dispatch(
          placeBet({
            matchId,
            userId,
            selectedWinner: selectedWinnerId, // Use ID here
            status,
            seasonId,
          })
        )
          .unwrap()
          .then(() => {
            dispatch(fetchUserBets({ userId }));
          })
          .catch((error) => {
            // console.error("Failed to place bet:", error);
          });
      }

      // Clear the selected team for the processed match
      setSelectedTeams({});
    }
  }, [selectedTeams, userBets, dispatch, userId, disabled]);

  // console.log("Selected teams:", selectedTeams);
  // console.log("User bets:", userBets);

  if (matches.length > 0) {
    const championMatchRound = matches.find(
      (matches) => matches?.round?.slug === "champion-match"
    );

    if (!championMatchRound) return null;

    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          {rounds.length > 0 &&
            rounds.map((round) => {
              if (round?.slug === "champion-match") {
                return (
                  <View style={styles.header} key={round._id}>
                    <Text style={styles.headerText}>{round.name}</Text>
                    <Text style={styles.dateText}>
                      {moment(round.playDate).format("DD MMMM YYYY")}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
          {matches.length > 0 &&
            matches.map((val, index) => {
              if (val?.round?.slug === "champion-match") {
                return (
                  <View style={styles.matchContainer} key={index}>
                    <View
                      style={
                        userBets.length > 0 &&
                        userBets.some(
                          (bet) => bet.selectedWinner._id === val.teamOne._id
                        )
                          ? styles.SeletedTeamContainer
                          : styles.teamContainer
                      }
                    >
                      <Pressable
                        onPress={() => {
                          handleTeamSelect(val._id, val.teamOne.name);
                        }}
                        disabled={disabled}
                      >
                        <View style={styles.teamDetails}>
                          <Image
                            source={{ uri: val.teamOne.logo }}
                            style={styles.teamLogo}
                            resizeMode="cover"
                          />
                          <Text
                            style={[
                              val.teamOneScore > val.teamTwoScore
                                ? styles.selectTeam
                                : styles.teamName,
                              { marginRight: 10 },
                            ]}
                          >
                            {val.teamOne.name}
                          </Text>
                        </View>
                      </Pressable>
                      <View style={styles.scoreContainer}>
                        <Text
                          style={
                            val.teamOneScore > val.teamTwoScore
                              ? styles.selectScore
                              : styles.scoreTop
                          }
                        >
                          {val.teamOneScore}
                        </Text>
                        {teams.length > 0 &&
                          teams.map((team) => {
                            if (val?.teamOne?.name === team?.name) {
                              return (
                                <Text style={styles.score} key={team._id}>
                                  {team.seed}
                                </Text>
                              );
                            }
                            return null;
                          })}
                      </View>
                    </View>

                    <View
                      style={
                        userBets.length > 0 &&
                        userBets.some(
                          (bet) => bet.selectedWinner._id === val.teamTwo._id
                        )
                          ? styles.SeletedTeamContainer
                          : styles.teamContainer
                      }
                    >
                      <View style={styles.scoreContainer}>
                        <Text
                          style={
                            val.teamTwoScore > val.teamOneScore
                              ? styles.selectScore
                              : styles.scoreTop
                          }
                        >
                          {val.teamTwoScore}
                        </Text>
                        {teams.length > 0 &&
                          teams.map((team) => {
                            if (val?.teamTwo?.name === team?.name) {
                              return (
                                <Text style={styles.score} key={team._id}>
                                  {team.seed}
                                </Text>
                              );
                            }
                            return null;
                          })}
                      </View>
                      <Pressable
                        onPress={() => {
                          handleTeamSelect(val._id, val.teamTwo.name);
                        }}
                        disabled={disabled}
                      >
                        <View style={styles.teamDetails}>
                          <Image
                            source={{ uri: val.teamTwo.logo }}
                            style={styles.teamLogo}
                            resizeMode="cover"
                          />
                          <Text
                            style={[
                              val.teamTwoScore > val.teamOneScore
                                ? styles.selectTeam
                                : styles.teamName,
                              { marginLeft: 10 },
                            ]}
                          >
                            {val.teamTwo.name}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                );
              }
              return null;
            })}
        </View>
        <View style={styles.separator}></View>
        {matches.length > 0 &&
          matches.map((val, index) => {
            if (val?.round?.slug === "champion-match") {
              return (
                <View style={styles.championContainer} key={index}>
                  <Text style={styles.championText}>Champion</Text>
                  <Image
                    source={
                      val.teamOneScore
                        ? { uri: val.teamOne.logo }
                        : { uri: val.teamTwo.logo }
                    }
                    style={styles.championLogo}
                  />
                  <Text style={styles.championTeamName}>
                    {val.teamOneScore ? val.teamOne.name : val.teamTwo.name}
                  </Text>
                </View>
              );
            }
            return null;
          })}
      </View>
    );
  }
};

export default ChampionMatch;

const styles = StyleSheet.create({
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f2f1ed",
  },
  outerContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 60,
  },
  container: {
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    width: "96%",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#454134",
  },
  dateText: {
    fontSize: 16,
    color: "#4d4c47",
  },
  matchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
    paddingHorizontal: 16,
  },
  SeletedTeamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
    paddingHorizontal: 16,
    backgroundColor: "#ebb04b",
  },
  teamDetails: {
    alignItems: "center",
    justifyContent: "center",
  },
  teamLogo: {
    marginBottom: 8,
    width: 50,
    height: 50,
  },
  selectTeam: {
    color: "#000",
    fontSize: 17,
    fontWeight: "400",
    textAlign: "center",
    fontWeight: "800",
  },
  teamName: {
    fontSize: 15,
    fontWeight: "400",
    color: "#000",
    textAlign: "center",
    fontWeight: "800",
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontSize: 12,
    color: "#000",
  },
  scoreTop: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  selectScore: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4d4c47",
  },
  separator: {
    width: 1,
    backgroundColor: "#888",
    height: 20,
  },
  championContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    padding: 10,
    paddingHorizontal: 55,
  },
  championText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#454134",
  },
  championLogo: {
    marginBottom: 8,
    width: 80,
    height: 80,
  },
  championTeamName: {
    fontSize: 15,
    fontWeight: "100",
    color: "#4d4c47",
    fontWeight: "800",
  },
});
