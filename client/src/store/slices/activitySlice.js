import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activities: []
}

export const activitiesSlice = createSlice({
    name: 'activities',
    initialState,
    reducers: {
        setActivities: (state, action) => {
            state.activities = [...action.payload]
        },
        deleteActivity: (state, action) => {
            state.activities = state.activities.filter(activity => activity.id !== action.payload);
        }
    }
});

export const { setActivities, deleteActivity } = activitiesSlice.actions;

export default activitiesSlice.reducer;