import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import EmailField from '../../components/fields/EmailField';
import PasswordField from '../../components/fields/Login/PasswordField';

import NewSignUp from '../../components/footers/auth/NewSignUp';
import AlertModal from '../../components/modals/AlertModal';

import LoginWithFacebook from '../../components/loginMethods/LoginWithFacebook';
import SecondaryButton from '../../components/buttons/SecondaryButton';

import {
  logInEmail,
  updateErrorMessage,
} from '../../redux/features/firebase/firebaseSlice';
import { CHANGE_LOADING } from '../../redux/features/loadingSlice';
import { useDispatch, useSelector } from 'react-redux';

const LoginEmailScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

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
      dispatch(logInEmail({ email, password })).then(() => {
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
      <AlertModal
        title={'Error'}
        message={errorMessage}
        modalVisible={isModalVisible}
        requestClose={handleIsModalVisible}
      />
      <Image
        source={require('../../../assets/logo/logo.png')}
        style={styles.imageContainer}
      />
      <View style={{ height: 25 }} />
      <EmailField
        onInputChange={(mail) => handleEmailInput(mail)}
        value={email}
        validity={isValid}
      />
      {isValid ? null : (
        <Text
          style={{
            color: 'red',
            alignSelf: 'flex-start',
            fontSize: 12,
            marginTop: -7,
            marginBottom: 10,
          }}
        >
          Por favor ingrese un correo electrónico válido.
        </Text>
      )}
      <PasswordField
        onInputChange={(updatedPass) => handlePassword(updatedPass)}
        placeHolderText={'Contraseña'}
        value={password}
      />
      <PrimaryButton
        text={'Iniciar Sesión'}
        handlePress={() => {
          email && password.length >= 6 ? handlePress(email) : null;
        }}
        allowed={email && password.length >= 6 ? true : false}
        useIndicator={isLoading}
      />

      <NewSignUp />
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
    height: '20%',
    width: '55%',
  },
  ORContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  lineContainer: {
    borderTopColor: '#806e6c',
    borderTopWidth: 1,
    flex: 1,
  },
});

export default LoginEmailScreen;
