import Container from '@mui/material/Container';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { Header } from './components';
import { Home, FullPost, Registration, AddPost, Login } from './pages';
import { fetchMe, isAuthType } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthType);

  useEffect(() => {
    dispatch(fetchMe());
  }, []);
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/tags/:tagname" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
