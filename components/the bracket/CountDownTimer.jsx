import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountdowns } from "../redux/countDownSlice";
import { Text, View, StyleSheet, LogBox } from "react-native";

const CountdownTimer = () => {
  LogBox.ignoreAllLogs();
  const {countDowns} = useSelector((state) =>state.count);

  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [countdownEnded, setCountdownEnded] = useState(false);

  useEffect(() => {
    dispatch(fetchCountdowns());
  }, []);

  useEffect(() => {
    if (countDowns.length === 0 || !countDowns[0]?.updated) return;

    const targetDate = new Date(countDowns[0].updated).getTime();

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0 && countDowns[0].status === 1) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes });
        setCountdownEnded(false);
      } else {
        setCountdownEnded(true);
        clearInterval(intervalId);
      }
    };

    const intervalId = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(intervalId);
  }, [countDowns]);

  const renderTimeBox = (label, value) => (
    <View style={styles.timeUnit}>
      <Text style={styles.unitLabel}>{label}</Text>
      <View style={styles.times}>
        {String(value)
          .padStart(2, "0")
          .split("")
          .map((digit, index) => (
            <View key={index} style={styles.timeBox}>
              <Text style={styles.timeText}>{digit}</Text>
            </View>
          ))}
      </View>
    </View>
  );

  if (countdownEnded) {
    return (
      <View style={styles.endedContainer}>
        <Text style={styles.endedText}>Countdown Ended</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.comingSoonText}>{countDowns[0].note}</Text>
        <View style={styles.timerContainer}>
          {renderTimeBox("DAYS", timeLeft.days)}
          {renderTimeBox("HOURS", timeLeft.hours)}
          {renderTimeBox("MINUTES", timeLeft.minutes)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#f2f2f2",
    padding: 5,
    width: "90%",
    height: 230,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    position: "absolute",
    top: 120,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap:10
  },
  timeUnit: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  unitLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  times: {
    flexDirection: "row",
    gap: 5,
  },
  timeBox: {
    backgroundColor: "#333",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  endedContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  endedText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
});

export default CountdownTimer;
