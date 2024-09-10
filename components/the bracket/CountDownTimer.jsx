import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountdowns } from "../redux/countDownSlice";
import { Text, View, StyleSheet } from "react-native";

const CountdownTimer = () => {
  const countDown = useSelector((state) =>
    state?.count?.countdowns?.info ? state.count.countdowns.info : []
  );

  console.log(countDown);
  

  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    dispatch(fetchCountdowns());
  }, [dispatch]);

  useEffect(() => {
    if (countDown.length === 0 || !countDown[0]?.updated) return;

    // Ensure that `countDown[0].updated` is a valid date
    const targetDate = new Date(countDown[0].updated).getTime();

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0 && countDown[0].status == 1) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`${days}d : ${hours}h : ${minutes}m`);
      } else if (distance < 0) {
        setTimeLeft("Countdown finished"); // Display a message instead of null
      }
    };

    // Run the interval to update the countdown every second
    const intervalId = setInterval(updateTimeLeft, 1000);

    // Clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [countDown]);

  return (
    <View style={{flex:1, width:'100%', alignItems:'center', marginTop:'10%'}}>
      <View style={styles.container}>
        <Text style={styles.text}>{timeLeft ? timeLeft : "Loading..."}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#454134",
    padding: 5,
    width:'80%',
    height:'35%',
    borderRadius:20
  },
  text: {
    fontSize: 55,
    fontWeight: "bold",
    color: "#ebb04b",
  },
});

export default CountdownTimer;
