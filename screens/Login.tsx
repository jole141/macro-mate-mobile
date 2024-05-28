import * as React from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { RootStackScreenProps } from '../navigation/root-navigator';
import Button from '../components/reusable-components/Button';
import { useAuthData } from '../context/authContext';
import styled from 'styled-components';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme } from '../constants/Theme';
import { ERROR_MESSAGE } from '../constants/constants';
import { loginValidation } from '../utils/validation';

const Stain = styled(Image)`
  width: ${wp('100%')}px;
  position: absolute;
  bottom: 0;
  z-index: -1;
`;
export const LogoContainer = styled(View)`
  flex: 1;
  width: ${wp('100%')}px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const LogoImage = styled(Image)`
  width: ${wp('20%')}px;
  resize-mode: contain;
`;

export const Form = styled(KeyboardAvoidingView)`
  width: ${wp('100%')}px;
  z-index: 2;
  padding: 0 ${wp('5%')}px;
  flex: 1.3;
  background-color: ${theme.palette.secondary};
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

export const Error = styled(View)`
  padding: ${wp('3%')}px ${wp('6%')}px;
  margin: ${wp('2%')}px 0;
  width: 90%;
  align-self: center;
  background-color: ${theme.palette.error};
  border-radius: 5px;
  border-width: 1px;
  border-color: ${theme.palette.danger};
`;

export const ErrorMessage = styled(Text)`
  color: ${theme.palette.danger};
`;

export default function Login({ navigation }: RootStackScreenProps<'Login'>) {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { loginAppUser, isLoggedIn } = useAuthData();

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
    setErrorMessage(message);
    setShowError(true);
    setTimeout(function () {
      setShowError(false);
    }, 5000);
  };

  const login = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      setShowError(false);
      const validationResponse = loginValidation({
        username,
        password,
      });
      if (validationResponse === '') {
        await loginAppUser({
          username,
          password,
        });
      } else {
        displayError(validationResponse);
      }
    } catch {
      displayError(ERROR_MESSAGE);
    }
    setIsLoading(false);
  };

  return (
    <>
      <LogoContainer>
        <LogoImage source={require('../assets/images/logo.png')} />
        <Stain source={require('../assets/images/stain-top.png')} />
      </LogoContainer>
      <Form behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Title>Sign in</Title>
        {showError && (
          <Error>
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </Error>
        )}
        <Input onChange={setUsername} value={username} placeholder="Username" autoCapitalize="none" />
        <Input
          onChange={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <Button label={'Sign in'} type="primary" onPress={login} />
        <TouchableWithoutFeedback onPress={() => navigation.navigate('AccountType')}>
          <RegisterLink>
            Don’t have an account? <RegisterLinkBold>Sign up</RegisterLinkBold>
          </RegisterLink>
        </TouchableWithoutFeedback>
      </Form>
      {isLoading && <Loading />}
    </>
  );
}
