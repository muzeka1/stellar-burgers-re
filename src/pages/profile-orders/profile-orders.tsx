import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrdersThunk, selectIsOrderRequest, selectIsOrdersLoading, selectOrders } from '../../slices/orders-slice';
import { Preloader } from '../../components/ui';

export const ProfileOrders: FC = () => {
  const orders = useSelector(selectOrders);
  const isOrderLoading = useSelector(selectIsOrdersLoading)
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getOrdersThunk())
  }, [dispatch])

  return (isOrderLoading ? <Preloader/> : <ProfileOrdersUI orders={orders} />);
};
