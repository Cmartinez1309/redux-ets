import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import {
  signUpEmail,
  updateErrorMessage,
} from '../../redux/features/firebase/firebaseSlice';
import { CHANGE_LOADING } from '../../redux/features/loadingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUser } from '../../redux/features/firebase/firebaseSlice';

import AlreadyLogIn from '../../components/footers/auth/AlreadyLogIn';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import EmailField from '../../components/fields/EmailField';
import PasswordField from '../../components/fields/Login/PasswordField';
import AlertModal from '../../components/modals/AlertModal';

const HaciendoScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    console.log('cerrando sesión...');
    dispatch(CHANGE_LOADING(true));
    dispatch(signOutUser()).then(() => {
      setMessage('Se cerró la sesión!');
      dispatch(CHANGE_LOADING(false));
    });
  };

  const isLoading = useSelector((state) => state.loading.value);
  const errorMessage = useSelector(
    (state) => state.firebaseStore.error.errorBody
  );

  const handleEmailInput = (mail) => {
    setIsValid(true);
    setEmail(mail);
  };

  const handlePassword = (pass) => {
    setPassword(pass);
  };

  const handleIsModalVisible = () => {
    if (isModalVisible) {
      setIsModalVisible(false);
      dispatch(updateErrorMessage(''));
    } else {
      setIsModalVisible(true);
    }
  };

  const handlePress = (mail) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(mail) === true) {
      setIsValid(true);
      setEmail(mail);
      dispatch(CHANGE_LOADING(true));
      dispatch(updateErrorMessage(''));
      dispatch(signUpEmail({ email, password })).then(() => {
        dispatch(CHANGE_LOADING(false));
      });
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setIsModalVisible(true);
    }
  }, [errorMessage]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' hidden={false} translucent={true} />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'grey',
            borderWidth: 1,
          }}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={{ color: 'white' }}>Lista</Text>
        </TouchableOpacity>
        <View
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'white',
            borderWidth: 2,
          }}
        >
          <Text style={{ color: 'white' }}>Haciendo</Text>
        </View>
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
export default HaciendoScreen;
