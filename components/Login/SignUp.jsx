import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { createUsers } from "../redux/loginSlice";
import Checkbox from "expo-checkbox";
import { AntDesign } from "@expo/vector-icons";
const SignIn = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
    firstName: "",
    lastName: "",
    roleId: "66a37462ef3d83d131047795"
  });

  const [checkbox, setCheckbox] = useState(false);
  const [eye, setEye] = useState(true);
  const dispatch = useDispatch();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = () => {
    if(checkbox === false) {
      alert('Please accept the terms and conditions')
      return
    }
    dispatch(createUsers(formData));
    navigation.navigate("sign-in");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/bracketocracy-dark-logo.png")}
        style={styles.logo}
      />
      <View style={styles.formContainer}>
        <Text style={styles.header}>SIGN UP</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="User Name"
          autoCapitalize="none"
          value={formData.userName}
          onChangeText={(value) => handleInputChange("userName", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          autoCapitalize="none"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange("firstName", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          autoCapitalize="none"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange("lastName", value)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={eye}
            autoCapitalize="none"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setEye(!eye)}>
            {eye ? (
              <AntDesign name="eye" size={24} color="black" />
            ) : (
              <AntDesign name="eyeo" size={24} color="black" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.rememberContainer}>
          <Checkbox value={checkbox} onValueChange={setCheckbox} style={styles.checkboxContainer} />
          <Text style={styles.rememberText}>I agree to the </Text>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Terms & Conditions </Text>
          </TouchableOpacity>
          <Text style={styles.rememberText}>and </Text>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>
          <Text style={styles.signInButtonText}>SIGN UP</Text>
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text style={styles.noAccountText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("sign-in")}>
            <Text style={styles.signUpText}>Sign in</Text>
          </TouchableOpacity>
        </View>


      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "auto",
    backgroundColor: "#f2f1ed",
    paddingHorizontal: 25,
  },
  logo: {
    width: "75%",
    height: 45,
    marginHorizontal: "12%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "1%",
    marginTop: "5%",
    maxHeight: "20%",
  },
  formContainer: {
    padding: 5,
    borderRadius: 10,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "left",
    color: "#333",
    paddingLeft: 5,
  },
  input: {
    height: 42,
    borderColor: "#7d7d7a",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: 'absolute',
    right: "5%",
    top: "20%",
  },
  eyeIconImage: {
    width: 20,
    height: 20,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  rememberText: {
    fontSize: 12,
    color: "#333",
  },
  forgotPassword: {
    fontSize: 12,
    color: "#d69824",
  },
  signInButton: {
    backgroundColor: "#d69824",
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 3,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  noAccountText: {
    fontSize: 12,
    color: "#333",
  },
  signUpText: {
    fontSize: 12,
    color: "#d69824",
    marginLeft: 5,
    borderBottomWidth: 1,
    borderColor: "#d69824",
  },
  orText: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 78,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: "center",
  },
  img: {
    width: 20,
    height: 20,
  },
});