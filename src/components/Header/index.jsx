import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthType, logout } from '../../redux/slices/auth';
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const Header = () => {
  const isAuth = useSelector(isAuthType);
  const dispatch = useDispatch();

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>DIMASH'S BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button size="medium" variant="contained">
                    Написать статью
                  </Button>
                </Link>
                <Button onClick={onClickLogout} size="medium" variant="contained" color="error">
                  Выйти
                </Button>
                <Link to="/profile">
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    color="inherit">
                    <AccountCircleIcon />
                  </IconButton>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};