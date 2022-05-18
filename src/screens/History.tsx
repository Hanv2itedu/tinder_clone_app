import React from 'react';
import { StyleSheet, View } from 'react-native';
import CardsStack from '../components/CardsStack';
import { TinderCard } from '../components/TinderCard';
import { User } from '../types/users';

const userFakes = [
  {
    firstName: 'Sara',
    id: '60d0fe4f5311236168a109ca',
    lastName: 'Andersen',
    picture: 'https://randomuser.me/api/portraits/women/58.jpg',
    title: 'ms',
  },
  {
    firstName: 'Edita',
    id: '60d0fe4f5311236168a109cb',
    lastName: 'Vestering',
    picture: 'https://randomuser.me/api/portraits/med/women/89.jpg',
    title: 'miss',
  },
];

const History = () => {
  return (
    <View style={styles.containerStyle}>
      <CardsStack
        data={userFakes}
        renderItem={({ item }: { item: User }) => (
          <TinderCard data={item} onViewDetailPress={() => {}} />
        )}
        onSwipeLeft={() => {}}
        onSwipeRight={() => {}}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  containerStyle: { flex: 1, padding: 20 },
  // btnGr: { flexDirection: 'row', justifyContent: 'space-around' },
});
