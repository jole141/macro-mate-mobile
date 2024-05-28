/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import NotFoundScreen from '../screens/NotFoundScreen';
import Login from '../screens/Login';
import { RootStackParamList } from './root-navigator';
import { theme } from '../constants/Theme';
import Homepage from '../screens/Homepage';
import Register from '../screens/Register';
import AccountType from '../screens/AccountType';
import Meals from '../screens/Meals';
import MealPlan from '../screens/MealPlan';
import Requests from '../screens/Requests';
import Trainers from '../screens/Trainers';
import Clients from '../screens/Clients';
import AddMeal from '../screens/AddMeal';
import WelcomeScreen from '../screens/WelcomeScreen';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: `${theme.palette.primary}`,
        },
        headerStyle: {
          backgroundColor: `${theme.palette.primary}`,
        },
        headerTintColor: `${theme.palette.white}`,
        headerShadowVisible: false,
      }}
      initialRouteName="WelcomeScreen"
    >
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="AccountType" component={AccountType} />
      <Stack.Screen name="Homepage" component={Homepage} />
      <Stack.Screen name="Trainers" component={Trainers} />
      <Stack.Screen name="Clients" component={Clients} />
      <Stack.Screen name="Requests" component={Requests} />
      <Stack.Screen name="MealPlan" component={MealPlan} />
      <Stack.Screen name="Meals" component={Meals} />
      <Stack.Screen name="AddMeal" component={AddMeal} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
