import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CommentPr, CreateCommentDto, UpdateCommentDto } from "../interfaces/comment.interface";
import axios from "axios";
import { PREFIX } from "../helpers/Api";
import type { RootState } from "./store";

interface CommentState {
	comments: CommentPr[];
	isLoading: boolean;
	getTasksError?: string;
}

const initialState: CommentState = {
	comments: [],
	isLoading: false
};

export const getCommentsByTask = createAsyncThunk<CommentPr[], { id: number }, { state: RootState }>('comments/getCommentsByTask',
	async (params: { id: number }) => {
		const { data } = await axios.get<CommentPr[]>(`${PREFIX}/comments/task/${params.id}`)
		return data;
	}
);

export const createComment = createAsyncThunk<CommentPr, CreateCommentDto, { state: RootState }>('comments/createComment',
		async (params) => {
			const { description, taskId, userId} = params
			const { data } = await axios.post<CommentPr>(`${PREFIX}/comments`, {
				description,
				taskId,
				userId
			});
			return data;
		}
);

export const updateComment = createAsyncThunk<CommentPr, UpdateCommentDto, { state: RootState }>('comments/updateComment',
	async (params: UpdateCommentDto) => {
		const { data } = await axios.patch<CommentPr>(`${PREFIX}/comments/${params.id}`, {
				description: params.description
			});
		return data;
	}
);

export const deleteComment = createAsyncThunk<CommentPr, { id: number }, { state: RootState }>('comments/deleteComment',
	async (params) => {
		const { id } = params;
		const { data } = await axios.delete<CommentPr>(`${PREFIX}/comments/${id}`);
		return data;
	}
);

export const commentSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getCommentsByTask.pending, (state) => {
			state.isLoading = true;		
		});
		builder.addCase(getCommentsByTask.fulfilled, (state, action) => {
			state.isLoading = false;
			state.comments = action.payload;
		});
		builder.addCase(getCommentsByTask.rejected, (state, action) => {
			state.isLoading = false;
			state.getTasksError = action.error.message;
			console.log(action.payload);		
		});


		builder.addCase(createComment.fulfilled, (state, action) => {
					state.comments.push(action.payload);
		});
		builder.addCase(createComment.rejected, (_, action) => {
			console.log(action.error);
			console.log(action.payload);			
		});


		builder.addCase(updateComment.fulfilled, (state, action) => {
			state.comments = state.comments.map( comment => comment.id === action.payload.id ? action.payload : comment);
		});
		builder.addCase(updateComment.rejected, (_, action) => {
			console.log(action.error);
		});


		builder.addCase(deleteComment.fulfilled, (state, action) => {
			state.comments = state.comments.filter(comment => comment.id !== action.payload.id);
		});
		builder.addCase(deleteComment.rejected, (_, action) => {
			console.log(action.error.message);
		});
	}
});

export default commentSlice.reducer;
export const commentActions = commentSlice.actions;