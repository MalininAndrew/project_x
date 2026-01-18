import { configureStore } from "@reduxjs/toolkit";
import { JWT_PERSISTANT_STATE, userSlice } from "./user.slice";
import { saveState } from "./storage";
import { projectSlice } from "./project.slice";
import modalSlice from "./modal.slice";
import { tasksSlice } from "./task.slice";
import { companySlice } from "./company.slice";
import taskModalSlice from "./taskModal.slice";
import { commentSlice } from "./comments.slice";

export const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		company: companySlice.reducer,
		projects: projectSlice.reducer,
		tasks: tasksSlice.reducer,
		modal: modalSlice,
		taskModal: taskModalSlice,
		comments: commentSlice.reducer
	}
});

store.subscribe(() => {
	saveState(JWT_PERSISTANT_STATE, {jwt: store.getState().user.jwt})
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;