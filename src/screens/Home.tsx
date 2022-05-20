import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { CardDetailModal } from '../components/CardDetailModal';
import CardsStack from '../components/CardsStack';
import { IconButton } from '../core/IconButton';
import { RootState } from '../store/configStore';
import {
  currentUserSelector,
  fetchUserDetailAsync,
  fetchUsersAsync,
  nextUserSelector,
  onSwipe,
  pagingSelector,
  userDetaisSelector,
} from '../store/usersReducer';
import { Status } from '../types/users';
import { useAppDispatch } from '../utils/hook';

const Home = () => {
  const dispatch = useAppDispatch();
  const { page, isLastPage } = useSelector(pagingSelector);
  const queueLength = useSelector(
    (state: RootState) => state.users.users.length,
  );
  const currentUser = useSelector(currentUserSelector);
  const nextUser = useSelector(nextUserSelector);
  const userDetails = useSelector(userDetaisSelector);
  const currentProfile = currentUser
    ? { ...currentUser, ...userDetails[currentUser.id] }
    : null;
  const nextProfile = nextUser
    ? { ...nextUser, ...userDetails[nextUser.id] }
    : null;

  const [isModalShow, setModalShow] = useState(false);

  const onLoadMore = useCallback(() => {
    !isLastPage && dispatch(fetchUsersAsync(page));
  }, [dispatch, isLastPage, page]);

  useEffect(() => {
    if (queueLength < 5 && !isLastPage) {
      onLoadMore();
    }
  }, [isLastPage, queueLength, onLoadMore]);

  useEffect(() => {
    if (!!currentUser && !userDetails[currentUser.id]) {
      dispatch(fetchUserDetailAsync(currentUser.id));
    }
    dispatch(fetchUserDetailAsync(nextUser.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, dispatch]);

  const onShowModal = () => setModalShow(true);
  const onHideModal = () => setModalShow(false);

  const _onSwipe = (status: Status) => {
    dispatch(onSwipe(status));
  };

  return (
    <View style={styles.containerStyle}>
      <CardsStack
        currentProfile={currentProfile}
        nextProfile={nextProfile}
        onSwipe={_onSwipe}
        onViewDetailPress={onShowModal}
      />
      {queueLength > 0 && (
        <View style={styles.btnGr}>
          <IconButton
            iconName="close"
            color="red"
            onPress={() => _onSwipe(Status.NOPED)}
          />
          <IconButton
            iconName="star"
            color="blue"
            onPress={() => _onSwipe(Status.SUPPER_LIKED)}
          />
          <IconButton iconName="heart" onPress={() => _onSwipe(Status.LIKED)} />
        </View>
      )}
      <CardDetailModal
        isVisble={isModalShow}
        data={currentProfile}
        onClose={onHideModal}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  containerStyle: { flex: 1, padding: 20 },
  btnGr: { flexDirection: 'row', justifyContent: 'space-around' },
});
