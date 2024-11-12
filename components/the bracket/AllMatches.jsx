import { StyleSheet, View,ScrollView } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import PlayIn from "./PlayIn";


const AllMatches = ({ matches }) => {
  const rounds = useSelector((state) => state.round.roundlist);
  const { teams } = useSelector((state) => state.team);
  const filteredRounds = rounds?.filter((round) => {
    return matches?.some((match) => match.round.slug === round.slug)
  });

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {filteredRounds?.slice().reverse().map((round) => (
          <PlayIn key={round.slug} matches={matches} rounds={round} teams={teams} />
        ))}
      </ScrollView>
    </View>
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