import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import axios from "axios";
import { PREFIX } from "../helpers/Api";

interface CreateTaskDto {
	executorId?: number | null;
	projectId: number;
	taskName: string;
	description?: string;
	deadline?: string;
	statusId: number;
	parentTaskId?: number;
  	isSubtask: boolean;
}

interface UpdateTaskDto {
	id: number;
	creatorId?: number;
	executorId?: number | null;
	projectId?: number;
	taskName?: string;
	description?: string;
	deadline?: Date | null;
	statusId?: number;
	priorityId?: number;
	completedAt?: any;
	timeSpent?: any;
	parentTaskId?: number;
  	isSubtask?: boolean;
	isDone?: boolean;
}

interface Task {
	id: number;
	creatorId: number;
	executorId: number;
	projectId: number;
	taskName: string;
	description: string;
	createDate: string;
	updateDate: string;
	deadline: Date;
	statusId: number;
	priorityId: number;
	completedAt: any;
	timeSpent: any;
	parentTaskId: any;
  	isSubtask: boolean;
	isDone: boolean;
}

export interface TaskState {
	tasks: Task[];
	defaultPriority: number;
	getTasksError?: string;	
}

const initialState: TaskState = {
	tasks: [],
	defaultPriority: 2
};

export const deleteTask = createAsyncThunk<Task, { id: number }, { state: RootState }>('task/deleteTask',
	async (params, thunkApi) => {
		const { id } = params;
		const jwt = thunkApi.getState().user.jwt;
		const { data } = await axios.delete<Task>(`${PREFIX}/task/${id}`,
			{
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			}
		);
		return data;
	}
);

export const updateTask = createAsyncThunk<Task, UpdateTaskDto, { state: RootState }>('task/updateTask',
	async (params: UpdateTaskDto) => {
		const { data } = await axios.patch<Task>(`${PREFIX}/task/${params.id}`, {
				creatorId: params.creatorId,
				executorId: params.executorId,
				projectId: params.projectId,
				taskName: params.taskName,
				description: params.description,
				deadline: params.deadline,
				statusId: params.statusId,
				priorityId: params.priorityId,
				completedAt: params.completedAt,
				timeSpent: params.timeSpent,
				parentTaskId: params.parentTaskId,
				isSubtask: params.isSubtask,
				isDone: params.isDone
			});
		return data;
	}
);

export const createTask = createAsyncThunk<Task, CreateTaskDto, { state: RootState }>('tasks/createTask',
		async (params, thunkApi) => {
			const creator = thunkApi.getState().user.profile?.id;
			const defaultPriority = thunkApi.getState().tasks.defaultPriority;
			const { data } = await axios.post<Task>(`${PREFIX}/task`, {
				taskName: params.taskName,
				creatorId: creator,
				projectId: params.projectId,
				statusId: params.statusId,
				deadline: params.deadline,
				executorId: params.executorId,
				isSubtask: params.isSubtask,
				parentTaskId: params.parentTaskId,
				priorityId: defaultPriority
			});
			return data;
		}
);

export const getTasksByProjects = createAsyncThunk<Task[], { id: number }, { state: RootState }>('tasks/getTasksByProjects',
	async (params: { id: number }, thunkApi) => {
		const jwt = thunkApi.getState().user.jwt;
		const { data } = await axios.get<Task[]>(`${PREFIX}/task/project/${params.id}`,
			{
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
		return data;
	}
);

export const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		changeTaskStatus(state, action: PayloadAction<{activeId: number, overId: number, type: string}>) {
			const { activeId, overId, type } = action.payload
			const activeTaskIndex = state.tasks.findIndex(t => t.id === activeId);
			const overTask = state.tasks.find(t => t.id === overId);
			
			if (activeTaskIndex !== -1 && overTask && type === 'Task') {
				state.tasks[activeTaskIndex].statusId = overTask.statusId;
			}

			if (type === 'Desk') {
				state.tasks[activeTaskIndex].statusId = overId
			}
			
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getTasksByProjects.fulfilled, (state, action) => {
			state.getTasksError = undefined;
			state.tasks = action.payload;
		});
		builder.addCase(getTasksByProjects.rejected, (state, action) => {
			state.getTasksError = action.error.message;
			console.log(action.error);	
		});

		builder.addCase(createTask.fulfilled, (state, action) => {
			state.tasks.push(action.payload)
		});
		builder.addCase(createTask.rejected, (_, action) => {
			console.log(action.error);
		});

		builder.addCase(updateTask.fulfilled, (state, action) => {
			state.tasks = state.tasks.map( t => t.id === action.payload.id ? action.payload : t);
		});
		builder.addCase(updateTask.rejected, (_, action) => {
			console.log(action.error);
		});

		builder.addCase(deleteTask.fulfilled, (state, action) => {
			state.tasks = state.tasks.filter(p => p.id !== action.payload.id);
		});
		builder.addCase(deleteTask.rejected, (_, action) => {
			console.log(action.error.message);
		});
		
	}
});

export default tasksSlice.reducer;
export const tasksActions = tasksSlice.actions;