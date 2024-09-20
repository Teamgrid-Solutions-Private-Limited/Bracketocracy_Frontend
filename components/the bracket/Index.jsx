import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../header";
import Tabs from "./Tabs";
import Footer from "../footer";

const Index = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Tabs />
      <Footer />
    </View>
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
});
