import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearConstructorItems, selectConstructorItems } from '../../slices/ingredients-slice';
import { clearOrderData, orderBurgerThunk, selectIsOrderRequest, selectSuccessedOrder, changeLoadingOrder, selectOrderError, selectIsOrderSuccessed } from '../../slices/orders-slice';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../slices/user-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectConstructorItems)
  const orderRequest = useSelector(selectIsOrderRequest);
  const orderModalData = useSelector(selectSuccessedOrder);
  const ingredientsId = [...constructorItems.ingredients.map(item=>item._id)]
  const isSuccessed = useSelector(selectIsOrderSuccessed)

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) 
      {
        navigate('/login')
        return
      }
    dispatch(orderBurgerThunk([...ingredientsId, constructorItems.bun._id]))
  };

  useEffect(() => {
    if (isSuccessed) {
      dispatch(clearConstructorItems())
    }
  }, [isSuccessed])

  const closeOrderModal = () => {
    dispatch(clearOrderData())
    dispatch(changeLoadingOrder())
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
