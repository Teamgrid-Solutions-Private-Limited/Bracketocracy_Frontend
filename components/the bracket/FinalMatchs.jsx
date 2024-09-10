import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBets, placeBet, updateRound } from "../redux/betSlice";

const FinalMatchs = ({ matches, rounds, teams, getRemainingTime, userId }) => {
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
      if (round.slug === "final-4") {
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
      console.log("Team not found.");
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
                console.error("Failed to update round:", error);
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

  //   console.log("Selected teams:", selectedTeams);
  // console.log("User bets:", userBets);

  if (matches.length > 0) {
    const championMatchRound = matches.find(
      (matches) => matches?.round?.slug === "final-4"
    );

    if (!championMatchRound) return null;

    return (
      <View style={styles.matchContainer}>
        {rounds.map((round) => {
          if (round.slug === "final-4") {
            return (
              <View style={styles.headerContainer} key={round._id}>
                <Text style={styles.headerText}>{round.name}</Text>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>
                    {moment(round.playDate).format("DD MMMM YYYY")}
                  </Text>
                  <Text style={styles.subHeaderText}>
                    {round.biddingEndDate
                      ? // Extract formattedTime from the result of getRemainingTime
                        (() => {
                          const { formattedTime } = getRemainingTime(
                            round.biddingEndDate
                          );
                          return formattedTime
                            ? `SELECTION ENDS IN (${formattedTime})`
                            : "SELECTION PERIOD ENDED";
                        })()
                      : "SELECTION PERIOD ENDED"}
                  </Text>
                </View>
              </View>
            );
          }
        })}
        {matches.length > 0 &&
          matches.map((val, index) => {
            if (val?.round?.slug === "final-4") {
              return (
                <View
                  style={[styles.bodyContainer, { marginBottom: 10 }]}
                  key={index}
                >
                  <View style={styles.bodyHeaderTextContainer}>
                    <Text style={styles.bodyHeaderText}>Pick your winner</Text>
                  </View>

                  <View style={styles.teamContainer}>
                    <Pressable
                      onPress={() =>
                        handleTeamSelect(val._id, val.teamOne.name)
                      }
                      disabled={disabled}
                    >
                      <View
                        style={
                          userBets.length > 0 &&
                          userBets.some(
                            (bet) => bet.selectedWinner._id === val.teamOne._id
                          )
                            ? styles.teamDetailsHighlight
                            : styles.teamDetails
                        }
                      >
                        <View style={styles.teamInfo}>
                          <Image
                            source={{ uri: val.teamOne.logo }}
                            style={styles.teamLogo}
                            resizeMode="cover"
                          />
                          {teams.length > 0 &&
                            teams.map((team) => {
                              if (val?.teamOne?.name === team?.name) {
                                return (
                                  <Text style={styles.teamRank} key={team._id}>
                                    {team.seed}
                                  </Text>
                                );
                              }
                            })}
                          <Text
                            style={
                              val.teamOneScore > val.teamTwoScore
                                ? styles.selectTeam
                                : styles.teamName
                            }
                          >
                            {val.teamOne.name}
                          </Text>
                        </View>
                        <View style={styles.teamScoreContainer}>
                          <Text
                            style={
                              val.teamOneScore > val.teamTwoScore
                                ? styles.selectTeam
                                : styles.teamName
                            }
                          >
                            {val.teamOneScore}
                          </Text>

                          <Image
                            source={
                              userBets.length > 0 &&
                              userBets.some(
                                (bet) =>
                                  bet.selectedWinner._id === val.teamOne._id
                              )
                                ? require("../../assets/images/basket-ball2.png")
                                : require("../../assets/images/basket-ball.png")
                            }
                            style={styles.basketballImage}
                          />
                        </View>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        handleTeamSelect(val._id, val.teamTwo.name)
                      }
                      disabled={disabled}
                    >
                      <View
                        style={
                          userBets.length > 0 &&
                          userBets.some(
                            (bet) => bet.selectedWinner._id === val.teamTwo._id
                          )
                            ? styles.teamDetailsHighlight
                            : styles.teamDetails
                        }
                      >
                        <View style={styles.teamInfo}>
                          <Image
                            source={{ uri: val.teamTwo.logo }}
                            style={styles.teamLogo}
                            resizeMode="cover"
                          />
                          {teams.length > 0 &&
                            teams.map((team) => {
                              if (val?.teamTwo?.name === team?.name) {
                                return (
                                  <Text style={styles.teamRank} key={team._id}>
                                    {team.seed}
                                  </Text>
                                );
                              }
                            })}
                          <Text
                            style={
                              val.teamTwoScore > val.teamOneScore
                                ? styles.selectTeam
                                : styles.teamName
                            }
                          >
                            {val.teamTwo.name}
                          </Text>
                        </View>
                        <View style={styles.teamScoreContainer}>
                          <Text
                            style={
                              val.teamTwoScore > val.teamOneScore
                                ? styles.selectTeam
                                : styles.teamName
                            }
                          >
                            {val.teamTwoScore}
                          </Text>

                          <Image
                            source={
                              userBets.length > 0 &&
                              userBets.some(
                                (bet) =>
                                  bet.selectedWinner._id === val.teamTwo._id
                              )
                                ? require("../../assets/images/basket-ball2.png")
                                : require("../../assets/images/basket-ball.png")
                            }
                            style={styles.basketballImage}
                          />
                        </View>
                      </View>
                    </Pressable>
                  </View>
                </View>
              );
            }
          })}
      </View>
    );
  }
};

export default FinalMatchs;

const styles = StyleSheet.create({
  matchContainer: {
    flex: 1,
    padding: 7,
    width: "100%",
    marginTop: "-3%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
    backgroundColor: "#454134",
    paddingHorizontal: 20,
    // gap: 25,
    paddingVertical: 5,
    borderRadius: 1,
    flex: 1,
  },
  headerText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  dateContainer: {
    alignItems: "flex-end",
    gap: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#d8690a",
  },
  subHeaderText: {
    fontSize: 10,
    color: "#dacb16",
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    height: 100,
  },
  bodyHeaderTextContainer: {
    position: "absolute",
    left: "65%",
    zIndex: 10,
  },
  bodyHeaderText: {
    fontSize: 13,
    marginTop: 10,
  },
  teamContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 25,
  },
  teamDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    padding: 5,
  },
  teamDetailsHighlight: {
    backgroundColor: "#ebb04b",
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    padding: 5,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamLogo: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  teamRank: {
    fontSize: 12,
    marginRight: 10,
  },
  teamName: {
    fontSize: 15,
    marginRight: 10,
    color: "#000",
    fontWeight: "800",
  },
  selectTeam: {
    fontSize: 17,
    marginRight: 10,
    color: "#000",
    fontWeight: "800",
  },
  basketballImage: {
    width: 24,
    height: 24,
    backgroundColor: "#000",
    borderRadius: 12,
  },
  teamScore: {
    fontSize: 10,
    marginRight: 10,
    color: "#888",
  },
});
