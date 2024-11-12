import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBets, loaderImage, placeBet, updateRound } from "../redux/betSlice";
import { getRemainingTime } from "../configs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChampionMatch from "./ChampionMatch";
import { SvgUri } from "react-native-svg";

const PlayIn = ({ matches, rounds, teams }) => {
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const [userId, setId] = useState(null);
  const [bet, setBet] = useState(0);
  
  useEffect(() => {
    const getId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        setId(userId);
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };
    getId();
  }, []);


  const { userBets } = useSelector((state) => state.bet
  );

  const newSeasonIds = useSelector((state) => state.seasons.newSeasonIds.toString());

  useEffect(() => {
    const { remainingTimeInMs } = getRemainingTime(
      rounds?.biddingEndDate
    );
    if (remainingTimeInMs <= 0) {
      setDisabled(true);
    } else setDisabled(false);
  }, [rounds?.biddingEndDate]);

  const handleTeamSelect = (matchId, teamId, betValue) => {
    const teamIdSame = userBets?.find((bet) => {
      return bet.matchId._id === matchId && bet.selectedWinner._id === teamId;
    });

    if (teamIdSame) {
      return;
    }
    const status = 0;
    if (!disabled && userId) {
      const existingBet = userBets?.find(
        (bet) => bet.matchId._id === matchId && bet.userId === userId
      );

      if (existingBet) {
        dispatch(updateRound({
          matchId,
          userId,
          status,
          id: existingBet._id,
          selectedWinner: teamId,
          seasonId: newSeasonIds,
          betScore: betValue
        }))
          .unwrap()
          .then(() => {
            dispatch(fetchUserBets({ userId }));
          })
          .catch((error) => {
            console.error("Failed to update bet:", error);
          });
      } else {
        dispatch(
          placeBet({
            matchId,
            userId,
            selectedWinner: teamId,
            status,
            seasonId: newSeasonIds,
            betScore: betValue
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
    }
 setBet(0);
 
  };



  const renderLogo = (logoUri) => {
    const isSvg = logoUri?.endsWith(".svg");
    if (isSvg) {
      return (
        <SvgUri uri={logoUri} style={styles.teamLogo} resizeMode="contain" width={styles.teamLogo.width} 
        height={styles.teamLogo.height} 
         />
      );
    } else {
      return (
        <Image
          source={{ uri: logoUri }}
          style={styles.teamLogo}
          resizeMode="contain"
        />
      );
    }
}

  return (
    <View style={styles.matchContainer}>
      <View style={[
        styles.headerContainer,
        (rounds?.slug === "round-6" || rounds?.slug === "playin")
          ? { flexDirection: "column" }
          : { flexDirection: "row" }
      ]}>
        <Text style={styles.headerText}>{rounds.name}</Text>
        <View style={[styles.dateContainer, (rounds?.slug === "round-6" || rounds?.slug === "playin")
          ? { alignItems: "center" }
          : { alignItems: "flex-end" }]}>
          <Text style={styles.dateText}>
            {moment(rounds.playDate).format("DD MMMM YYYY")}
          </Text>
          <Text style={styles.subHeaderText}>
            {rounds.biddingEndDate
              ? (() => {
                const { formattedTime } = getRemainingTime(
                  rounds.biddingEndDate
                );
                return formattedTime
                  ? `SELECTION ENDS IN (${formattedTime})`
                  : "SELECTION PERIOD ENDED";
              })()
              : "SELECTION PERIOD ENDED"}
          </Text>
        </View>
      </View>


      {matches?.filter((val) => val.round.slug === rounds.slug).map((val, index) => (
        val.round.slug !== "round-6" ? (
          <View
            style={styles.bodyContainer}
            key={index}
          >
            <View style={styles.bodyHeaderTextContainer}>
              <Text style={styles.bodyHeaderText}>Pick your winner</Text>
            </View>
            <View style={styles.teamContainer}>
              <View
                style={
                  userBets.length > 0 &&
                    userBets.some(
                      (bet) =>
                        bet.selectedWinner._id === val.teamOne._id &&
                        bet.matchId._id === val._id
                    )
                    ? styles.teamDetailsHighlight
                    :
                    styles.teamDetails
                }
              >
                <View style={styles.teamInfo}>
                  {renderLogo(val.teamOne.logo)}
                  {teams.map((team) => {
                    if (val.teamOne._id === team._id) {
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
                  <Pressable
                    onPress={() => handleTeamSelect(val._id, val.teamOne._id)}
                    disabled={disabled}
                  >
                    <Image
                      source={
                        userBets.length > 0 &&
                          userBets.some(
                            (bet) =>
                              bet.selectedWinner._id === val.teamOne._id &&
                              bet.matchId._id === val._id
                          )
                          ? require("../../assets/images/basket-ball2.png")
                          :
                          require("../../assets/images/basket-ball.png")
                      }
                      style={styles.basketballImage}
                    />
                  </Pressable>
                </View>
              </View>

              <View
                style={
                  userBets.length > 0 &&
                    userBets.some(
                      (bet) =>
                        bet.selectedWinner._id === val.teamTwo._id &&
                        bet.matchId._id === val._id
                    )
                    ? styles.teamDetailsHighlight
                    :
                    styles.teamDetails
                }
              >
                <View style={styles.teamInfo}>
                  {renderLogo(val.teamTwo.logo)}
                  {teams.map((team) => {
                    if (val.teamTwo._id === team._id) {
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
                  <Pressable
                    onPress={() => handleTeamSelect(val._id, val.teamTwo._id)}
                    disabled={disabled}
                  >
                    <Image
                      source={
                        userBets.length > 0 &&
                          userBets.some(
                            (bet) =>
                              bet.selectedWinner._id === val.teamTwo._id &&
                              bet.matchId._id === val._id
                          )
                          ? require("../../assets/images/basket-ball2.png")
                          :
                          require("../../assets/images/basket-ball.png")
                      }
                      style={styles.basketballImage}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

        ) : (
         <ChampionMatch 
         key={index}
         rounds={rounds} 
         teams={teams} 
         val={val}
         userBets={userBets}
         disabled={disabled}
         handleTeamSelect={handleTeamSelect}
         bet={bet}
         setBet={setBet}
         />

        )



      ))}

    </View>
  );
};

export default PlayIn;

const styles = StyleSheet.create({
  matchContainer: {
    flex: 1,
    padding: 6,
    width: "100%",
    marginTop: 3,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#454134",
    padding: 10,
    borderRadius: 1,

  },
  headerText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  dateContainer: {
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
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    marginTop: 10,
  },
  bodyHeaderTextContainer: {
    paddingHorizontal: 10,
    alignItems: "flex-end",
  },
  bodyHeaderText: {
    fontSize: 15,
    marginTop: 10,
  },
  teamContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    fontWeight: "600",
  },
  selectTeam: {
    fontSize: 15,
    marginRight: 10,
    color: "#000",
    fontWeight: "700",
  },
  basketballImage: {
    width: 24,
    height: 24,
    backgroundColor: "#000",
    borderRadius: 12,
  },

});
