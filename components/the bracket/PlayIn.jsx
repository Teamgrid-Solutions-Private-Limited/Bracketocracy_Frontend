import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBets, placeBet, updateRound } from "../redux/betSlice";

const PlayIn = ({ matches, rounds, teams, getRemainingTime }) => {
  const [selectedTeams, setSelectedTeams] = useState({});
  const dispatch = useDispatch();
  const userBets = useSelector((state) =>
    state.bet.userBets && state.bet.userBets.length > 0
      ? state.bet.userBets
      : []
  );

  const handleTeamSelect = (matchId, teamName) => {
    rounds.map((val)=>{
      if (val.biddingEndDate &&
        getRemainingTime(val.biddingEndDate)) {
        return setSelectedTeams((prev) => ({
          ...prev,
          [matchId]: teamName,
        }));
      }
    })
  };

  useEffect(() => {
    const userId = "66c42a0a0d89d3b125998fe4";
    dispatch(fetchUserBets({ userId }));
  }, [dispatch]);

  useEffect(() => {
    const userId = "66c42a0a0d89d3b125998fe4"; 
    const seasonId = "66b5e399264761b0e2656168"; 
    const status = 0;

    if (Object.keys(selectedTeams).length > 0) {
      const [matchId, selectedWinner] = Object.entries(selectedTeams)[0];
      
      const matchingBets = userBets.filter((bet) => bet.matchId._id === matchId);

      if (matchingBets.length > 0) {
        matchingBets.forEach((existingBet) => {
          if (existingBet._id) {
            dispatch(updateRound({
              id: existingBet._id,
              matchId,
              userId,
              selectedWinner,
              status,
              seasonId
            }))
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
        dispatch(placeBet({
          matchId,
          userId,
          selectedWinner,
          status,
          seasonId
        }))
        .unwrap()
        .then(() => {
          dispatch(fetchUserBets({ userId }));
        })
        .catch((error) => {
          console.error("Failed to place bet:", error);
        });
      }

      setSelectedTeams({});
    }
  }, [selectedTeams, userBets, dispatch]);

  if (matches.length > 0) {
    const championMatchRound = matches.find(
      (match) => match?.round?.slug === "play-in-matches"
    );

    if (!championMatchRound) return null;

    return (
      <View style={styles.matchContainer}>
        {rounds.length > 0 &&
          rounds.map((round) => {
            if (round?.slug === "play-in-matches") {
              return (
                <View style={styles.container} key={round._id}>
                  <Text style={styles.title}>{round.name}</Text>
                  <Text style={styles.date}>
                    {moment(
                      round.playDate,
                      "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                    ).format("DD MMMM YYYY")}
                  </Text>
                  <Text style={styles.selectionPeriod}>
                    {round.biddingEndDate &&
                    getRemainingTime(round.biddingEndDate)
                      ? `SELECTION ENDS IN (${getRemainingTime(
                          round.biddingEndDate
                        )})`
                      : "SELECTION PERIOD ENDED"}
                  </Text>
                </View>
              );
            }
            return null;
          })}
        {matches.length > 0 &&
          matches.map((val) => {
            if (val?.round?.slug === "play-in-matches") {
              return (
                <View
                  style={[styles.bodyContainer, { marginBottom: 10 }]}
                  key={val._id}
                >
                  <View style={styles.bodyHeaderTextContainer}>
                    <Text style={styles.bodyHeaderText}>Pick your winner</Text>
                  </View>
                  <View style={styles.teamContainer}>
                    <Pressable
                      onPress={() =>
                        handleTeamSelect(val._id, val.teamOne.name)
                      }
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
                          {teams.find(
                            (team) => team.name === val.teamOne.name
                          ) && (
                            <Text style={styles.teamRank}>
                              {
                                teams.find(
                                  (team) => team.name === val.teamOne.name
                                ).seed
                              }
                            </Text>
                          )}
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
                            source={require("../../assets/images/basket-ball.png")}
                            style={styles.basketballImage}
                          />
                        </View>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        handleTeamSelect(val._id, val.teamTwo.name)
                      }
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
                          {teams.find(
                            (team) => team.name === val.teamTwo.name
                          ) && (
                            <Text style={styles.teamRank}>
                              {
                                teams.find(
                                  (team) => team.name === val.teamTwo.name
                                ).seed
                              }
                            </Text>
                          )}
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
                            source={require("../../assets/images/basket-ball.png")}
                            style={styles.basketballImage}
                          />
                        </View>
                      </View>
                    </Pressable>
                  </View>
                </View>
              );
            }
            return null;
          })}
      </View>
    );
  }
  return null; // In case matches are empty
};

export default PlayIn;

const styles = StyleSheet.create({
  matchContainer: {
    flex: 1,
    width: "96%",
    marginTop: -10,
    justifyContent: "center",
    marginBottom: -15,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#454134",
    padding: 10,
    width: "100%",
    maxHeight: 70,
    borderRadius: 5,
    marginTop: 12,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 15,
  },
  date: {
    color: "#d8690a",
    fontSize: 12,
  },
  selectionPeriod: {
    color: "#dacb16",
    fontSize: 12,
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
    fontSize: 11,
    marginRight: 10,
  },
  teamName: {
    fontSize: 15,
    marginRight: 10,
    color: "#888",
    fontWeight: "800",
  },
  selectTeam: {
    fontSize: 15,
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
});