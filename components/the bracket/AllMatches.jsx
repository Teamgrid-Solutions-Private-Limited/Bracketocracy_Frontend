import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
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

const AllMatches = ({ matches, allMatches }) => {
  const dispatch = useDispatch();

  // console.log(allMatches);

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

  const getRemainingTime = (endDate) => {
    const now = moment();
    const end = moment(endDate);
    const duration = moment.duration(end.diff(now));

    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    if (duration.asMilliseconds() > 0) {
      return `${days} DAYS, ${hours} HRS, ${minutes} MINS`;
    } else return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Champion
        matches={allMatches}
        rounds={rounds}
        getRemainingTime={getRemainingTime}
      />
      <ChampionMatch matches={allMatches} rounds={rounds} teams={teams} getRemainingTime={getRemainingTime} />
      <FinalMatchs
        matches={allMatches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
      />
      <Elite
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
      />
      <Sweet
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
      />
      <Round2
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
      />
      <Round1
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
      />
      <PlayIn
        matches={matches}
        rounds={rounds}
        teams={teams}
        getRemainingTime={getRemainingTime}
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
