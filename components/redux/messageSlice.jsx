import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_MAIN } from './API';
const initialState = {
    Messages: [],
    status: 'idle',
    leagesInMessege:{},
    error: null,
};



export const createMessages = createAsyncThunk('createMessages', async ({leagueId,userId,message}) => {
    try {
        const response = await axios.post(
            `${API_MAIN}/message/message/add/${leagueId}`,
            { userId, message }
        )  
        return response
    }
    catch (error) {
        throw error
    }
});

export const getMessages = createAsyncThunk('getMessages', async (leagueId) => {
    try {
        const response = await axios.get(`${API_MAIN}/message/message/show/${leagueId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
});
export const deleteMessages = createAsyncThunk('deleteMessages', async (leagueId) => {
    try {
        const response = await axios.delete(`${API_MAIN}/league/league/delete/${leagueId}`);

        return response;
    } catch (error) {
        throw error;
    }
});


const Messageslice = createSlice({
    name: 'Messages',
    initialState,
    reducers: {
       getLeaguesInMessage: (state, action) => {
           state.leagesInMessege = action.payload
       }
    },
    extraReducers: (builder) => {
        builder
            // .addCase(createMessages.pending, (state) => {
            //     state.status = 'loading';
            // })
            // .addCase(createMessages.fulfilled, (state, action) => {
            //     state.status = 'idle';
            //     state.Messages = action.payload;
            //     state.error = null;
            // })
            // .addCase(createMessages.rejected, (state, action) => {
            //     state.status = 'error';
            //     state.error = action.payload;
            // })
            .addCase(getMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.status = 'idle';
                state.Messages = action.payload;
                state.error = null;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })

    },
});
export const  {getLeaguesInMessage} = Messageslice.actions
export default Messageslice.reducer;
