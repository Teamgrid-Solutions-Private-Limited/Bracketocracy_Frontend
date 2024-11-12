import { StyleSheet, Text, Pressable, View, LogBox } from "react-native";
import React, {useState } from "react";
import { useSelector } from "react-redux";
import AllMatches from "./AllMatches";
import CountdownTimer from "./CountDownTimer";


const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const {matches}= useSelector((state) => state.match);
  const {countDowns} = useSelector((state) => state.count);
  const filteredMatches = matches?.filter((val) => {
    if (val.status === "playing") {
      return true;
    }
    if (val.status === "archived") {
      return false;
    }
    if (val.round?.slug === "playin") {
      return true;
    }
    if( val.round?.slug === "round-5" || val.round?.slug === "round-6") {
    return true;  
    }
    if (activeTab === 1 && val.zone?.slug === "West") {
      return true;
    }
    if (activeTab === 2 && val.zone?.slug === "South") {
      return true;
    }
    if (activeTab === 3 && val.zone?.slug === "East") {
      return true;
    }
    if (activeTab === 4 && val.zone?.slug === "Midwest") {
      return true;
    }
    return false;
  });
  

  if (countDowns?.length > 0 && countDowns[0]?.status === 1) {
  return <CountdownTimer />;
  } else
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
        {filteredMatches?.length > 0 && countDowns?.length > 0 && countDowns[0]?.status === 0 &&
          <AllMatches matches={filteredMatches} allMatches={matches} />
        }
        {filteredMatches?.length === 0 && countDowns[0]?.status === 0 && <View style={styles.tbaContainer}>
          <View
            style={styles.bodyContainer}>
            <Text style={styles.tbaText}>TBA</Text>
          </View>
        </View>}
      </View>
    );
};

export default Tabs;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 15,
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
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  tab: {
    paddingVertical: 3,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#948d7b",
    width: "30%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  activeTab: {
    backgroundColor: "#454134",
    paddingVertical: 3,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: "30%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  tabText: {
    color: "#fff",
    fontSize: 12,
  },
  tbaContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: "6%",
    maxHeight: "25%"
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",

  },
  tbaText: {
    fontSize: 60,
    color: "#ccc",
    fontWeight: "bold",
  },
});
