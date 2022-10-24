import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUser } from '../../redux/features/firebase/firebaseSlice';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { CHANGE_LOADING } from '../../redux/features/loadingSlice';
import AlertModal from '../../components/modals/AlertModal';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.value);
  const navigation = useNavigation();

  const handleSignOut = () => {
    console.log('cerrando sesión...');
    dispatch(CHANGE_LOADING(true));
    dispatch(signOutUser()).then(() => {
      setMessage('Se cerró la sesión!');
      dispatch(CHANGE_LOADING(false));
    });
  };

  const handleRequestClose = () => {
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' hidden={false} translucent={true} />
      <View style={styles.tabContainer}>
        <View
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'white',
            borderWidth: 2,
          }}
        >
          <Text style={{ color: 'white' }}>Lista</Text>
        </View>
        <TouchableOpacity
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'grey',
            borderWidth: 1,
          }}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Haciendo')}
        >
          <Text style={{ color: 'white' }}>Haciendo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'grey',
            borderWidth: 1,
          }}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Hecho')}
        >
          <Text style={{ color: 'white' }}>Hecho</Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton
        text={'Log Out'}
        allowed={true}
        useIndicator={isLoading}
        handlePress={handleSignOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  imageContainer: {
    height: '100%',
    width: 'auto',
    aspectRatio: 1079 / 1080,
    borderRadius: 10,
  },
  textStyle: {
    color: 'white',
    fontSize: 25,
    marginVertical: 20,
  },
  instaContainer: {
    height: Dimensions.get('window').width - 40,
    width: Dimensions.get('window').width - 40,
    marginVertical: 30,
  },
  ORContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  lineContainer: {
    borderBottomColor: '#806e6c',
    borderBottomWidth: 1,
    flex: 1,
  },
  tabContainer: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  subTabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 50,
  },
});

export default HomeScreen;
