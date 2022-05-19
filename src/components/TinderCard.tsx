import React from 'react';
import {
  Text,
  ImageBackground,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '../core/Icon';
import { User } from '../types/users';
import { getName } from '../utils';

interface TinderCardProps {
  data: User;
  onViewDetailPress: (user: User) => void;
}

export const TinderCard = (props: TinderCardProps) => {
  if (!props.data) {
    return null;
  }
  const { firstName, lastName, picture, id, age } = props.data;
  const _onPress = () => {
    props.onViewDetailPress?.(props.data);
  };
  return (
    <View key={`TinderCard_${id}`} style={styles.cardContainer}>
      <ImageBackground
        resizeMode="cover"
        source={{
          uri: picture,
        }}
        style={styles.image}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.6)']}
          style={styles.linearView}>
          <View style={styles.detailContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.name}>
              {getName(firstName, lastName)}
            </Text>
            <Text style={styles.age}>{String(age ?? '')}</Text>
            <TouchableOpacity onPress={_onPress} style={styles.inforIc}>
              <Icon name={'infor'} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.36,
    shadowRadius: 1,
    elevation: 11,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  detailContainer: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linearView: {
    height: '20%',
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
  },
  age: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  inforIc: {
    padding: 8,
    marginLeft: 10,
    alignSelf: 'center',
  },
});
