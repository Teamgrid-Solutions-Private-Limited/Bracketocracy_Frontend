import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getRounds } from "../redux/roundSlice";
import { getTeams } from "../redux/teamSlice";
import Champion from "./Champion";
import FinalMatchs from "./FinalMatchs";
import Elite from "./Elite";
import Sweet from "./Sweet";
import Round2 from "./Round2";
import Round1 from "./Round1";
import PlayIn from "./PlayIn";
import moment from "moment";
import ChampionMatch from "./ChampionMatch";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import CountdownTimer from "./CountdownTimer";

const AllMatches = ({ matches, allMatches }) => {
  const dispatch = useDispatch();
  const [id, setId] = useState(null);

  const getId = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      setId(userId);
      // console.log("userId", userId);
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };
  getId();

  useEffect(() => {
    dispatch(getRounds());
    dispatch(getTeams());
  }, [dispatch]);

  const rounds = useSelector((state) =>
    state.round.roundlist ? state?.round?.roundlist : []
  );
  console.log("rounds", rounds);

  const teams = useSelector((state) =>
    state.team.teams ? state.team.teams : []
  );
  console.log("teams", teams);

  const getRemainingTime = (biddingEndDate) => {
    const now = new Date();
    const endDate = new Date(biddingEndDate);

    // Calculate the remaining time in milliseconds
    const remainingTimeInMs = endDate - now;

    if (remainingTimeInMs <= 0) {
      return { formattedTime: null, remainingTimeInMs }; // Bidding period is over
    }

    // Calculate days, hours, and minutes
    const days = Math.floor(remainingTimeInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTimeInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    const formattedTime = `${days} days ${hours} hours ${minutes} minutes`;

    return { formattedTime, remainingTimeInMs };
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Champion
        matches={allMatches}
        rounds={rounds}
        getRemainingTime={getRemainingTime}
      />
      <ChampionMatch
        matches={allMatches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
      />
      <FinalMatchs
        matches={allMatches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
        userId={id}
      />
      <Elite
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
        userId={id}
      />
      <Sweet
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
        userId={id}
      />
      <Round2
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
        userId={id}
      />
      <Round1
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
        userId={id}
      />
      <PlayIn
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
        userId={id}
      />
    </ScrollView>
  );
};

export default AllMatches;

const styles = StyleSheet.create({
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f2f1ed",
  },
});
