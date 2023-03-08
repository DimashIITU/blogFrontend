import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { isAuthType } from '../../redux/slices/auth';
import { Navigate, Link, useNavigate, useParams } from 'react-router-dom';

export const AddPost = () => {
  const navigate = useNavigate();
  const inputFile = React.useRef(null);
  const isAuth = useSelector(isAuthType);
  const [imageUrl, setImageUrl] = React.useState('');
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const { id: idEdit } = useParams();

  React.useEffect(() => {
    if (idEdit) {
      (async () => {
        const { data } = await axios.get(`/posts/${idEdit}`);
        setImageUrl(data.imageUrl);
        setText(data.text);
        setTitle(data.title);
        setTags(data.tags.join(','));
      })();
    }
  }, []);

  const handleChangeFile = async (event) => {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    const { data } = await axios.post('/upload', formData);
    setImageUrl(data.url);
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onCancelPost = () => {
    setImageUrl('');
    setText('');
    setTitle('');
    setTags('');
  };

  const pablishPost = async () => {
    try {
      const field = {
        imageUrl,
        text,
        title,
        tags: tags.split(','),
      };
      const { data } = idEdit
        ? await axios.patch(`/posts/${idEdit}`, field)
        : await axios.post('/posts', field);
      navigate(`/posts/${data._id || idEdit}`);
    } catch (error) {
      console.log(error);
      alert('Не удалось создать статью');
    }
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (window.localStorage.getItem('token') && !isAuth) {
    <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFile.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFile} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img
          className={styles.image}
          src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
          alt="Uploaded"
        />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={pablishPost} size="large" variant="contained">
          Опубликовать
        </Button>
        <Link to="/">
          <Button onClick={onCancelPost} size="large">
            Отмена
          </Button>
        </Link>
      </div>
    </Paper>
  );
};
