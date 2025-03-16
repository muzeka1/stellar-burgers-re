import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit'
import { forgotPasswordApi, getUserApi, loginUserApi, logoutApi, registerUserApi, resetPasswordApi, TLoginData, TRegisterData, updateUserApi } from "../utils/burger-api"
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';
import { RootState } from '../services/store';

export const loginUserThunk = createAsyncThunk(
    'users/loginUser',
    async ({ email, password }: TLoginData) => {
        const data = await loginUserApi({ email, password })
        if (data.success) {
            setCookie('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        return data
    }
)

export const registerUserThunk = createAsyncThunk(
    'users/registerUser',
    async ({ email, name, password }: TRegisterData) => {
        const data = await registerUserApi({ email, name, password })
        if (data.success) {
            setCookie('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        return data
    }
)

export const forgotPasswordThunk = createAsyncThunk(
    'users/forgotPassword',
    forgotPasswordApi
);

export const resetPasswordThunk = createAsyncThunk(
    'users/resetPassword',
    resetPasswordApi
);

export const getUserThunk = createAsyncThunk(
    'user/getUser',
    getUserApi
)

export const updateUserThunk = createAsyncThunk(
    'user/updateUser',
    updateUserApi
)

export const logoutUserThunk = createAsyncThunk(
    'user/logoutUser',
    async () => {
        const res = await logoutApi();
        if (res.success) {
            deleteCookie('accessToken');
            localStorage.removeItem('refreshToken');
        }
        return res;
    }
)

export interface UserState {
    isInit: boolean;
    isLoading: boolean;
    user: TUser | null;
    error: string | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    isInit: false,
    isLoading: false,
    user: null,
    error: null,
    isLoggedIn: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        init: (state) => {
            state.isInit = true;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUserThunk.pending, (state) => {
            state.isLoggedIn = false;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error?.message ?? "Unknown error"
        });
        builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isInit = true;
            state.error = null;
            state.user = payload.user;
            state.isLoggedIn = true
        });
        builder.addCase(registerUserThunk.pending, (state) => {
            state.isLoggedIn = false;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.isInit = true;
            state.error = null;
            state.error = action.error?.message ?? "Unknown error"
        });
        builder.addCase(registerUserThunk.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isInit = true;
            state.error = null;
            state.user = payload.user
            state.isLoggedIn = true
        });
        builder.addCase(getUserThunk.pending, (state) => {
            state.isLoggedIn = false;
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getUserThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.isInit = true;
            state.error = action.error?.message ?? "Unknown error";
        });
        builder.addCase(getUserThunk.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isInit = true;
            state.error = null;
            state.user = payload.user;
            state.isLoggedIn = true;
        });

        builder.addCase(updateUserThunk.fulfilled, (state, { payload }) => {
            state.user = payload.user;
            state.error = null;
        });
        builder.addCase(logoutUserThunk.rejected, (state, action) => {
            state.error = action.error?.message ?? "Unknown error"
        })
        builder.addCase(logoutUserThunk.fulfilled, (state) => {
            state.user = null;
            state.error = null;
            state.isLoggedIn = false;
        });
        builder.addCase(forgotPasswordThunk.pending, (state) => {
            state.error = null;
        });
        builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
            state.error = action.error?.message ?? "Unknown error"
        });
        builder.addCase(forgotPasswordThunk.fulfilled, (state) => {
            state.error = null;
        });
        builder.addCase(resetPasswordThunk.pending, (state) => {
            state.error = null;
        });
        builder.addCase(resetPasswordThunk.rejected, (state, action) => {
            state.error = action.error?.message ?? "Unknown error"
        });
        builder.addCase(resetPasswordThunk.fulfilled, (state) => {
            state.error = null;
        });
    }
});

export const { init } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectErrorUser = (state: RootState) => state.user.error;
export const selectIsUserLoading = (state: RootState) => state.user.isLoading;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export default userSlice.reducer