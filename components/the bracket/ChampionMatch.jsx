import React, { useState } from "react";
import moment from "moment";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import {useSelector } from "react-redux";
import { SvgUri } from "react-native-svg";
import PlaceBetModal from "./PlaceBetModal";

const ChampionMatch = ({
  val,
  teams,
  userBets,
  disabled,
  handleTeamSelect,
  rounds,
  bet,
  setBet
}) => {
  const [showModal, setShowModal] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const { rankArr } = useSelector((state) => state.leagues);
  const { editProfile } = useSelector((state) => state.editProfile);
  const userRank = rankArr?.find(rank => rank.userId._id === editProfile?._id);

  const renderLogo = (logoUri,style) => {
    const isSvg = logoUri?.endsWith(".svg");
    if (isSvg) {
      return (
        <SvgUri uri={logoUri} style={style} width={style.width} height={style.height} resizeMode="contain"/>
      )
    } else {
      return (
        <Image
          source={{ uri: logoUri }}
          style={style}
          resizeMode="contain"
        />
      );
    }
}

  const openModal = () => {
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
    setBet(0);
  }

  const handleSelect = (matchId, teamId, betValue) => {
    if (betValue <= 0 || betValue > userRank?.userId.score) {
      alert("Bet must be between zero and user points");
      return
    }
    else {
      setMatchId(matchId);
      setTeamId(teamId);
      openModal();
      if (matchId && teamId && betValue) {
        handleTeamSelect(matchId, teamId, betValue);
      }

    }

  };
  return (<>
    <View style={styles.outerContainer} >
      <View style={styles.header}>
        <Text style={styles.title}>Champion Match</Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>
          {moment(rounds.playDate).format("MMMM DD")}
        </Text>
      </View>

      {/* Match Container */}
      <View style={styles.matchContainer}>
        {/* Team 1 */}
        <Pressable
          onPress={() => handleSelect(val._id, val.teamOne._id)}
          disabled={disabled}
        >
          <View
            style={
              userBets.some(
                (bet) =>
                  bet.selectedWinner._id === val.teamOne._id &&
                  bet.matchId._id === val._id
              )
                ? styles.SeletedTeamContainer
                : styles.teamContainer
            }
          >
            {renderLogo(val.teamOne.logo, styles.logo)}
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
        </Pressable>

        {/* Score Divider */}
        <View style={{ alignSelf: "flex-end", paddingVertical: 10 }}>
          <View style={styles.scoreDivider}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.teamScore}>{val.teamOneScore}</Text>
              <Text style={styles.score}>
                {teams.find((team) => team._id === val.teamOne._id)?.seed}
              </Text>

            </View>
            <View style={{ alignItems: "center" }}><Text style={styles.teamScore}>{val.teamTwoScore}</Text>
              <Text style={styles.score}>
                {teams.find((team) => team._id === val.teamTwo._id)?.seed}
              </Text>
            </View>

          </View>
        </View>


        {/* Team 2 */}
        <Pressable
          onPress={() => handleSelect(val._id, val.teamTwo._id)}
          disabled={disabled}
        >
          <View
            style={
              userBets.some(
                (bet) =>
                  bet.selectedWinner._id === val.teamTwo._id &&
                  bet.matchId._id === val._id
              )
                ? styles.SeletedTeamContainer
                : styles.teamContainer
            }
          >
            {renderLogo(val.teamTwo.logo, styles.logo)}
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
        </Pressable>
      </View>
      <PlaceBetModal
        bet={bet}
        setBet={setBet}
        showModal={showModal}
        closeModal={closeModal}
        handleSelect={handleSelect}
        matchId={matchId}
        teamId={teamId}
        disabled={disabled}
      />
    </View>
    {
      val.decidedWinner && <View style={{ width: "100%", alignItems: "center" }}>
        <View style={styles.separator}></View>
        <View style={styles.winnerContainer}>
          <Text style={styles.title}>Champion</Text>
          {renderLogo(val.decidedWinner === val.teamOne._id ? val.teamOne.logo : val.teamTwo.logo, styles.winnerLogo)}
          <Text style={styles.winnerText}>{val.decidedWinner === val.teamOne._id ? val.teamOne.name : val.teamTwo.name}</Text>
        </View>
      </View>
    }
  </>


  );
};

export default ChampionMatch;

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 10,
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
    flexDirection: "column",
    gap: 10
  },
  winnerContainer: {
    padding: 20,
    paddingHorizontal: 50,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#333",
  },
  date: {
    fontSize: 16,
    color: "#666",
  },
  logo: {
    width: 80,
    height: 50,
  },
  teamName: {
    fontSize: 15,
    color: "#000",
    marginTop: 5,
  },
  teamScore: {
    fontSize: 22,
    color: "#333",
  },
  scoreDivider: {
    alignItems: "center",
    gap: 30,
    flexDirection: "row",
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
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  teamContainer: {
    alignItems: "center",
    flexDirection: "column",
    gap: 5,
    padding: 5,
    paddingHorizontal: 10,
  },
  SeletedTeamContainer: {
    backgroundColor: "#ebb04b",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    padding: 5,
    paddingHorizontal: 10,
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
  separator: {
    width: 1,
    backgroundColor: "#888",
    height: 50,
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
    marginBottom: 5,
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
  setbetButton: {
    backgroundColor: "#D6A247",
    borderRadius: 3,
    padding: 10,
  },
  setbetButtonText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
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
  tbaText: {
    fontSize: 60,
    color: "#ccc",
    fontWeight: "bold",
    paddingHorizontal: 115,
  },
  winnerLogo: {
    width:80,
    height: 80,
  },
});
