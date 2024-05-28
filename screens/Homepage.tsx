import * as React from 'react';
import { RootStackScreenProps } from '../navigation/root-navigator';
import Button from '../components/reusable-components/Button';
import { useAuthData } from '../context/authContext';
import { Image, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useUserData } from '../context/userContext';
import { getUserInfo, updateClientInfo, updateTrainerInfo } from '../api/user/user';
import styled from 'styled-components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme } from '../constants/Theme';
import Loading from '../components/Loading';
import {
  CLIENT_ROLE,
  PADDING_BOTTOM,
  PERSONAL_TRAINER_ROLE,
  QUIT_MEMBERSHIP_MESSAGE,
  RATING_ERROR_MESSAGE,
} from '../constants/constants';
import Input from '../components/Input';
import { quitMembership } from '../api/request/request';
import { isTrainerAlreadyRated, rateTrainer } from '../api/review/review';
import Modal from '../components/Modal';
import AlertModal from '../components/AlertModal';
import { Error, ErrorMessage } from './Login';

const HeaderImage = styled(Image)`
  width: ${wp('100%')}px;
  z-index: -1;
`;

const HomepageContainer = styled(ScrollView)`
  padding: ${hp('1.5%')}px;
`;

const UserInfo = styled(View)`
  background: ${theme.palette.secondary};
  margin: ${wp('1%')}px ${wp('2%')}px;
  padding: ${hp('2.5%')}px;
  border-radius: 10px;
`;

export const ClientTextContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const ClientInfoText = styled(Text)`
  font-family: ${theme.fonts.interLight};
  font-size: ${hp('1.9%')}px;
  color: ${theme.palette.white};
`;

export const TrainerInfoText = styled(Text)`
  font-family: ${theme.fonts.interLight};
  font-size: ${hp('1.8%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1.5%')}px;
  line-height: ${hp('3.4%')}px;
`;

export const ClientInfoTextBold = styled(Text)`
  font-family: ${theme.fonts.interBold};
  font-size: ${hp('1.9%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1.5%')}px;
`;

const User = styled(Text)`
  font-family: ${theme.fonts.interExtraBold};
  font-size: ${hp('2.95%')}px;
  color: ${theme.palette.white};
  margin: ${hp('2.5%')}px ${hp('3%')}px;
`;

const ModalText = styled(Text)`
  font-family: ${theme.fonts.interBold};
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
  margin: ${hp('1%')}px ${hp('2%')}px;
`;

const ActionButton = styled(TouchableOpacity)`
  background-color: ${theme.palette.primary};
  height: ${hp('5%')}px;
  border-radius: 10px;
  margin: ${hp('1%')}px 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.palette.white};
`;

const QuitButton = styled(TouchableOpacity)`
  background-color: ${theme.palette.red};
  height: ${hp('5%')}px;
  border-radius: 10px;
  margin: ${hp('1%')}px 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.palette.white};
`;

const ButtonText = styled(Text)`
  font-family: ${theme.fonts.interMedium};
  color: ${theme.palette.white};
`;

