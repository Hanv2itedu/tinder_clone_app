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

interface TinderCardProps {
  data: User;
  onViewDetailPress: Function;
}

const getName = (firstName: string, lastName: string): string => {
  return firstName + ' ' + lastName;
};

export const TinderCard = (props: TinderCardProps) => {
  const { firstName, lastName, picture, id, age } = props.data;
  return (
    <View key={`TinderCard_${id}`} style={styles.cardContainer}>
      <ImageBackground
        resizeMode="contain"
        source={{
          uri: picture,
        }}
        style={styles.image}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.6)']}
          style={styles.linearView}>
          <View style={styles.detailContainer}>
            <Text style={styles.name}>{getName(firstName, lastName)}</Text>
            <Text style={styles.age}>{String(age ?? '')}</Text>
            <TouchableOpacity style={styles.inforIc}>
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
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
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
    padding: 16,
    flexDirection: 'row',
  },
  linearView: {
    height: '20%',
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  age: {
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
  },
  inforIc: {
    padding: 8,
    marginLeft: 10,
    alignSelf: 'center',
  },
});
