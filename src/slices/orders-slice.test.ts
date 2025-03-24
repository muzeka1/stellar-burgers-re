import { configureStore } from "@reduxjs/toolkit"
import { TFeedsResponse } from "../utils/burger-api"
import ordersReducer, { getFeedsThunk, getOrdersThunk, orderBurgerThunk } from './orders-slice'

jest.mock('../utils/burger-api', () => ({
    ...jest.requireActual('../utils/burger-api'),
    getOrdersApi: jest.fn(),
    getFeedsApi: jest.fn(),
    orderBurgerApi: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks()
})

const mockFeeds: TFeedsResponse = {
    "success": true,
    "orders": [
        {
            "_id": "67d417b26fce7d001db5a2db",
            "ingredients": [
                "643d69a5c3f7b9001cfa093d",
                "643d69a5c3f7b9001cfa093e",
                "643d69a5c3f7b9001cfa0940",
                "643d69a5c3f7b9001cfa093f",
                "643d69a5c3f7b9001cfa0943",
                "643d69a5c3f7b9001cfa0942",
                "643d69a5c3f7b9001cfa093d"
            ],
            "status": "done",
            "name": "Флюоресцентный space бессмертный spicy люминесцентный метеоритный бургер",
            "createdAt": "2025-03-14T11:49:06.882Z",
            "updatedAt": "2025-03-14T11:49:07.561Z",
            "number": 71021
        },
        {
            "_id": "67d417516fce7d001db5a2da",
            "ingredients": [
                "643d69a5c3f7b9001cfa093d",
                "643d69a5c3f7b9001cfa0946",
                "643d69a5c3f7b9001cfa093d"
            ],
            "status": "done",
            "name": "Флюоресцентный минеральный бургер",
            "createdAt": "2025-03-14T11:47:29.711Z",
            "updatedAt": "2025-03-14T11:47:30.382Z",
            "number": 71020
        },
        {
            "_id": "67d40e936fce7d001db5a2be",
            "ingredients": [
                "643d69a5c3f7b9001cfa093d",
                "643d69a5c3f7b9001cfa0940",
                "643d69a5c3f7b9001cfa093d"
            ],
            "status": "done",
            "name": "Флюоресцентный метеоритный бургер",
            "createdAt": "2025-03-14T11:5:11.496Z",
            "updatedAt": "2025-03-14T11:5:12.302Z",
            "number": 71019
        }
    ],
    "total": 70647,
    "totalToday": 115
}

const mockOrders: TFeedsResponse = {
    "success": true,
    "orders": [
        {
            "_id": "67b9c43c133acd001be52d51",
            "ingredients": [
                "643d69a5c3f7b9001cfa093d"
            ],
            "status": "done",
            "name": "Флюоресцентный бургер",
            "createdAt": "2025-02-22T12:34:04.284Z",
            "updatedAt": "2025-02-22T12:34:04.930Z",
            "number": 69168
        },
        {
            "_id": "67b9c4d6133acd001be52d52",
            "ingredients": [
                "643d69a5c3f7b9001cfa093d"
            ],
            "status": "done",
            "name": "Флюоресцентный бургер",
            "createdAt": "2025-02-22T12:36:38.046Z",
            "updatedAt": "2025-02-22T12:36:38.724Z",
            "number": 69169
        }
    ],
    "total": 70648,
    "totalToday": 116
}

const mockOrderBurger = {
    "success": true,
    "name": "Краторный бургер",
    "order": {
        "ingredients": [
            {
                "_id": "643d69a5c3f7b9001cfa093c",
                "name": "Краторная булка N-200i",
                "type": "bun",
                "proteins": 80,
                "fat": 24,
                "carbohydrates": 53,
                "calories": 420,
                "price": 1255,
                "image": "https://code.s3.yandex.net/react/code/bun-02.png",
                "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
                "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
                "__v": 0
            }
        ],
        "_id": "67d18ae0133acd001be57423",
        "owner": {
            "name": "mockName",
            "email": "mockemail@test.com",
            "createdAt": "2025-02-22T08:45:50.218Z",
            "updatedAt": "2025-02-22T16:56:50.207Z"
        },
        "status": "done",
        "name": "Краторный бургер",
        "createdAt": "2025-03-12T13:23:44.180Z",
        "updatedAt": "2025-03-12T13:23:44.928Z",
        "number": 70770,
        "price": 1255
    }
}

const mockErrorResponse = {
    "success": false,
    "message": "ошибка"
}

describe('проверка слайса orders-slice', () => {
    it('проверка на успешный запрос getOrders', async () => {
        const mockGetOrders = jest.spyOn(require('../utils/burger-api'), 'getOrdersApi').mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve(mockOrders.orders), 5);
            })
        );

        const store = configureStore({
            reducer: {
                orders: ordersReducer,
            },
        });

        const initialState = store.getState().orders;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(getOrdersThunk());
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().orders;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().orders;

        expect(finalState.isLoading).toBe(false);
        expect(finalState.orders).toEqual(mockOrders.orders)
    })

    it('проверка на ошибочный запрос getOrders', async () => {
        const mockGetOrders = jest.spyOn(require('../utils/burger-api'), 'getOrdersApi').mockImplementation(() =>
            new Promise((_, reject) => {
                setTimeout(() => reject(mockErrorResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                orders: ordersReducer,
            },
        });

        const initialState = store.getState().orders;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(getOrdersThunk());
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().orders;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().orders;
        expect(finalState.isLoading).toBe(false);
        expect(finalState.error).toBe('ошибка')
    })

    it('проверка на успешный запрос getFeeds', async () => {
        const mockGetFeeds = jest.spyOn(require('../utils/burger-api'), 'getFeedsApi').mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve(mockFeeds), 5);
            })
        );

        const store = configureStore({
            reducer: {
                orders: ordersReducer,
            },
        });

        const initialState = store.getState().orders;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(getFeedsThunk());
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().orders;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().orders;

        expect(finalState.isLoading).toBe(false);
        expect(finalState.feeds).toEqual(mockFeeds)
    })

    it('проверка на ошибочный запрос getFeeds', async () => {
        const mockGetFeeds = jest.spyOn(require('../utils/burger-api'), 'getFeedsApi').mockImplementation(() =>
            new Promise((_, reject) => {
                setTimeout(() => reject(mockErrorResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                orders: ordersReducer,
            },
        });

        const initialState = store.getState().orders;
        expect(initialState.isLoading).toBe(false);

        const dispatch = store.dispatch(getFeedsThunk());
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().orders;
        expect(pendingState.isLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().orders;
        expect(finalState.isLoading).toBe(false);
        expect(finalState.error).toBe('ошибка')
    })

    it('проверка на успешный запрос orderBurger', async () => {
        const mockGetOrder = jest.spyOn(require('../utils/burger-api'), 'orderBurgerApi').mockImplementation(() =>
            new Promise((resolve) => {
                setTimeout(() => resolve(mockOrderBurger), 5);
            })
        );

        const store = configureStore({
            reducer: {
                orders: ordersReducer,
            },
        });

        const initialState = store.getState().orders;
        expect(initialState.isOrderLoading).toBe(false);

        const dispatch = store.dispatch(orderBurgerThunk(["ingredient_id"]));
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().orders;
        expect(pendingState.isOrderLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().orders;

        expect(finalState.isOrderLoading).toBe(false);
        expect(finalState.successedOrder).toEqual(mockOrderBurger.order)
    })
    
    it('проверка на ошибочный запрос orderBurger', async () => {
        const mockGetFeeds = jest.spyOn(require('../utils/burger-api'), 'orderBurgerApi').mockImplementation(() =>
            new Promise((_, reject) => {
                setTimeout(() => reject(mockErrorResponse), 5);
            })
        );

        const store = configureStore({
            reducer: {
                orders: ordersReducer,
            },
        });

        const initialState = store.getState().orders;
        expect(initialState.isOrderLoading).toBe(false);

        const dispatch = store.dispatch(orderBurgerThunk(["ingredient_id"]));
        await new Promise((resolve) => setTimeout(resolve, 1));
        const pendingState = store.getState().orders;
        expect(pendingState.isOrderLoading).toBe(true);

        await dispatch;
        const finalState = store.getState().orders;
        expect(finalState.isOrderLoading).toBe(false);
        expect(finalState.error).toBe('ошибка')
    })
})