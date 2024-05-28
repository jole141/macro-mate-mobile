import * as React from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RootStackScreenProps } from '../navigation/root-navigator';
import Button from '../components/reusable-components/Button';
import { useAuthData } from '../context/authContext';
import styled from 'styled-components';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme } from '../constants/Theme';
import { CLIENT_ROLE, ERROR_MESSAGE, PERSONAL_TRAINER_ROLE } from '../constants/constants';
import { registerValidation } from '../utils/validation';
import { Error, ErrorMessage } from './Login';

const Stain = styled(Image)`
  width: ${wp('100%')}px;
  position: absolute;
  bottom: 0;
  z-index: -1;
`;
const LogoContainer = styled(View)`
  flex: 1;
  width: ${wp('100%')}px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const LogoImage = styled(Image)`
  width: ${wp('16%')}px;
  resize-mode: contain;
`;

const Form = styled(KeyboardAvoidingView)`
  width: ${wp('100%')}px;
  z-index: 2;
  flex: 2.6;
  background-color: ${theme.palette.secondary};
`;

export const Scroll = styled(ScrollView)`
  width: 100%;
  padding: 0 ${wp('5%')}px;
`;

const Title = styled(Text)`
  font-family: ${theme.fonts.interExtraBold};
  font-size: ${hp('2.95%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1.5%')}px;
`;

const RegisterLink = styled(Text)`
  font-family: ${theme.fonts.interLight};
  font-size: ${hp('1.9%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1.5%')}px;
  align-self: center;
`;

const RegisterLinkBold = styled(Text)`
  font-family: ${theme.fonts.interBold};
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1.5%')}px;
`;

export default function Register({ navigation, route }: RootStackScreenProps<'Register'>) {
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { registerAppUser, isLoggedIn } = useAuthData();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTitle: Platform.OS === 'ios' ? '' : () => null,
    });
  }, [navigation]);

  React.useEffect(() => {
    if (isLoggedIn) {
      navigation.replace('Homepage');
    }
  }, [isLoggedIn]);

  const displayError = (message: string) => {
    setIsLoading(false);
    setErrorMessage(message);
    setShowError(true);
    setTimeout(function () {
      setShowError(false);
    }, 5000);
  };

  const register = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      if (route.params.accountType === PERSONAL_TRAINER_ROLE) {
        const validationResponse = registerValidation(
          {
            firstName,
            lastName,
            email,
            username,
            password,
            description: route.params.description,
          },
          route.params.accountType,
        );
        if (validationResponse === '') {
          await registerAppUser(
            {
              firstName,
              lastName,
              email,
              username,
              password,
              description: route.params.description,
            },
            route.params.accountType,
          );
          navigation.navigate('Login');
        } else {
          displayError(validationResponse);
        }
      } else if (route.params.accountType === CLIENT_ROLE) {
        const validationResponse = registerValidation(
          {
            firstName,
            lastName,
            email,
            username,
            password,
            height: parseInt(route.params.height, 10),
            weight: parseInt(route.params.weight, 10),
          },
          route.params.accountType,
        );
        if (validationResponse === '') {
          await registerAppUser(
            {
              firstName,
              lastName,
              email,
              username,
              password,
              height: parseInt(route.params.height, 10),
              weight: parseInt(route.params.weight, 10),
            },
            route.params.accountType,
          );
          navigation.navigate('Login');
        } else {
          displayError(validationResponse);
        }
      }
    } catch {
      displayError(ERROR_MESSAGE);
    }
  };

  return (
    <>
      <LogoContainer>
        <LogoImage source={require('../assets/images/logo.png')} />
        <Stain source={require('../assets/images/stain-top.png')} />
      </LogoContainer>

      <Form behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Scroll>
          {showError && (
            <Error>
              <ErrorMessage>{errorMessage}</ErrorMessage>
            </Error>
          )}
          <Title>Create an account</Title>
          <Input onChange={setFirstName} value={firstName} placeholder="Firstname" />
          <Input onChange={setLastName} value={lastName} placeholder="Lastname" />
          <Input onChange={setEmail} value={email} placeholder="Email" autoCapitalize="none" />
          <Input onChange={setUsername} value={username} placeholder="Username" autoCapitalize="none" />
          <Input
            onChange={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            autoCapitalize="none"
          />
          <Button label={'Sign up'} type="primary" onPress={register} />
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
            <RegisterLink>
              Already have an account? <RegisterLinkBold>Sign in</RegisterLinkBold>
            </RegisterLink>
          </TouchableWithoutFeedback>
        </Scroll>
      </Form>
      {isLoading && <Loading />}
    </>
  );
}
