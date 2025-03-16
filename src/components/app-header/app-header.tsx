import { FC, useEffect } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../slices/user-slice';
import { useLocation } from 'react-router-dom';

export const AppHeader: FC = () => {
    const userName = useSelector(selectUser)?.name
    const location = useLocation();
    return (
    <AppHeaderUI userName={userName} location={location}/>
    )
}
