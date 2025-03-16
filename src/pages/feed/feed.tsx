import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedsThunk, getOrdersThunk, selectFeeds, selectIsOrdersLoading, selectOrders } from '../../slices/orders-slice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const feeds = useSelector(selectFeeds);
  const isLoading = useSelector(selectIsOrdersLoading)

  useEffect(()=>{
    dispatch(getFeedsThunk())
  }, [])

  if (isLoading) { return <Preloader /> }

  if (!feeds?.orders) {
    return <Preloader />;
  }

  return (
  <FeedUI orders={feeds.orders} handleGetFeeds={() => { dispatch(getFeedsThunk()) }} />
);
};
