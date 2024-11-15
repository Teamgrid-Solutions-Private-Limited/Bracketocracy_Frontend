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
import sponsorSlice from "./sponsorSlice";
import seasonsReducer from "./seasonsSlice";
export const store = configureStore({
  reducer: {
    editProfile: EditProfileReducer,
    login: SignUpReducer,
    leagues: LeaguesReducer,
    invite: InviteFriendLeagueReducer,
    sponsor: sponsorSlice,
    message: MessageReducer,

    
    match: matchReducer,
    round: roundReducer,
    team: teamReducer,
    bet: betSlice,
    count: countDownSlice,
    seasons: seasonsReducer,
  },
})