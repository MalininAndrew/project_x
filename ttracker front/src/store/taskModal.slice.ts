import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface TaskModalState {
  isOpen: boolean;
  taskId: number | null;
}

const initialState: TaskModalState = {
  isOpen: false,
  taskId: null
};

const taskModalSlice = createSlice({
	name: 'taskModal',
	initialState,
	reducers: {
		showModal: (state, action: PayloadAction<{ taskId: number }>) => {
			state.isOpen = true;
			state.taskId = action.payload.taskId
		},
		hideModal: (state) => {
			state.isOpen = false;
			state.taskId = null;
		}
	},
});

export const taskModalActions = taskModalSlice.actions;
export default taskModalSlice.reducer;
