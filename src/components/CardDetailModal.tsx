import React from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IconButton } from '../core/IconButton';
import { UserDetail } from '../types/users';
import { getName } from '../utils';

interface CardDetailModalProps {
  data: UserDetail | null;
  isVisble: boolean;
  onClose: () => void;
}

export const CardDetailModal = (props: CardDetailModalProps) => {
  const { data, isVisble, onClose } = props;
  const { picture, firstName, lastName, age, email, location, phone, gender } =
    data || {};
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      visible={isVisble && !!data}
      statusBarTranslucent>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.modalContainer}>
          <Image
            resizeMode="cover"
            source={{
              uri: picture,
            }}
            style={styles.image}
          />
          <IconButton
            iconName="drop"
            color="white"
            containerStyle={styles.dropBtn}
            onPress={onClose}
          />
          <View style={styles.detailContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.name}>
              {getName(firstName, lastName)}
            </Text>
            <Text style={styles.age}>
              {gender} - {String(age ?? '')}
            </Text>
            <Text style={styles.age}>{location?.country}</Text>
            <Text style={styles.street}>
              {location?.street} - {location?.city} - {location?.state}
            </Text>
            <Text style={styles.street}>{email}</Text>
            <Text style={styles.street}>{phone}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'white' },
  image: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  linearView: {
    height: '20%',
    justifyContent: 'flex-end',
  },
  detailContainer: {
    width: '100%',
    padding: 16,
  },
  name: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    flex: 1,
  },
  age: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  street: {
    fontSize: 18,
    color: 'gray',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dropBtn: {
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    marginTop: -30,
    borderColor: 'red',
    marginRight: 10,
  },
});
