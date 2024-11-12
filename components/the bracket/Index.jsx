import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../header";
import Tabs from "./Tabs";
import Footer from "../footer";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserBets } from "../redux/betSlice";
import { fetchNewSeasonIds } from "../redux/seasonsSlice";
import { fetchMatchs } from "../redux/matchSlice";
import { getRounds } from "../redux/roundSlice";
import { getTeams } from "../redux/teamSlice";
import { fetchCountdowns } from "../redux/countDownSlice";
import { getRankArr } from "../redux/leaguesSlice";

const Index = () => {
  const dispatch = useDispatch();
  const [userId, setId] = useState(null);
  const newSeasonIds = useSelector((state) => state.seasons.newSeasonIds.toString());
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

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserBets({ userId }));
    }
    dispatch(fetchNewSeasonIds());
  }, [userId]);

  useEffect(() => {
    dispatch(fetchMatchs());
    dispatch(getRounds());
    dispatch(getTeams());
    dispatch(fetchCountdowns());
  }, []);
  useEffect(() => {
    if(newSeasonIds.length > 0){
    dispatch(getRankArr(newSeasonIds[0]))}
  }, [newSeasonIds]);
  const {loading} = useSelector((state) => state.bet);
  const {countDowns} = useSelector((state) => state.count);
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={styles.container}>
        <Header />
        <Tabs />
        <Footer />
      </View>
      {countDowns && countDowns[0]?.status === 0 &&
        loading && <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#d38f14" />
        </View>
      }
    </View >
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f2f1ed",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
});
