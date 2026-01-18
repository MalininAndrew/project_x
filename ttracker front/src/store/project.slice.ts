import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { PREFIX } from "../helpers/Api";
import type { RootState } from "./store";
import type { Profile } from "../interfaces/profile.interface";

export interface Status {
  id: number
  name: string
  projectId: number
  sortIndex: number
}

export interface UsersProjectRole {
	id: number;
    userId: number;
    projectId: number;
    roleId: number;
}

export interface Project {
	id: number;
	name: string;
	description: string;
	ownerId: number;
	companyId: number;
	statuses: Status[];
}

export interface currentProject {
	settingsIsOpen: boolean;
	projectId: number | null;
}

export interface ProjectState {
	projects: Project[];
	currentProjectTeam: Profile[];
	teamLoadError?: string;
	currentProject: currentProject;
}

const initialState: ProjectState = {
	projects: [],
	currentProjectTeam: [],
	currentProject: {
		settingsIsOpen: false,
		projectId: null
	}
};

export const updateStatus = createAsyncThunk<Status, { id: number, name?: string, sortIndex?: number }, { state: RootState }>('project/updateStatus',
	async (params) => {
		const { id, name, sortIndex } = params;
		const { data } = await axios.patch<Status>(`${PREFIX}/statuses/update/${id}`, {
				name,
				sortIndex
			});
		return data;
	}
);

export const deleteProject = createAsyncThunk<Project, { id: number }, { state: RootState }>('project/deleteProject',
	async (params) => {
		const { id } = params;
		const { data } = await axios.delete<Project>(`${PREFIX}/projects/delete/${id}`);
		return data;
	}
);

export const updateProject = createAsyncThunk<Project, { id: number, name: string, description?: string }, { state: RootState }>('project/updateProject',
	async (params: { id: number, name: string, description?: string }) => {
		const { data } = await axios.patch<Project>(`${PREFIX}/projects/update`, {
				id: params.id,
				name: params.name,
				description: params.description
			});
		return data;
	}
);

export const createProject = createAsyncThunk<Project, {name: string}, { state: RootState }>('project/createProject',
	async (params: { name: string }, thunkApi) => {
		const userId = thunkApi.getState().user.profile?.id
		const companyId = thunkApi.getState().user.profile?.companyId
		const { data } = await axios.post<Project>(`${PREFIX}/projects/create`, {
			name: params.name,
			ownerId: userId,
			companyId
		});
		return data;
	}
);

export const addMemeberToProject = createAsyncThunk<Profile, { userId: number, projectId: number }, { state: RootState, rejectValue: { message: string } }>('project/addMemeberToProject',
	async (params: { userId: number, projectId: number }, { rejectWithValue }) => {
		try {
			const { data } = await axios.post<Profile>(`${PREFIX}/projects/addMember`, {
				userId: params.userId,
				projectId: params.projectId,
				roleId: 2
			});
			return data;
		} catch (e) {
			if (e instanceof AxiosError) {
				return rejectWithValue({ message: e.response?.data.message });
			}
			return rejectWithValue({ message: 'Неизвестная ошибка' });
		}
	}
);

export const removeUserFromProject = createAsyncThunk<UsersProjectRole, { userId: number, projectId: number }, { state: RootState }>('project/deleteUserFromProject',
	async (params: { userId: number, projectId: number }) => {
		const { data } = await axios.delete<UsersProjectRole>(`${PREFIX}/projects/removeUser`,
			{
				data: {
					userId: params.userId,
					projectId: params.projectId
				}
			}
		);
		return data;
	}
);

export const getProjectTeam = createAsyncThunk<Profile[], { projectId: number }, { state: RootState }>('project/getProjectsUsers',
	async (params: { projectId: number }) => {
		const { data } = await axios.get<Profile[]>(`${PREFIX}/projects/ProjectUsers/${params.projectId}`);
		return data;
	}
);

export const getUsersProjects = createAsyncThunk<Project[], void, { state: RootState }>('project/getUserProjects',
	async (_, thunkApi) => {
		const userId = thunkApi.getState().user.profile?.id;
		const { data } = await axios.get<Project[]>(`${PREFIX}/projects/findProjectsByUserId/${userId}`);
		return data;
	}
);

export const projectSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		showModal: (state, action: PayloadAction<{ projectId: number }>) => {
			state.currentProject.settingsIsOpen = true;
			state.currentProject.projectId = action.payload.projectId
		},
		hideModal: (state) => {
			state.currentProject.settingsIsOpen = false;
			state.currentProject.projectId = null;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getUsersProjects.fulfilled, (state, action) => {
			state.projects = action.payload;
		});
		builder.addCase(getUsersProjects.rejected, (_, action) => {
			console.log(action.error.message, action.error);
		});

		builder.addCase(createProject.fulfilled, (state, action) => {
			console.log(action.payload);
			state.projects.push(action.payload);
		});
		builder.addCase(createProject.rejected, (_, action) => {
			console.log(action.error.message);
		});

		builder.addCase(updateProject.fulfilled, (state, action) => {
			state.projects = state.projects.map( p => p.id === action.payload.id ? action.payload : p);
		});
		builder.addCase(updateProject.rejected, (_, action) => {
			console.log(action.error.message);
		});

		builder.addCase(deleteProject.fulfilled, (state, action) => {
			state.projects = state.projects.filter(p => p.id !== action.payload.id);
		});
		builder.addCase(deleteProject.rejected, (_, action) => {
			console.log(action.error.message);
		});

		builder.addCase(getProjectTeam.fulfilled, (state, action) => {
			state.currentProjectTeam = action.payload;
		});
		builder.addCase(getProjectTeam.rejected, (_, action) => {
			console.log(action.error);
		});

		builder.addCase(updateStatus.fulfilled, (state, action: PayloadAction<Status>) => {
			const { id, projectId, sortIndex } = action.payload;
			const project = state.projects.find((p) => p.id === projectId);
			const oldStatus = project?.statuses.find(s => s.id === id);
			if (oldStatus) {
				oldStatus.sortIndex = sortIndex
			}
		});
		builder.addCase(updateStatus.rejected, (_, action) => {
			console.log(action.payload);
		});

		builder.addCase(addMemeberToProject.fulfilled, (state, action) => {
			state.teamLoadError = undefined;
			state.currentProjectTeam?.push(action.payload)
		});
		builder.addCase(addMemeberToProject.rejected, (state, action) => {
			state.teamLoadError = action.payload?.message || action.error.message;
		});

		builder.addCase(removeUserFromProject.fulfilled, (state, action) => {
			state.currentProjectTeam = state.currentProjectTeam?.filter(p => p.id !== action.payload.userId);
		});
		builder.addCase(removeUserFromProject.rejected, (_, action) => {
			console.log(action.error.message);
		});
	}
});

export default projectSlice.reducer;
export const projectActions = projectSlice.actions;