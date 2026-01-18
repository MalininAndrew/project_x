import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Profile } from "../interfaces/profile.interface";
import type { RootState } from "./store";
import axios from "axios";
import { PREFIX } from "../helpers/Api";

interface UpdateCompanyDto {
	id: number;
	name?: string;
	ownerId?: string;
}

interface CreateNewEmployeeDto {
	name: string;
	email: string;
	password: string;
	roleId: number;
	companyId: number;
}

interface CompanyData {
	name: string;
	ownerId: number;
}

export interface CompanyState {
	team: Profile[];
	company: CompanyData | null;
	teamError?: string | null;
	companyError?: string | null;
	createEmployeeError?: string | null;
}

const initialState: CompanyState = {
	team: [],
	company: null,
	teamError: null,
	companyError: null,
	createEmployeeError: null
};

export const createNewEmployee = createAsyncThunk<Profile, CreateNewEmployeeDto, { state: RootState }>('company/createNewEmployee',
	async (params: CreateNewEmployeeDto, thunkApi) => {
		const jwt = thunkApi.getState().user.jwt;
		const { data } = await axios.post<Profile>(`${PREFIX}/company/createNewEmployee`, 
			{
				name: params.name,
				email: params.email,
				password: params.password,
				roleId: params.roleId,
				companyId: params.companyId
			},
			{
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			}
			);
		return data;
	}
);

export const deleteEmployee = createAsyncThunk<Profile, { userId: number }, { state: RootState }>('company/deleteEmployee',
	async (params: { userId: number }, thunkApi) => {
		const jwt = thunkApi.getState().user.jwt;
		const { data } = await axios.delete<Profile>(`${PREFIX}/users/${params.userId}`, 
			{
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			}
			);
		return data;
	}
);

export const updateCompany = createAsyncThunk<CompanyData, UpdateCompanyDto, { state: RootState }>('company/updateCompany',
	async (params: UpdateCompanyDto, thunkApi) => {
		const jwt = thunkApi.getState().user.jwt;
		const { data } = await axios.patch<CompanyData>(`${PREFIX}/company/update/${params.id}`, 
			{
				name: params.name,
				ownerId: params.ownerId
			},
			{
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			}
			);
		return data;
	}
);

export const getUsersByCompanyId = createAsyncThunk<Profile[], { id: number }, { state: RootState }>('company/getUsersByCompanyId',
	async (params: { id: number }, thunkApi) => {
		const jwt = thunkApi.getState().user.jwt;
		const userOwnerId = thunkApi.getState().user.profile?.id;
		const { data } = await axios.get<Profile[]>(`${PREFIX}/company/${params.id}/users`,
			{
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
		return data.filter((user) => user.id !== userOwnerId);
	}
);

export const getCompanyData = createAsyncThunk<CompanyData, { id: number }, { state: RootState }>('company/getCompanyData',
	async (params: { id: number }, thunkApi) => {
		const jwt = thunkApi.getState().user.jwt;
		const { data } = await axios.get<CompanyData>(`${PREFIX}/company/${params.id}`,
			{
				headers: {
					Authorization: `Bearer ${jwt}`
				}
			})
		return data;
	}
);

export const companySlice = createSlice({
	name: 'company',
	initialState,
	reducers: {
		clearTeamError: (state) => {
			state.teamError = undefined;
		},
		clearCompanyError: (state) => {
			state.companyError = undefined;
		},
		clearCreateEmployeeError: (state) => {
			state.createEmployeeError = undefined;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getUsersByCompanyId.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.team = action.payload;
		});
		builder.addCase(getUsersByCompanyId.rejected, (state, action) => {
			state.teamError = action.error.message;
		});

		builder.addCase(updateCompany.fulfilled, (state, action) => {
			state.company = action.payload;
		});
		builder.addCase(updateCompany.rejected, (state, action) => {
			state.companyError = action.error.message;
		});

		builder.addCase(getCompanyData.fulfilled, (state, action) => {
			state.company = action.payload;
		});
		builder.addCase(getCompanyData.rejected, (state, action) => {
			state.companyError = action.error.message;
		});

		builder.addCase(createNewEmployee.fulfilled, (state, action) => {
			state.teamError = undefined;
			state.team.push(action.payload);
		});
		builder.addCase(createNewEmployee.rejected, (state, action) => {
			if (action.payload && typeof action.payload === 'object' && 'message' in action.payload) {
				state.createEmployeeError = action.payload.message as string;
			} else {
				state.createEmployeeError = action.error.message || 'Error';
			}
		});

		builder.addCase(deleteEmployee.fulfilled, (state, action) => {
			state.team = state.team.filter((m) => m.id !== action.payload.id);
		});
		builder.addCase(deleteEmployee.rejected, (state, action) => {
			state.teamError = action.error.message;
		});
	}
});

export default companySlice.reducer;
export const companyActions = companySlice.actions;