import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

import {addBun, addMain, addSauce} from '../../slices/ingredients-slice'
import { useDispatch } from '../../services/store';
import { TIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation()
    const dispatch = useDispatch()

    const handleAdd = () => {
      if (ingredient.type == "bun") {
        dispatch(addBun({ingredient, id: nanoid()}))
      } else if (ingredient.type == "main") {
        dispatch(addMain({ingredient, id: nanoid()}))
      } else {
        dispatch(addSauce({ingredient, id: nanoid()}))
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ backgroundLocation: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
