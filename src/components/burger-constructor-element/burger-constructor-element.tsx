import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { moveDown, moveUp, removeIngredient } from '../../slices/ingredients-slice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch()
    const handleMoveDown = () => {
      dispatch(moveDown(index));
    };

    const handleMoveUp = () => {
      dispatch(moveUp(index));
    };

    const handleClose = () => {
      dispatch(removeIngredient(index))
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
