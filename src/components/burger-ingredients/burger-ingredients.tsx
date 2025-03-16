import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { selectIngredients } from '../../slices/ingredients-slice';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector, RootState, useDispatch } from '../../services/store';
import { getIngredientsThunk } from '../../slices/ingredients-slice';

export const BurgerIngredients: FC = () => {
  /** TODO: взять переменные из стора */
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients)

  const [buns, setBuns] = useState<TIngredient[]>([])
  const [mains, setMains] = useState<TIngredient[]>([])
  const [sauces, setSauces] = useState<TIngredient[]>([])

  useEffect(() => {
    if (ingredients) {
      setBuns(ingredients.filter((ingredient) => ingredient.type === 'bun'));
      setMains(ingredients.filter((ingredient) => ingredient.type === 'main'));
      setSauces(ingredients.filter((ingredient) => ingredient.type === 'sauce'));
    }
  }, [ingredients])

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun' && titleBunRef.current) {
      titleBunRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'main' && titleMainRef.current) {
      titleMainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'sauce' && titleSaucesRef.current) {
      titleSaucesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
     <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
