import { StyleSheet, Text, Pressable, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchs } from "../redux/matchSlice";
import AllMatches from "./AllMatches"

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMatchs());
  }, [dispatch]);

  const matches = useSelector((state) =>
    state.match.matches?.info ? state.match.matches?.info : []
  );

  console.log(matches);
  

  const filteredMatches = matches.filter((val) => {
    if (activeTab === 1) return val.zone.slug === "WEST";
    if (activeTab === 2) return val.zone.slug === "SOUTH";
    if (activeTab === 3) return val.zone.slug === "EAST";
    if (activeTab === 4) return val.zone.slug === "MIDWEST";
    return true;
  });

  console.log(filteredMatches);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Pressable
          onPress={() => setActiveTab(1)}
          style={activeTab === 1 ? styles.activeTab : styles.tab}
        >
          <Text style={styles.tabText}>WEST</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab(2)}
          style={activeTab === 2 ? styles.activeTab : styles.tab}
        >
          <Text style={styles.tabText}>SOUTH</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab(3)}
          style={activeTab === 3 ? styles.activeTab : styles.tab}
        >
          <Text style={styles.tabText}>EAST</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab(4)}
          style={activeTab === 4 ? styles.activeTab : styles.tab}
        >
          <Text style={styles.tabText}>MIDWEST</Text>
        </Pressable>
      </View>
      <AllMatches matches={filteredMatches} allMatches={matches} />
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f2f1ed",
    width: "100%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: "76%",
    alignSelf: "center",
    backgroundColor: "#948d7b",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5
  },
  tab: {
    // paddingHorizontal: 5,
    paddingVertical: 3,
    // marginHorizontal: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#948d7b",
    width: '30%',
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5
  },
  activeTab: {
    backgroundColor: "#454134",
    // paddingHorizontal: 5,
    paddingVertical: 3,
    // marginHorizontal: 6,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '30%',
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5
  },
  tabText: {
    color: "#fff",
    fontSize: 12,
  },
});
