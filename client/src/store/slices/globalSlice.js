import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: false,
    checkTokenLoading: true,
    token: null,
    userRole: null,
    activityIdForFeedback: null,
    chartData: null
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setCheckTokenLoading: (state, action) => {
            state.checkTokenLoading = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUserRole: (state, action) => {
            state.userRole = action.payload;
        },
        setActivityIdForFeedback: (state, action) => {
            state.activityIdForFeedback = action.payload;
        },
        setChartData: (state, action) => {
            state.chartData = action.payload;
        },
    }
});

export const { setLoggedIn, setCheckTokenLoading, setToken, setUserRole, setActivityIdForFeedback, setChartData } = globalSlice.actions;
export default globalSlice.reducer;
