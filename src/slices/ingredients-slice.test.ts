import { TIngredient } from "../utils/types"
import ingredientsReducer, { addBun, addMain, addSauce, getIngredientsThunk, IIngredientsState, moveDown, moveUp, removeIngredient } from "./ingredients-slice"
import { configureStore } from "@reduxjs/toolkit"

afterEach(() => {
    jest.clearAllMocks()
})

const mockIngredients: TIngredient[] = [
    {
        "_id": "643d69a1c3f7b9001cfa093c",
        "name": "Краторная булка N-200i",
        "type": "bun",
        "proteins": 80,
        "fat": 24,
        "carbohydrates": 13,
        "calories": 420,
        "price": 1211,
        "image": "https://code.s3.yandex.net/react/code/bun-02.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
    },
    {
        "_id": "643d69a1c3f7b9001cfa0941",
        "name": "Биокотлета из марсианской Магнолии",
        "type": "main",
        "proteins": 420,
        "fat": 142,
        "carbohydrates": 242,
        "calories": 4242,
        "price": 424,
        "image": "https://code.s3.yandex.net/react/code/meat-01.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/meat-01-large.png",
    },
    {
        "_id": "643d69a1c3f7b9001cfa0942",
        "name": "Соус Spicy-X",
        "type": "sauce",
        "proteins": 30,
        "fat": 20,
        "carbohydrates": 40,
        "calories": 30,
        "price": 90,
        "image": "https://code.s3.yandex.net/react/code/sauce-02.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/sauce-02-large.png",
    }
]

const mockGetIngredientsSuccessResponse = {
    "success": true,
    "data": mockIngredients
  }

const mockErrorResponse = {
    "success": false,
    "message": "ошибка"
}

const initialState: IIngredientsState = {
    isLoading: false,
    ingredients: mockIngredients,
    error: null,
    constructorItems: {
        bun: null,
        ingredients: []
    }
}


const mockConstructorItems = {
    bun: { ...mockIngredients[0], id: mockIngredients[0]._id },
    ingredients: [{ ...mockIngredients[2], id: mockIngredients[2]._id }, { ...mockIngredients[1], id: mockIngredients[1]._id }]
}

const mockConstructorIngredientsChangedOrder = [{ ...mockIngredients[1], id: mockIngredients[1]._id }, { ...mockIngredients[2], id: mockIngredients[2]._id }]



describe('проверка слайса ingredients', () => {
    it('добавление ингредиента', () => {
        let newState = ingredientsReducer(initialState, addMain({ ingredient: mockIngredients[1], id: mockIngredients[1]._id }))
        newState = ingredientsReducer(newState, addBun({ ingredient: mockIngredients[0], id: mockIngredients[0]._id }))
        newState = ingredientsReducer(newState, addSauce({ ingredient: mockIngredients[2], id: mockIngredients[2]._id }))
        const { constructorItems } = newState;
        expect(constructorItems).toEqual(mockConstructorItems)
    })
    it('удаление ингредиента', () => {
        let newState = ingredientsReducer(initialState, addMain({ ingredient: mockIngredients[1], id: mockIngredients[1]._id }))
        newState = ingredientsReducer(newState, removeIngredient(0))
        const { constructorItems } = newState;
        expect(constructorItems.ingredients).toEqual([])
    })
    it('изменение порядка ингредиента в конструкторе (перемещение вниз)', () => {
        let newState = ingredientsReducer(initialState, addMain({ ingredient: mockIngredients[1], id: mockIngredients[1]._id }))
        newState = ingredientsReducer(newState, addSauce({ ingredient: mockIngredients[2], id: mockIngredients[2]._id }))
        newState = ingredientsReducer(newState, moveDown(0))
        const { constructorItems } = newState
        expect(constructorItems.ingredients).toEqual(mockConstructorIngredientsChangedOrder)
    })
    it('изменение порядка ингредиента в конструкторе (перемещение вверх)', () => {
        let newState = ingredientsReducer(initialState, addMain({ ingredient: mockIngredients[1], id: mockIngredients[1]._id }))
        newState = ingredientsReducer(newState, addSauce({ ingredient: mockIngredients[2], id: mockIngredients[2]._id }))
        newState = ingredientsReducer(newState, moveUp(1))
        const { constructorItems } = newState
        expect(constructorItems.ingredients).toEqual(mockConstructorIngredientsChangedOrder)
    })
    it('проверка на успешный запрос getIngredients', async () => {

        global.fetch = jest.fn(() =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(mockGetIngredientsSuccessResponse),
                    });
                }, 5);
            })
        ) as jest.Mock;

        const store = configureStore({
            reducer: {
                ingredients: ingredientsReducer,
            },
        });

        const initialState = store.getState().ingredients.isLoading;
        expect(initialState).toBe(false);

        const dispatch = store.dispatch(getIngredientsThunk());

        await new Promise((resolve) => setTimeout(resolve, 1));

        const pendingState = store.getState().ingredients.isLoading;
        expect(pendingState).toBe(true);

        await dispatch;

        const finalState = store.getState().ingredients;
        expect(finalState.isLoading).toBe(false);
        expect(finalState.ingredients).toEqual(mockIngredients)

    })
    
    it('проверка на ошибочный запрос getIngredients', async () => {

        global.fetch = jest.fn(() =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ok: false,
                        json: () => Promise.resolve(mockErrorResponse),
                    });
                }, 5);
            })
        ) as jest.Mock;

        const store = configureStore({
            reducer: {
                ingredients: ingredientsReducer,
            },
        });

        const initialState = store.getState().ingredients.isLoading;
        expect(initialState).toBe(false);

        const dispatch = store.dispatch(getIngredientsThunk());

        await new Promise((resolve) => setTimeout(resolve, 1));

        const pendingState = store.getState().ingredients.isLoading;
        expect(pendingState).toBe(true);

        await dispatch;

        const finalState = store.getState().ingredients;
        expect(finalState.isLoading).toBe(false);
        expect(finalState.error).toEqual("ошибка")
    })
})