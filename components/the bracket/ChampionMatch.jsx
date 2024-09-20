import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
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
  const [bet, setBet] = useState(0);
  const userBets = useSelector((state) =>
    state.bet.userBets && state.bet.userBets.length > 0
      ? state.bet.userBets
      : []
  );
  const [disabled, setDisabled] = useState(false);

  const handleTeamSelect = (matchId, teamName) => {
    // Check if bidding period is over for the specific match
    rounds.find((round) => {
      if (round.slug === "round-6") {
        const { formattedTime, remainingTimeInMs } = getRemainingTime(
          round.biddingEndDate
        );

        if (remainingTimeInMs <= 0) {
          return setDisabled(true);
        } else return setDisabled(false);
      }
    });

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
  };

  console.log(selectedTeams);
  console.log("userid", userId);
  

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserBets({ userId }));
    }
  }, [dispatch, userId]);

  const handlePlaceBet = (matchId) => {
    if (!disabled && userId && Object.keys(selectedTeams).length > 0) {
      const seasonId = "66b5e399264761b0e2656168";
      const status = 0;
      const selectedWinnerId = selectedTeams[matchId];

      // Check if the user has already placed a bet on this match
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
                selectedWinner: selectedWinnerId,
                status,
                seasonId,
                betScore:bet, // Add the bet amount to updateRound call
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
        dispatch(
          placeBet({
            matchId,
            userId,
            selectedWinner: selectedWinnerId,
            status,
            seasonId,
            betScore:bet, 
          })
        )
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
  };

  if (matches.length > 0) {
    const championMatchRound = matches.find(
      (matches) => matches?.round?.slug === "round-6"
    );

    if (!championMatchRound) return null;

  return (
    matches.length > 0 && (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          {rounds.map(
            (round) =>
              round.slug === "round-6" && (
                <View style={styles.header} key={round._id}>
                  <Text style={styles.title}>{round.name}</Text>
                  <Text style={styles.date}>
                    {moment(round.playDate).format("DD MMMM")}
                  </Text>
                </View>
              )
          )}

          {matches.map(
            (match, index) =>
              match?.round?.slug === "round-6" && (
                <View style={styles.matchContainer} key={index}>
                  <View style={styles.scoreboard}>
                    {/* Team 1 */}
                    <Pressable
                      onPress={() =>
                        handleTeamSelect(match._id, match.teamOne.name)
                      }
                      disabled={disabled}
                    >
                      <View
                        style={
                          userBets.some(
                            (bet) =>
                              bet.selectedWinner._id === match.teamOne._id &&
                              bet.matchId._id === match._id
                          )
                            ? styles.SeletedTeamContainer
                            : styles.teamContainer
                        }
                      >
                        <Image
                          source={{ uri: match.teamOne.logo }}
                          style={styles.logo}
                        />
                        <Text style={styles.teamName}>
                          {match.teamOne.name}
                        </Text>
                        <Text style={styles.teamScore}>
                          {match.teamOneScore}
                        </Text>
                      </View>
                    </Pressable>

                    {/* Score Divider */}
                    <View style={styles.scoreDivider}>
                      <Text style={styles.score}>
                        {
                          teams.find((team) => team.name === match.teamOne.name)
                            ?.seed
                        }
                      </Text>
                      <Text style={styles.scoreDividerText}>VS</Text>
                      <Text style={styles.score}>
                        {
                          teams.find((team) => team.name === match.teamTwo.name)
                            ?.seed
                        }
                      </Text>
                    </View>

                    {/* Team 2 */}
                    <Pressable
                      onPress={() =>
                        handleTeamSelect(match._id, match.teamTwo.name)
                      }
                      disabled={disabled}
                    >
                      <View
                        style={
                          userBets.some(
                            (bet) =>
                              bet.selectedWinner._id === match.teamTwo._id &&
                              bet.matchId._id === match._id
                          )
                            ? styles.SeletedTeamContainer
                            : styles.teamContainer
                        }
                      >
                        <Image
                          source={{ uri: match.teamTwo.logo }}
                          style={styles.logo}
                        />
                        <Text style={styles.teamName}>
                          {match.teamTwo.name}
                        </Text>
                        <Text style={styles.teamScore}>
                          {match.teamTwoScore}
                        </Text>
                      </View>
                    </Pressable>
                  </View>

                  {/* Bet Input Section */}
                  {(match.teamTwoScore === 0 || match.teamOneScore === 0) && (
                    <View style={styles.setbet}>
                      <TextInput
                        style={styles.input}
                        value={String(bet)}
                        keyboardType="numeric"
                        onChangeText={(value) => setBet(Number(value))}
                      />
                      <Pressable
                        style={styles.button}
                        onPress={() => handlePlaceBet(match._id)}
                        disabled={disabled}
                      >
                        <Text style={styles.buttonText}>PLACE YOUR BET</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )
          )}
        </View>

            {matches.map((winer) => {
          if (
            winer.teamTwoScore !== winer.teamOneScore ||
            winer.teamTwoScore > winer.teamOneScore ||
            winer.teamTwoScore < winer.teamOneScore
          ) {
            if (winer?.round?.slug === "round-6") {
              return <View style={styles.separator}></View>;
            }
          }
          return null
        })}

        {/* Display Champion */}
        {matches.map(
          (match, index) =>
          {  if (match?.round?.slug === "round-6" &&
            match.teamOneScore !== match.teamTwoScore) {
            return <View style={styles.championContainer} key={index}>
            <Text style={styles.championText}>Champion</Text>
            <Image
              source={{
                uri:
                  match.teamOneScore > match.teamTwoScore
                    ? match.teamOne.logo
                    : match.teamTwo.logo,
              }}
              style={styles.championLogo}
            />
            <Text style={styles.championTeamName}>
              {match.teamOneScore > match.teamTwoScore
                ? match.teamOne.name
                : match.teamTwo.name}
            </Text>
          </View>
          }
          return null
        }
          
        )}
      </View>
    )
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
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 16,
    color: "#666",
  },
  scoreboard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    width: "100%",
    marginBottom: 10,
  },
  team: {
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  teamScore: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  scoreDivider: {
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  scoreDividerText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  input: {
    minWidth: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#D6A247",
    borderRadius: 3,
    padding: 10,
    width: "50%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  matchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  teamContainer: {
    alignItems: "center",
    padding:5,
    paddingHorizontal: 10,
  },
  SeletedTeamContainer: {
    backgroundColor: "#ebb04b",
    padding: 5,
    alignItems: "center",
    paddingHorizontal: 10,
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
    marginBottom:5
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
  setbet: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
