import { StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/AppStack/HomeScreen';
import HaciendoScreen from './src/screens/AppStack/HaciendoScreen';
import HechoScreen from './src/screens/AppStack/HechoScreen';
import WelcomeScreen from './src/screens/AuthStack/WelcomeScreen';
import LoginEmailScreen from './src/screens/AuthStack/LoginEmailScreen';
import SignupScreenEmail from './src/screens/AuthStack/SignupScreenEmail';

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{ headerShown: false, animation: 'none' }}
      />
      <Stack.Screen
        name='Haciendo'
        component={HaciendoScreen}
        options={{ headerShown: false, animation: 'none' }}
      />
      <Stack.Screen
        name='Hecho'
        component={HechoScreen}
        options={{ headerShown: false, animation: 'none' }}
      />
    </Stack.Navigator>
  );
};

export const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Welcome'
        component={WelcomeScreen}
        options={{ headerShown: false, animation: 'none' }}
      />

      <Stack.Screen
        name='LoginEmail'
        component={LoginEmailScreen}
        options={{ headerShown: false, animation: 'none' }}
      />

      <Stack.Screen
        name='SignupEmail'
        component={SignupScreenEmail}
        options={{ headerShown: false, animation: 'none' }}
      />
    </Stack.Navigator>
  );
};
