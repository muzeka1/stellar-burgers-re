import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUserThunk, selectErrorUser, selectIsUserLoading, selectUser } from '../../slices/user-slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { Preloader } from '../../components/ui';

export const Login: FC = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(selectErrorUser);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsUserLoading)
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email: email, password: password }));
  };

  if (isLoading) {
    return <Preloader/>
  } else if (!isLoading && user) {
    navigate(from, {replace: true})
  } else {
    return (
      <LoginUI
        errorText={errorText}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    );
  }
};
