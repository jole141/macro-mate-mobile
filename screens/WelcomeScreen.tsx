import * as React from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { RootStackScreenProps } from '../navigation/root-navigator';
import Button from '../components/reusable-components/Button';
import { useAuthData } from '../context/authContext';
import styled from 'styled-components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme } from '../constants/Theme';
import { LogoContainer, LogoImage } from './Login';

const Container = styled(View)`
  height: ${hp('60%')}px;
`;

const Stain = styled(Image)`
  width: ${wp('100%')}px;
  position: absolute;
  bottom: 0;
  z-index: -1;
`;

const Info = styled(KeyboardAvoidingView)`
  padding: ${hp('1.5%')}px;
  width: ${wp('100%')}px;
  flex: 1;
  z-index: 2;
  background-color: ${theme.palette.secondary};
`;

const Title = styled(Text)`
  font-family: ${theme.fonts.interExtraBold};
  font-size: ${hp('2.95%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1.5%')}px;
`;

const Description = styled(Text)`
  font-family: ${theme.fonts.interLight};
  font-size: ${hp('1.8%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1.5%')}px;
  line-height: ${hp('3.4%')}px;
`;

const Bold = styled(Text)`
  font-family: ${theme.fonts.interBold};
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1.5%')}px;
`;

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'WelcomeScreen'>) {
  const { isLoggedIn } = useAuthData();

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

  return (
    <>
      <LogoContainer>
        <LogoImage source={require('../assets/images/logo.png')} />
        <Stain source={require('../assets/images/stain-top.png')} />
      </LogoContainer>
      <Container>
        <Info behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Title>Welcome to Meal Plan App</Title>
          <Description>
            In this application, you can choose between a <Bold>personal trainer's</Bold> account and a{' '}
            <Bold>client's</Bold> account. As a personal trainer, you will be able to create meal plans for your
            clients. As a client, you will be able to find a personal trainer, contact them, and have your meal plan
            created.
          </Description>
          <Button label={'Sign in'} type="primary" onPress={() => navigation.navigate('Login')} />
          <Button label={'Create an account'} type="secondary" onPress={() => navigation.navigate('AccountType')} />
        </Info>
      </Container>
    </>
  );
}
