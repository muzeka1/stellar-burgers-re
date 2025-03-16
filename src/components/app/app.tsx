import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from '../../services/store';
import { AppHeader, IngredientDetails, Modal, OrderInfo, ProtectedRoute } from '@components';
import { getIngredientsThunk, selectIngredients, selectIsIngredientsLoading } from '../../slices/ingredients-slice';
import React, { useEffect } from 'react';
import { getUserThunk } from '../../slices/user-slice';
import { Preloader } from '@ui';
import { getFeedsThunk, getOrdersThunk } from '../../slices/orders-slice';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsIngredientsLoading);

  useEffect(() => {
    dispatch(getIngredientsThunk())
    dispatch(getUserThunk())
  }, [])

  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <div>
      <AppHeader />
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails isMain/>} />
            <Route path='/login' element={<ProtectedRoute anonymous><Login /></ProtectedRoute>} />
            <Route path='/register' element={<ProtectedRoute anonymous><Register /></ProtectedRoute>} />
            <Route path='/forgot-password' element={<ProtectedRoute anonymous><ForgotPassword /></ProtectedRoute>} />
            <Route path='/reset-password' element={<ProtectedRoute anonymous><ResetPassword /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
            <Route path='/profile/orders/:number' element={<ProtectedRoute><OrderInfo /></ProtectedRoute>} />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation &&
            <Routes>
              <Route path='/feed/:number' element={<Modal title='Информация о заказе' onClose={() => { navigate(-1) }}><OrderInfo /></Modal>} />
              <Route path='/ingredients/:id' element={<Modal title='Детали ингредиента' onClose={() => { navigate(-1) }}><IngredientDetails/></Modal>} />
              <Route path='/profile/orders/:number' element={<ProtectedRoute><Modal title='Информация о заказе' onClose={() => { navigate(-1) }}><OrderInfo /></Modal></ProtectedRoute>} />
            </Routes>
          }
        </>
      )}
    </div>

  )
};

export default App;
