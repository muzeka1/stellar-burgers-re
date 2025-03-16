import { Preloader } from '@ui';
import React from 'react';
import { useSelector} from '../../services/store';
import {Outlet, Navigate, useLocation} from 'react-router-dom';
import { RootState } from '../../services/store';
import { ProtectedRouteProps } from './type';
import { selectIsLoggedIn } from '../../slices/user-slice';


export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({anonymous = false, children}) => {
    const {isLoggedIn, isInit, isLoading} = useSelector((state: RootState) => state.user);
    
    const location = useLocation();
    const from = location.state?.from || '/';

    if (!isInit || isLoading) {
        return <Preloader />;
    }

    if (anonymous && isLoggedIn) {
      return <Navigate to={ from } />;
    }

    if (!anonymous && !isLoggedIn) {
        return <Navigate to='/login' state={{ from: location}}/>;
    }

    return children;
};