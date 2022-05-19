import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import CardsStack from '../components/CardsStack';
import { TinderCard } from '../components/TinderCard';
import { IconButton } from '../core/IconButton';
import {
  currentUserSelector,
  fetchUsersAsync,
  nextUserSelector,
  onSwipe,
  pagingSelector,
} from '../store/usersReducer';
import { User } from '../types/users';
import { useAppDispatch } from '../utils/hook';

const Home = () => {
  const dispatch = useAppDispatch();
  const { page, isLastPage, queueLength } = useSelector(pagingSelector);
  const currentUser = useSelector(currentUserSelector);
  const nextUser = useSelector(nextUserSelector);

  const onLoadMore = () => {
    !isLastPage && dispatch(fetchUsersAsync(page));
  };

  useEffect(() => {
    onLoadMore();
  }, []);

  useEffect(() => {
    if (queueLength < 5 && !isLastPage) {
      onLoadMore();
    }
  }, [isLastPage, queueLength]);

  const _onSwipe = (isLeft: boolean = false) => {
    dispatch(onSwipe(isLeft));
  };

  return (
    <View style={styles.containerStyle}>
      <CardsStack
        currentProfile={currentUser}
        nextProfile={nextUser}
        renderItem={({ item }: { item: User }) => (
          <TinderCard data={item} onViewDetailPress={() => {}} />
        )}
        onSwipe={_onSwipe}
      />
      <View style={styles.btnGr}>
        <IconButton
          iconName="close"
          color="red"
          onPress={() => _onSwipe(true)}
        />
        <IconButton iconName="star" color="blue" onPress={() => _onSwipe()} />
        <IconButton iconName="heart" onPress={() => _onSwipe()} />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  containerStyle: { flex: 1, padding: 20 },
  btnGr: { flexDirection: 'row', justifyContent: 'space-around' },
});
