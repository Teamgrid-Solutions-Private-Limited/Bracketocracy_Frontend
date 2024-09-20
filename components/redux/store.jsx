import { configureStore } from '@reduxjs/toolkit'
import EditProfileReducer from './editProfileSlice'
import SignUpReducer from './loginSlice'
import LeaguesReducer from './leaguesSlice'
import matchReducer from "./matchSlice";
import roundReducer from "./roundSlice";
import teamReducer from "./teamSlice";
import betSlice from "./betSlice";
import InviteFriendLeagueReducer from "./invitationSlice";
import MessageReducer from "./messageSlice"
import countDownSlice from './countDownSlice';
import sponsorSlice from "./sponsorSlice"
export const store = configureStore({
  reducer: {
    editProfile:EditProfileReducer,
    login:SignUpReducer,
    leagues:LeaguesReducer,
    invite:InviteFriendLeagueReducer,
    match: matchReducer,
    round: roundReducer,
    team: teamReducer,
    bet:betSlice,
    message:MessageReducer,
    count:countDownSlice,
    sponsor:sponsorSlice
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,  
  //   }),
})