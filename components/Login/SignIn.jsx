import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/loginSlice";
import AntDesign from '@expo/vector-icons/AntDesign';
import Checkbox from "expo-checkbox";
import axios from "axios";
import { API_MAIN } from "../redux/API";

const SignIn = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [eye, setEye] = useState(true);

  const handleSignIn = async () => {
    await dispatch(loginUser({ email, password, checkbox })).unwrap().then(() => {
      navigation.navigate('splash-screen');
    })
  };
  // const google = async() => {
  //   console.log(await axios.post(`${API_MAIN}/auth/google`))
  // }
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/bracketocracy-dark-logo.png')} style={styles.logo} />
      <View style={styles.formContainer}>
        <Text style={styles.header}>SIGN IN</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={eye}
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setPassword(text)}
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
          <Checkbox value={checkbox} onValueChange={setCheckbox} style={styles.checkboxContainer}/>
          <Text style={styles.rememberText}>Remember Me</Text>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>SIGN IN</Text>
        </TouchableOpacity>
        <View style={styles.signUpContainer}>
          <Text style={styles.noAccountText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('sign-up')}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orText}>- Or sign in with -</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../../assets/images/facebook.png")}
              style={styles.img}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} >
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.img}
            />
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
    width: '75%',
    height: 45,
    marginHorizontal: '12%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '1%',
    marginTop: '5%',
    maxHeight: '20%'
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
    borderRadius: 3
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: "5%",
    top: "20%",
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
    marginLeft: 88,
    fontSize: 12,
    color: "#d69824",
  },
  signInButton: {
    backgroundColor: "#d69824",
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 3
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
    gap: 10,
    justifyContent: "center",
   
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
    height: 20
  },
});