import { createSlice, createAsyncThunk, nanoid,  } from '@reduxjs/toolkit'
import { getIngredientsApi } from '../utils/burger-api'
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../services/store';

export const getIngredientsThunk = createAsyncThunk(
    'ingredients/getIngredients',
    async () => getIngredientsApi()
)

export interface IIngredientsState {
    isLoading: boolean;
    ingredients: TIngredient[];
    error: string | null;
    constructorItems: {
        bun: TConstructorIngredient | null,
        ingredients: TConstructorIngredient[];
    }
}

const initialState: IIngredientsState = {
    isLoading: false,
    ingredients: [],
    error: null,
    constructorItems: {
        bun: null,
        ingredients:[]
    }
}

const ingredientSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {
        addBun: (state, {payload}: {payload: {ingredient: TIngredient; id: string}}) => {
            state.constructorItems.bun = {...payload.ingredient, id: payload.id}
        },
        removeBun: (state) => {
            state.constructorItems.bun = null
        },
        addMain: (state, {payload}: {payload: {ingredient: TIngredient; id: string}}) => {
            state.constructorItems.ingredients.push({...payload.ingredient, id: payload.id})
        },
        addSauce: (state, {payload}: {payload: {ingredient: TIngredient; id: string}}) => {
            state.constructorItems.ingredients.splice(Math.floor(state.constructorItems.ingredients.length/2), 0, {...payload.ingredient, id: payload.id})
        },
        removeIngredient: (state, {payload}: {payload: number}) => {
            state.constructorItems.ingredients.splice(payload, 1)
        },
        clearConstructorItems: (state) => {
            state.constructorItems = {bun:null, ingredients: []}
        },
        moveUp: (state, {payload}: {payload: number}) => {
            state.constructorItems.ingredients[payload-1] = state.constructorItems.ingredients.splice(payload, 1, state.constructorItems.ingredients[payload-1])[0]
        },
        moveDown: (state, {payload}: {payload: number}) => {
            state.constructorItems.ingredients[payload] = state.constructorItems.ingredients.splice(payload+1, 1, state.constructorItems.ingredients[payload])[0]
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getIngredientsThunk.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(getIngredientsThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error?.message ?? "Unknown error"
        });
        builder.addCase(getIngredientsThunk.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.ingredients = payload;
        })
    },
  });
export const selectIsIngredientsLoading = (state: RootState) => state.ingredients.isLoading;
export const selectIngredients = (state: RootState) => state.ingredients.ingredients;
export const selectConstructorItems = (state: RootState) => state.ingredients.constructorItems;
export const {addBun, removeBun, addMain, addSauce, removeIngredient, clearConstructorItems, moveUp, moveDown} = ingredientSlice.actions;
export default ingredientSlice.reducer