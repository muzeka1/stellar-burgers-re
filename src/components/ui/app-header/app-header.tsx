import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName, location }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <Link to='/' className={location.pathname == "/" ? styles.link_active : styles.link} state={{ from: location }}>
            <BurgerIcon type={location.pathname == '/' ? 'primary' : 'disabled'} />
            <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
          </Link>
        </>
        <>
          <Link to='/feed' className={location.pathname.startsWith('/feed') ? styles.link_active : styles.link} state={{ from: location }}>
            <ListIcon type={location.pathname.startsWith('/feed') ? 'primary' : 'disabled'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </>
      </div>
      <div className={styles.logo}>
        <Link to='/' state={{ from: location }}>
          <Logo className={styles.link_active} />
        </Link>
      </div>

      <div className={styles.link_position_last}>
        <Link to='/profile' className={location.pathname == ('/profile') ? styles.link_active : styles.link} state={{ from: location }}>
          <ProfileIcon type={location.pathname == '/profile' ? 'primary' : 'disabled'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </div>

    </nav>
  </header>
);
