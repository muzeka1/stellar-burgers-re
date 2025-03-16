import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/ingredients-slice';

export const IngredientDetails: FC<{isMain?: boolean}> = ({isMain = false}) => {
  /** TODO: взять переменную из стора */
  const {id} = useParams()
  const ingredients = useSelector(selectIngredients)
  const ingredientData = ingredients.find(item => item._id == id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI isMain={isMain} ingredientData={ingredientData} />;
};
