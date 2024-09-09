import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";

const FinalMatchs = ({ matches, rounds, teams, getRemainingTime }) => {
  const [selectedTeams, setSelectedTeams] = useState({});

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
                    {moment(
                      round.playDate,
                      "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                    ).format("DD MMMM YYYY")}
                  </Text>
                  <Text style={styles.subHeaderText}>
                    {round.biddingEndDate &&
                    getRemainingTime(round.biddingEndDate)
                      ? `SELECTION ENDS IN (${getRemainingTime(
                          round.biddingEndDate
                        )})`
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
                    >
                      <View
                        style={
                          selectedTeams[val._id] === val.teamOne.name
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
                          selectedTeams[val._id] === val.teamTwo.name
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
  selectTeam: {
    color: "#000",
    fontSize: 15,
    marginRight: 10,
    fontWeight: "800",
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
    color: "#888",
  },
  teamName: {
    fontSize: 15,
    marginRight: 10,
    color: "#888",
    fontWeight: "800",
  },
  teamScore: {
    fontSize: 10,
    marginRight: 10,
    color: "#888",
  },
  basketballImage: {
    width: 20,
    height: 20,
    backgroundColor: "#000",
    borderRadius: 10,
  },
});