export default function Homepage({ navigation }: RootStackScreenProps<'Homepage'>) {
  const { logout, accessToken } = useAuthData();
  const { userInfo, setUserInfo } = useUserData();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [height, setHeight] = React.useState<string>('');
  const [weight, setWeight] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');

  const [isAlreadyRated, setIsAlreadyRated] = React.useState<boolean>(true);
  const [openRateModal, setOpenRateModal] = React.useState<boolean>(false);
  const [rating, setRating] = React.useState<string>('');
  const [openRemoveTrainerModal, setOpenRemoveTrainerModal] = React.useState<boolean>(false);
  const [forceRerender, setForceRerender] = React.useState<boolean>(true);
  const [openEditModal, setOpenEditModal] = React.useState<boolean>(false);
  const [showRateError, setShowRateError] = React.useState<boolean>(false);

  const rerender = () => {
    setForceRerender(!forceRerender);
  };

  React.useEffect(() => {
    setIsLoading(true);
    getUserInfo(accessToken)
      .then((res) => {
        setUserInfo(res);
        if (res && res.description) {
          setDescription(res.description);
        } else if (res && res.weight && res.height) {
          setWeight(res.weight.toString());
          setHeight(res.height.toString());
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
    if (userInfo.personalTrainer) {
      isTrainerAlreadyRated(userInfo.personalTrainer.id, accessToken)
        .then((res) => {
          if (res.rating === null) {
            setIsAlreadyRated(false);
          } else {
            setIsAlreadyRated(true);
          }
          setIsLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    }
  }, [forceRerender]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTitle: Platform.OS === 'ios' ? '' : () => null,
    });
  }, [navigation]);

  const logoutUser = async () => {
    await logout();
    navigation.replace('WelcomeScreen');
  };

  const updateUserInfo = async () => {
    if (userInfo.role.name === CLIENT_ROLE) {
      setIsLoading(true);
      try {
        await updateClientInfo(parseInt(height, 10), parseInt(weight, 10), accessToken);
      } catch (e) {
        console.log(e);
      } finally {
        rerender();
        setIsLoading(false);
        setOpenEditModal(false);
      }
    } else if (userInfo.role.name === PERSONAL_TRAINER_ROLE) {
      setIsLoading(true);
      try {
        await updateTrainerInfo(description, accessToken);
      } catch (e) {
        console.log(e);
      } finally {
        rerender();
        setIsLoading(false);
        setOpenEditModal(false);
      }
    }
  };

  const removeTrainer = async () => {
    setIsLoading(true);
    try {
      await quitMembership(userInfo.personalTrainer.id, accessToken);
    } catch (e) {
      console.log(e);
    } finally {
      rerender();
      setIsLoading(false);
      setOpenRemoveTrainerModal(false);
    }
  };

  const rate = async () => {
    setIsLoading(true);
    if (parseInt(rating, 10) > 5) {
      setShowRateError(true);
      setTimeout(function () {
        setShowRateError(false);
      }, 5000);
      setIsLoading(false);
      return;
    }
    try {
      await rateTrainer(parseInt(rating, 10), userInfo.personalTrainer.id, accessToken);
    } catch (e) {
      console.log(e);
    } finally {
      rerender();
      setIsLoading(false);
      setRating('');
      setOpenRateModal(false);
    }
  };

  const accountTypeData = () => {
    if (userInfo.role.name === CLIENT_ROLE) {
      return (
        <>
          <ModalText>Edit user info</ModalText>
          <Input onChange={setWeight} value={weight} placeholder="Weight (e.g. 85)" keyboardType="numeric" />
          <Input onChange={setHeight} value={height} placeholder="Height (e.g. 180)" keyboardType="numeric" />
          <Button label="Update" type="primary" onPress={updateUserInfo} />
          <Button label="Close" type="ternary" onPress={() => setOpenEditModal(false)} />
        </>
      );
    } else if (userInfo.role.name === PERSONAL_TRAINER_ROLE) {
      return (
        <>
          <ModalText>Edit user info</ModalText>
          <Input
            onChange={setDescription}
            value={description}
            numberOfLines={3}
            multiline={true}
            placeholder="Type something about your experience..."
          />
          <Button label="Update" type="primaryTrainer" onPress={updateUserInfo} />
          <Button label="Close" type="ternary" onPress={() => setOpenEditModal(false)} />
        </>
      );
    }
  };

  return (
    <>
      {openRemoveTrainerModal && (
        <AlertModal
          message={QUIT_MEMBERSHIP_MESSAGE}
          confirm={removeTrainer}
          decline={() => setOpenRemoveTrainerModal(false)}
        />
      )}
      {openRateModal && (
        <Modal>
          <ModalText>Rate trainer</ModalText>
          {showRateError && (
            <Error>
              <ErrorMessage>{RATING_ERROR_MESSAGE}</ErrorMessage>
            </Error>
          )}
          <Input onChange={setRating} value={rating} placeholder="Rating (1-5)" keyboardType="numeric" />
          <Button label="Rate" type="primary" onPress={rate} />
          <Button label="Close" type="ternary" onPress={() => setOpenRateModal(false)} />
        </Modal>
      )}
      {openEditModal && <Modal>{accountTypeData()}</Modal>}
      {userInfo && userInfo.role?.name == CLIENT_ROLE && (
        <HeaderImage source={require('../assets/images/client-background.png')} />
      )}
      {userInfo && userInfo.role?.name == PERSONAL_TRAINER_ROLE && (
        <HeaderImage source={require('../assets/images/trainer-background.png')} />
      )}
      {userInfo && (
        <>
          <User>
            {userInfo?.firstName} {userInfo?.lastName}
          </User>
          <HomepageContainer
            refreshControl={<RefreshControl refreshing={false} onRefresh={rerender} />}
            contentContainerStyle={{
              paddingBottom: PADDING_BOTTOM,
            }}
          >
            {userInfo.role?.name == CLIENT_ROLE && (
              <UserInfo>
                <ClientTextContainer>
                  <ClientInfoTextBold>Height:</ClientInfoTextBold>
                  <ClientInfoText>{userInfo.height}cm</ClientInfoText>
                </ClientTextContainer>
                <ClientTextContainer>
                  <ClientInfoTextBold>Weight:</ClientInfoTextBold>
                  <ClientInfoText>{userInfo.weight}kg</ClientInfoText>
                </ClientTextContainer>
                <ClientTextContainer>
                  <ClientInfoTextBold>BMI:</ClientInfoTextBold>
                  <ClientInfoText>{userInfo.bmi.toFixed(2)}</ClientInfoText>
                </ClientTextContainer>
                <ActionButton onPress={() => setOpenEditModal(true)}>
                  <ButtonText>Edit data</ButtonText>
                </ActionButton>
              </UserInfo>
            )}
            {userInfo.role?.name == PERSONAL_TRAINER_ROLE && userInfo.description != null && (
              <UserInfo>
                <TrainerInfoText>{userInfo.description}</TrainerInfoText>
                <ActionButton onPress={() => setOpenEditModal(true)}>
                  <ButtonText>Edit data</ButtonText>
                </ActionButton>
              </UserInfo>
            )}
            {userInfo.personalTrainer && (
              <UserInfo>
                <ClientInfoTextBold>
                  <ClientInfoText>Personal trainer: </ClientInfoText>
                  {userInfo?.personalTrainer.firstName} {userInfo?.personalTrainer.lastName}
                </ClientInfoTextBold>
                {!isAlreadyRated && (
                  <ActionButton onPress={() => setOpenRateModal(true)}>
                    <ButtonText>Rate Trainer</ButtonText>
                  </ActionButton>
                )}
                <QuitButton onPress={() => setOpenRemoveTrainerModal(true)}>
                  <ButtonText>Quit membership</ButtonText>
                </QuitButton>
              </UserInfo>
            )}
            {userInfo.role?.name == CLIENT_ROLE && userInfo.personalTrainer && (
              <>
                <Button
                  label="Meal plan"
                  type="secondary"
                  onPress={() => navigation.navigate('MealPlan', { clientId: userInfo.id })}
                />
              </>
            )}
            {userInfo.role?.name == CLIENT_ROLE && !userInfo.personalTrainer && (
              <>
                <Button label="Search for trainer" type="secondary" onPress={() => navigation.navigate('Trainers')} />
              </>
            )}
            {userInfo.role?.name == PERSONAL_TRAINER_ROLE && (
              <>
                <Button label="Clients" type="ternary" onPress={() => navigation.navigate('Clients')} />
                <Button label="Requests" type="ternary" onPress={() => navigation.navigate('Requests')} />
              </>
            )}
            {userInfo.role?.name == CLIENT_ROLE ? (
              <Button label="Logout" type="primary" onPress={logoutUser} />
            ) : (
              <Button label="Logout" type="primaryTrainer" onPress={logoutUser} />
            )}
          </HomepageContainer>
        </>
      )}
      {isLoading && <Loading />}
    </>
  );
}
