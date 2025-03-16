import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUserThunk, selectErrorUser, selectIsUserLoading, selectUser } from '../../slices/user-slice';
import { replace, useNavigate } from 'react-router-dom';
import { Preloader } from '../../components/ui';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(selectErrorUser);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsUserLoading)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUserThunk({ email: email, password: password, name: userName }))
  };

  if (isLoading) {
    return <Preloader />
  } else if (!isLoading && user) {
    navigate("/")
  } else {
    return (
      <RegisterUI
        errorText={errorText}
        email={email}
        userName={userName}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
      />
    );
  }
};
