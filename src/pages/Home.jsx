import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPostsByTag, fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const { data } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(0);
  const { tagname } = useParams();

  useEffect(() => {
    dispatch(fetchPosts(0));
    dispatch(fetchTags());
  }, []);

  useEffect(() => {
    if (tagname) {
      console.log(tagname);
      dispatch(fetchPostsByTag({ activeTab, tagname }));
    }
  }, [tagname]);

  const tabChange = async (e, val) => {
    setActiveTab(val);
    console.log(activeTab);
    tagname ? dispatch(fetchPostsByTag({ val, tagname })) : dispatch(fetchPosts(val));
  };

  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab}
        onChange={tabChange}
        aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, i) =>
            isPostLoading ? (
              <Post key={i} isLoading={isPostLoading} />
            ) : (
              <Post
                key={obj._id}
                _id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={Boolean(obj.user._id === data?._id)}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
