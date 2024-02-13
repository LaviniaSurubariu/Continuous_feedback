import { configureStore } from '@reduxjs/toolkit'
import globalSlice from './slices/globalSlice'
import activitySlice from './slices/activitySlice'

export default configureStore({
  reducer: {
    global: globalSlice,
    activity: activitySlice
  },
})