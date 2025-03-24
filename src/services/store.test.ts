import { rootReducer } from "./store";
import userReducer from "../slices/user-slice"
import ordersReducer from "../slices/orders-slice"
import ingredientsReducer from "../slices/ingredients-slice"

describe('проверка rootReducer', () => {
    it('проверка возвращаемого значения', () => {
        
        const userInitialState = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
        const ingredientsInitialState = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
        const ordersInitialState = ordersReducer(undefined, { type: 'UNKNOWN_ACTION' });

        const expectedInitialState = {
            user: userInitialState,
            ingredients: ingredientsInitialState,
            orders: ordersInitialState,
        };

        const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
        
        expect(result).toEqual(expectedInitialState);
    })
})