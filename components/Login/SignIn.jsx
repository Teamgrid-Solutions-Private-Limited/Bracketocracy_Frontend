
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import GoogleLogo from "../../assets/images/google.png";
import FacebookLogo from "../../assets/images/facebook.png";
import BracktocracyLogo from "../../assets/images/bracketocracy-dark-logo.png"
import Background from "../../assets/images/bk-login.jpg";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/loginSlice";
import AntDesign from '@expo/vector-icons/AntDesign';
import Checkbox from "expo-checkbox";
import { API_MAIN } from "../redux/API";
import { fetchAllUsers } from "../redux/leaguesSlice";
const height = Dimensions.get('window').height
import { iosClientId, androidClientId, webClientId, facebookClientId } from '../configs'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as Facebook from "expo-auth-session/providers/facebook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const config={
  iosClientId: iosClientId,
  androidClientId: androidClientId,
  webClientId: webClientId,
  scopes: ['profile', 'email'],
}
WebBrowser.maybeCompleteAuthSession();

const SignIn = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [])
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [eye, setEye] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { allUsers } = useSelector((state) => state.leagues)

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!emailPattern.test(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };


  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };
  const handleSignIn = () => {
    if (!email) {
      setEmailError("Email is required");
    }
    if (!password) {
      setPasswordError("Password is required");
    }

    if (!email || !password || emailError || passwordError) {
      alert('Please fix the errors before signing in');
      return;
    }

    const user = allUsers.find((u) => u.email === email);
    if (user) {
      if (user.active === "no") {
        alert("Your account is inactive. Please contact support.");
        return;
      }
    } 
    dispatch(loginUser({ email, password, checkbox }))
      .unwrap()
      .then(() => {
        navigation.navigate("home");
      });
  };


// for Google Login
const [googleRequest, googleResponse, googleAsyncLogin] = Google.useAuthRequest({ ...config, redirectUri:
  Platform.OS === 'android'
    ? makeRedirectUri({
        scheme: "com.teamgrid.bracketocracy",
        path: '/',
      })
    : undefined,
  // scopes: ["openId","profile", "email"],
});
const googleLogin = () => {
  if(googleResponse?.type === 'success'){
    const { authentication } = googleResponse;
    const { accessToken }=authentication;
    fetch(`${API_MAIN}/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.token) {
          AsyncStorage.setItem("userToken", data.token);
          const decodedUser = jwtDecode(data.token);
          if(decodedUser) AsyncStorage.setItem('userId', decodedUser.id);
          setUser(decodedUser);
          navigation.navigate('home');
        } else {
          console.error("Token not found in response");
        }
      })
      .catch((err) => console.error("Fetch error:", err));
    
  }
}

useEffect(() => {
  googleLogin()
},[googleResponse])

// for FaceBook Login
const [user, setUser] = useState(null);
const [facebookRequest, facebookResponse, facebookLoginAsync] = Facebook.useAuthRequest({
  clientId: facebookClientId,
});

useEffect(() => {
  if (facebookResponse && facebookResponse.type === "success" && facebookResponse.authentication) {
    (async () => {
      const userInfofacebookResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${facebookResponse.authentication.accessToken}&fields=id,name,picture.type(large)`
      );
      const userInfo = await userInfofacebookResponse.json();
      setUser(userInfo);
      console.log(JSON.stringify(facebookResponse, null, 2));
    })();
  }
}, [facebookResponse]);


const handlePressAsync = async () => {
  const result = await facebookLoginAsync();
  if (result.type !== "success") {
    alert("Uh oh, something went wrong");
    return;
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          source={Background}
          style={styles.backgroundImage}

        >
          <View style={styles.container}>
            <Image
              source={BracktocracyLogo}
              style={styles.logo}
            />

            <View style={styles.formContainer}>
              <Text style={styles.header}>SIGN IN</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={handleEmailChange}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={eye}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setEye(!eye)}
                >
                  {eye ? (
                    <AntDesign name="eye" size={24} color="black" />
                  ) : (
                    <AntDesign name="eyeo" size={24} color="black" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.rememberContainer}>
                <View style={styles.wrapper}>
                  <Checkbox
                    value={checkbox}
                    onValueChange={setCheckbox}
                    style={styles.checkboxContainer}
                  />
                  <Text style={styles.rememberText}>Remember Me</Text>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate("forget-password")}
                >
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSignIn}
              >
                <Text style={styles.signInButtonText}>SIGN IN</Text>
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.noAccountText}>Don't have an account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("sign-up")}
                >
                  <Text style={styles.signUpText}>Sign up</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.orText}>- Or sign in with -</Text>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}  onPress={() => handlePressAsync()}>
                  <Image
                    source={FacebookLogo}
                    style={styles.img}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}  onPress={() => googleAsyncLogin()}>
                  <Image
                    source={GoogleLogo}
                    style={styles.img}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.madnessText}>LET MADNESS REIGN</Text>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: height,
    resizeMode: 'fit',
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 25,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 10
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
    color: "#333",
    paddingLeft: 0,
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
    justifyContent: "space-between",
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
    marginBottom: 15,
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
    zIndex: 10
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
  madnessText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 200,
    fontWeight: '500',
    fontFamily: 'nova',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  }
});