import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";

const Champion = ({ matches, rounds, getRemainingTime }) => {
  if (matches.length > 0) {
    const championMatchRound = matches.find(
      (matches) => matches?.round?.slug === "champion-match"
    );

    if (!championMatchRound) return null;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>FINAL (CHAMPIONSHIP GAME)</Text>
        {rounds.map((round) => {
          if (round.slug == "champion-match") {
            return (
              <View key={round._id}>
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
        })}
      </View>
    );
  }
};

export default Champion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#454134",
    padding: 10,
    width: "96%",
    maxHeight: 70,
    borderRadius: 5,
    marginTop: 0,
  },
  title: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  date: {
    color: "#d8690a",
    fontSize: 12,
    textAlign: "center",
  },
  selectionPeriod: {
    color: "#dacb16",
    fontSize: 12,
    textAlign: "center",
  },
});
