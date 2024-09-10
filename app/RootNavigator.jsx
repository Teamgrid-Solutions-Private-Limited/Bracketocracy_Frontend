import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Home from '@/components/home/index';
import SignIn from '@/components/Login/SignIn';
import SignUp from '@/components/Login/SignUp';
import Menu from '@/components/menu/index';
import Instractions from '@/components/how-to-play/index';
import MyLeagues from '@/components/my-leagues/index';
import Edit from '@/components/edit_profile/index';
import Header from '@/components/header/index';
import ForgetPassword from '@/components/Login/ForgetPassword';
import Splashscreen from '@/components/splash_screen/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bracket from "@/components/the bracket/Index";
import Message from "@/components/message/Message";
import History from "@/components/my-leagues/subComponents/HistoryItem";
const Stack = createNativeStackNavigator();
 
const RootNavigator = () => {
  const { userToken } = useSelector((state) => state.login);
  const [initialRoute, setInitialRoute] = useState(null);
 
  useEffect(() => {
    const checkUserToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token || userToken) {
        setInitialRoute('splash-screen'); 
      } else {
        setInitialRoute('sign-in'); 
      }
    };
 
    checkUserToken();
  }, [userToken]);
 
  if (!initialRoute) {
    // Return null or a loading indicator while checking the initial route
    return null;
  }
 
  return (
<NavigationContainer>
<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
 
        <Stack.Screen name="splash-screen" component={Splashscreen} />
<Stack.Screen name="sign-in" component={SignIn} />
<Stack.Screen name="sign-up" component={SignUp} />
<Stack.Screen name="home" component={Home} />
<Stack.Screen name="menu" component={Menu} />
<Stack.Screen name="how-to-play" component={Instractions} />
<Stack.Screen name="edit-profile" component={Edit} />
<Stack.Screen name="my-leagues" component={MyLeagues} />
<Stack.Screen name='bracket' component={Bracket} />
<Stack.Screen name ="message" component={Message} />
<Stack.Screen name ="forget-password" component={ForgetPassword} />
<Stack.Screen name ="history" component={History} />
</Stack.Navigator>
</NavigationContainer>
  );
};
 
export default RootNavigator;