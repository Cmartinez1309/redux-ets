import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' hidden={false} translucent={true} />
      <Image
        source={require('../../../assets/logo/logo.png')}
        style={styles.imageContainer}
      />
      <View style={{ height: 70 }} />
      <PrimaryButton
        text={'Registrar'}
        handlePress={() => navigation.navigate('SignupEmail')}
        allowed={true}
      />
      <SecondaryButton handlePress={() => navigation.navigate('LoginEmail')} />
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
});

export default WelcomeScreen;
