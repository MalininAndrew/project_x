
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  message: string;
  actionType?: string;
  payload?: any;
}

const initialState: ModalState = {
  isOpen: false,
  message: '',
  actionType: '',
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		showModal: (state, action: PayloadAction<{ message: string, actionType: string, payload: any }>) => {
			state.isOpen = true;
			state.message = action.payload.message;
			state.actionType = action.payload.actionType;
			state.payload = action.payload.payload
		},
		hideModal: (state) => {
			state.isOpen = false;
			state.message = '';
			state.actionType = '';
			state.payload = undefined;
		},
	},
});

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;
