import * as React from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RootStackScreenProps } from '../navigation/root-navigator';
import Button from '../components/reusable-components/Button';
import { useAuthData } from '../context/authContext';
import styled from 'styled-components';
import Input from '../components/Input';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme } from '../constants/Theme';
import { CLIENT_ROLE, PERSONAL_TRAINER_ROLE } from '../constants/constants';
import { Scroll } from './Register';

interface ISelectType {
  selected: boolean;
}

const Stain = styled(Image)`
  width: ${wp('100%')}px;
  position: absolute;
  bottom: 0;
  z-index: -1;
`;
const AccountTypeContainer = styled(View)`
  flex: 1.3;
  width: ${wp('100%')}px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Info = styled(KeyboardAvoidingView)`
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

export const SelectType = styled(TouchableOpacity)<ISelectType>`
  width: ${wp('70%')}px;
  width: ${wp('70%')}px;
  height: ${hp('6%')}px;
  border-radius: 10px;
  margin: ${hp('1.5%')}px;
  background-color: ${(p) => (p.selected ? theme.palette.success : theme.palette.primary)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: ${(p) => (p.selected ? 0 : 1)}px;
  border-color: ${theme.palette.white};
`;

export const SelectTypeText = styled(Text)`
  font-family: ${theme.fonts.interSemiBold};
  font-size: ${hp('2.1%')}px;
  font-weight: bold;
  color: ${theme.palette.white};
`;

export default function AccountType({ navigation }: RootStackScreenProps<'AccountType'>) {
  const [height, setHeight] = React.useState<string>('');
  const [weight, setWeight] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [selectedAccountType, setSelectedAccountType] = React.useState<string>('');
  const [isTypeSelected, setIsTypeSelected] = React.useState<boolean>(false);

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

  const selectType = (role: string) => {
    Keyboard.dismiss();
    if (role === selectedAccountType) {
      setSelectedAccountType('');
      setIsTypeSelected(false);
    } else {
      setSelectedAccountType(role);
      setIsTypeSelected(true);
    }
    setDescription('');
    setHeight('');
    setWeight('');
  };

  const getFormForSelectedType = () => {
    if (selectedAccountType === CLIENT_ROLE) {
      return (
        <>
          <Input onChange={setWeight} value={weight} placeholder="Weight (e.g. 85)" keyboardType="numeric" />
          <Input onChange={setHeight} value={height} placeholder="Height (e.g. 180)" keyboardType="numeric" />
        </>
      );
    } else if (selectedAccountType === PERSONAL_TRAINER_ROLE) {
      return (
        <>
          <Input
            onChange={setDescription}
            value={description}
            numberOfLines={3}
            multiline={true}
            placeholder="Type something about your experience..."
            onSubmitEditing={() =>
              navigation.navigate('Register', {
                accountType: selectedAccountType,
                description: description,
                weight: weight,
                height: height,
              })
            }
          />
        </>
      );
    }
  };

  return (
    <>
      <AccountTypeContainer>
        <SelectType
          selected={selectedAccountType === PERSONAL_TRAINER_ROLE}
          onPress={() => selectType(PERSONAL_TRAINER_ROLE)}
        >
          <SelectTypeText>Personal trainer</SelectTypeText>
        </SelectType>
        <SelectType selected={selectedAccountType === CLIENT_ROLE} onPress={() => selectType(CLIENT_ROLE)}>
          <SelectTypeText>Client</SelectTypeText>
        </SelectType>
        <Stain source={require('../assets/images/stain-top.png')} />
      </AccountTypeContainer>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Info behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Scroll>
            {!isTypeSelected ? (
              <>
                <Title>Select account type</Title>
                <Description>
                  You can choose between a <Bold>personal trainer’s</Bold> account and <Bold>client’s</Bold> account. As
                  personal trainer you will be able to create meal plans for your clients. As a client you will be able
                  to find personal trainer contact him and have your meal plan created.
                </Description>
              </>
            ) : (
              <>
                <Title>Enter your info</Title>
                {getFormForSelectedType()}
                <Button
                  label={'Next'}
                  type="primary"
                  onPress={() =>
                    navigation.navigate('Register', {
                      accountType: selectedAccountType,
                      description: description,
                      weight: weight,
                      height: height,
                    })
                  }
                />
              </>
            )}
          </Scroll>
        </Info>
      </TouchableWithoutFeedback>
    </>
  );
}
