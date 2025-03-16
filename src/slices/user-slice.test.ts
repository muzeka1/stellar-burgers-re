import { configureStore } from "@reduxjs/toolkit";
import { TAuthResponse } from "../utils/burger-api";
import userReducer, { getUserThunk, loginUserThunk, logoutUserThunk, registerUserThunk } from './user-slice'
import { deleteCookie, getCookie, setCookie } from "../utils/cookie";

jest.mock('../utils/burger-api', () => ({
    ...jest.requireActual('../utils/burger-api'),
    loginUserApi: jest.fn(),
    registerUserApi: jest.fn(),
    forgotPasswordApi: jest.fn(),
    resetPasswordApi: jest.fn(),
    getUserApi: jest.fn(),
    updateUserApi: jest.fn(),
    logoutApi: jest.fn(),
}));

const mockLoginData = {
    email: "mock@mock.com",
    password: "mockmock"
}

const mockRegisterData = {
    email: "mock@mock.com",
    name: "mock",
    password: "mockmock"
}

const mockSuccessUserResponse: TAuthResponse = {
    success: true,
    accessToken: "access-token",
    refreshToken: "refresh-token",
    user: {
        email: "mock@mock.com",
        name: "mock"
    }
}

const mockErrorResponse = {
    "success": false,
    "message": "ошибка"
}

beforeEach(() => {
    deleteCookie('accessToken')
    localStorage.removeItem('refreshToken')
    jest.clearAllMocks()
})

describe('проверка слайса user-slice', () => {
    it("проверка на успешный запрос loginUser", async () => {
        const mockLoginUser = jest.spyOn(require('../utils/burger-api'), 'loginUserApi').mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve(mockSuccessUserResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                user: userReducer,
            },
        });

        const initialState = store.getState().user;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(loginUserThunk(mockLoginData));
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().user;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().user;

        expect(finalState.isLoading).toBe(false);
        expect(finalState.isLoggedIn).toBe(true)
        expect(localStorage.getItem('refreshToken')).toEqual('refresh-token')
        expect(getCookie('accessToken')).toEqual('access-token')
        expect(finalState.user).toEqual(mockSuccessUserResponse.user);
    })

    it('проверка на ошибочный запрос loginUser', async () => {
        const mockGetOrders = jest.spyOn(require('../utils/burger-api'), 'loginUserApi').mockImplementation(() =>
            new Promise((_, reject) => {
                setTimeout(() => reject(mockErrorResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                user: userReducer,
            },
        });

        const initialState = store.getState().user;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(loginUserThunk(mockLoginData));
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().user;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().user;
        expect(finalState.isLoading).toBe(false);
        expect(finalState.error).toBe('ошибка')
    })

    it("проверка на успешный запрос registerUser", async () => {
        const mockLoginUser = jest.spyOn(require('../utils/burger-api'), 'registerUserApi').mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve(mockSuccessUserResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                user: userReducer,
            },
        });

        const initialState = store.getState().user;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(registerUserThunk(mockRegisterData));
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().user;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().user;

        expect(finalState.isLoading).toBe(false);
        expect(finalState.isLoggedIn).toBe(true)
        expect(finalState.user).toEqual(mockSuccessUserResponse.user);
    })

    it('проверка на ошибочный запрос registerUser', async () => {
        const mockGetOrders = jest.spyOn(require('../utils/burger-api'), 'registerUserApi').mockImplementation(() =>
            new Promise((_, reject) => {
                setTimeout(() => reject(mockErrorResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                user: userReducer,
            },
        });

        const initialState = store.getState().user;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(registerUserThunk(mockRegisterData));
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().user;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().user;
        expect(finalState.isLoading).toBe(false);
        expect(finalState.error).toBe('ошибка')
    })

    it("проверка на успешный запрос getUser", async () => {
        const mockLoginUser = jest.spyOn(require('../utils/burger-api'), 'getUserApi').mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve(mockSuccessUserResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                user: userReducer,
            },
        });

        const initialState = store.getState().user;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(getUserThunk());
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().user;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().user;

        expect(finalState.isLoading).toBe(false);
        expect(finalState.isLoggedIn).toBe(true)
        expect(finalState.user).toEqual(mockSuccessUserResponse.user);
    })

    it('проверка на ошибочный запрос getUser', async () => {
        const mockGetOrders = jest.spyOn(require('../utils/burger-api'), 'getUserApi').mockImplementation(() =>
            new Promise((_, reject) => {
                setTimeout(() => reject(mockErrorResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                user: userReducer,
            },
        });

        const initialState = store.getState().user;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(getUserThunk());
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().user;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().user;
        expect(finalState.isLoading).toBe(false);
        expect(finalState.error).toBe('ошибка')
    })

    it("проверка на успешный запрос logoutUser", async () => {
        localStorage.setItem('refreshToken', "refresh-token")
        setCookie('accessToken', 'access-token')
        const mockLogoutUser = jest.spyOn(require('../utils/burger-api'), 'logoutApi').mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve({ success: true }), 5);
            })
        );

        const store = configureStore({
            reducer: {
                user: userReducer,
            },
        });

        const initialState = store.getState().user;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(logoutUserThunk());
        await dispatch;

        const finalState = store.getState().user;
        expect(finalState.isLoading).toBe(false);
        expect(finalState.isLoggedIn).toBe(false);
        expect(localStorage.getItem('refreshToken')).toBe(null)
        expect(getCookie('accessToken')).toBe(undefined)
        expect(finalState.user).toEqual(null);
    })
})