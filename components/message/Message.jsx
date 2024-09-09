import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator } from "react-native";
import profile from "../../assets/images/profile.png";
import user from "../../assets/images/user.png"; 
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { createMessages, getMessages } from "../redux/messageSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchEditProfile } from "../redux/editProfileSlice";
import Header from "../header";
import Footer from "../footer";
import { fetchMultipleProfiles } from "../redux/leaguesSlice";

// Component for showing message with sender's username
const MessageItems = ({ items, profiles }) => {
  const profileData = useMemo(() => profiles.find((p) => p._id === items.userId[0]), [items?.userId, profiles]);

  return (
    <>
      <Text style={styles.messageSender}>{profileData?.userName || "Loading..."}</Text>
      <Text style={styles.messageText}>{items.message}</Text>
    </>
  );
};

const Message = () => {
  const { leagesInMessege } = useSelector((state) => state.message);
  const { Messages } = useSelector((state) => state.message);
  const { allUserId } = useSelector((state) => state.leagues);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Combined loading state
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const leagueId = leagesInMessege._id;
    dispatch(createMessages({ leagueId, userId, message }))
      .unwrap()
      .then(() => dispatch(getMessages(leagesInMessege._id)));
    setMessage("");
  };

  // Fetch messages and profiles when league changes
  useEffect(() => {
    if (leagesInMessege) {
      setLoading(true);
      Promise.all([
        dispatch(getMessages(leagesInMessege._id)),
        dispatch(fetchMultipleProfiles(leagesInMessege.userId))
      ]).finally(() => setLoading(false)); // Set loading to false after both promises resolve
    }
  }, [leagesInMessege, dispatch]);

  const profiles = useMemo(() => allUserId.filter(profile => leagesInMessege?.userId.includes(profile._id)).sort((a, b) => b.score - a.score), [allUserId, leagesInMessege?.userId]);

  if (loading) {
    // Display a loader when fetching data
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.mainView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{leagesInMessege.title}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>LEAGUE MEMBERS</Text>
          <View style={styles.memberContainer}>
            <ScrollView horizontal contentContainerStyle={styles.scrollView}>
              {profiles?.map((item) => (
                <View key={item._id} style={styles.memberBox}>
                  <View style={styles.ImageContainer}>
                    <Image source={profile} style={styles.image} />
                  </View>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.score}>{item.score}</Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.userName}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.msgContent}>
          <Text style={styles.msgTitle}>MESSAGE BOARD</Text>
          <View style={styles.msgContainer}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {Messages?.map((item) => (
                <View key={item._id} style={styles.msgContentView}>
                  <View style={styles.msgBox}>
                    <View style={styles.msgImageContainer}>
                      <Image source={user} style={styles.msgImage} />
                    </View>
                    <View style={styles.allMessages}>
                      <View style={styles.msg}>
                        <MessageItems items={item} profiles={profiles} />
                      </View>
                      <Text style={styles.time}>
                        {new Date(item.created).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.commentSection}>
              <TextInput
                placeholder="Add a comment"
                style={styles.commentInput}
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
              <Pressable style={styles.send} onPress={handleSendMessage}>
                <Ionicons name="send" size={20} style={styles.sendIcon} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f1ed",
    position: "relative",
  },
  mainView: {
    marginTop: 15,
    flex: 1,
  },
  scrollView: {
    // paddingVertical: 10,
    backgroundColor: "#ffffff",
    position: "relative",
    zIndex: 2,
  },
  allMessages: {
    width:"100%"
  },
  header: {
    width: "90%",
    backgroundColor: "#454134",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 3,
    alignSelf: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#939087",
    width: "90%",
    padding: 8,
   
    color: "#fff",
    textAlign: "left",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  memberContainer: {
    backgroundColor: "#fff",
    width: "90%",
    height: "80%",
    padding: 10,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    zIndex: 1, 
  },
  memberBox: {
    alignItems: "center",
    margin:10,
  },
  ImageContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    padding: 5,
    width: 60,
    height: 60,
    backgroundColor: "#e3e6e8",
  },
  scoreContainer: {
    backgroundColor: "#d38f14",
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    marginTop: -10,
  },
  score: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  memberName: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    color: "#888",
  },
  msgContent: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    marginBottom: 10,
  },
  msgTitle: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#454134",
    width: "90%",
    padding: 8,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    color: "#fff",
    textAlign: "center",
  },
  msgContainer: {
    backgroundColor: "#fff",
    width: "90%",
    height: "auto",
    padding: 10,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
    flexDirection: "column",
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  msgImageContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  msgImage: {
    width: 45,
    height: 45,
  },
  msgBox: {
    flex: 1,
    flexDirection: "row",
  },
  msgContentView: {
    flex: 1,
    width: "100%",
    padding: 5,
    justifyContent: "space-between",
  },
  msg: {
    width: "80%",
    marginLeft: 10,
    borderWidth: 0.5,
    borderRadius: 1,
    borderColor: "#888",
    flexWrap: "wrap",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 5,
    padding: 10,
    // gap: 3,
  },
  messageSender: {
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 13,
    flexWrap: "wrap",
    width: "80%",
    // maxWidth: "100%",
    // lineHeight: 20,
  },
  time: {
    fontSize: 8,
    marginLeft: 15,
    marginTop: 2,
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "space-between",
  },
  commentInput: {
    flex: 1,
    padding: 10,
  },
  send: {
    width: 35,
    height: 32,
    backgroundColor: "#454134",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginRight: 10,
  },
  sendIcon: {
    color: "#f2f1ed",
    padding: 5,
  },
  loaderContainer: {
    position: "absolute", 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center", 
    backgroundColor: "rgba(0, 0, 0, 0)", 
    zIndex: 10,    
  },
});
