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

const ChampionMatch = ({ matches, rounds, teams, getRemainingTime }) => {
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
                      {moment(
                        round.playDate,
                        "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                      ).format("DD MMMM YYYY")}
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
                        selectedTeams === val.teamOne.name
                          ? styles.SeletedTeamContainer
                          : styles.teamContainer
                      }
                    >
                      <Pressable
                        onPress={() => {
                          handleTeamSelect(val._id, val.teamOne.name)
                        }}
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
                        selectedTeams === val.teamTwo.name
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
                          handleTeamSelect(val._id, val.teamTwo.name)
                        }}
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
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    fontWeight: "800",
  },
  teamName: {
    fontSize: 15,
    fontWeight: "400",
    color: "#888",
    textAlign: "center",
    fontWeight: "800",
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontSize: 12,
    color: "#888",
  },
  scoreTop: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
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
