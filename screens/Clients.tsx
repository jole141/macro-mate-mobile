import * as React from 'react';
import { RootStackScreenProps } from '../navigation/root-navigator';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getTrainersClients } from '../api/user/user';
import { useAuthData } from '../context/authContext';
import { UserInfoResponse } from '../api/types';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ClientInfoText, ClientInfoTextBold, ClientTextContainer } from './Homepage';
import Loading from '../components/Loading';
import { quitMembership } from '../api/request/request';
import AlertModal from '../components/AlertModal';
import { PADDING_BOTTOM, QUIT_MEMBERSHIP_MESSAGE } from '../constants/constants';

const ClientsContainer = styled(ScrollView)`
  padding: ${hp('1.5%')}px ${wp('5%')}px;
`;

const UserInfo = styled(View)`
  background: ${theme.palette.secondary};
  margin: ${wp('1.5%')}px;
  border-radius: 10px;
  width: ${wp('90%')}px;
  padding: ${hp('1.5%')}px;
`;

const ClientsName = styled(Text)`
  font-family: ${theme.fonts.interExtraBold};
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
  margin: ${hp('0.5%')}px 0;
`;

const ClientsEmail = styled(Text)`
  font-family: ${theme.fonts.interLight};
  font-size: ${hp('1.8%')}px;
  color: ${theme.palette.white};
  margin: ${hp('0.5%')}px 0;
`;

const ClientList = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${wp('90%')}px;
`;

const MealPlan = styled(TouchableOpacity)`
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

const QuitMembership = styled(TouchableOpacity)`
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

export default function Clients({ navigation }: RootStackScreenProps<'Clients'>) {
  const { accessToken } = useAuthData();

  const [clients, setClients] = React.useState<UserInfoResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [openAlertModal, setOpenAlertModal] = React.useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = React.useState<number>();

  const [forceRerender, setForceRerender] = React.useState<boolean>(true);

  const rerender = () => {
    setForceRerender(!forceRerender);
  };

  React.useEffect(() => {
    setIsLoading(true);
    getTrainersClients(accessToken)
      .then((res) => {
        setIsLoading(false);
        setClients(res);
      })
      .catch((e) => console.log(e));
  }, [forceRerender]);

  const closeAlertModal = () => {
    setOpenAlertModal(false);
    setSelectedClientId(undefined);
  };

  const removeClient = async () => {
    setIsLoading(true);
    try {
      await quitMembership(selectedClientId!, accessToken);
    } catch (e) {
      console.log(e);
    } finally {
      rerender();
      setOpenAlertModal(false);
      setIsLoading(false);
      setSelectedClientId(undefined);
    }
  };

  return (
    <>
      {openAlertModal && (
        <AlertModal message={QUIT_MEMBERSHIP_MESSAGE} confirm={removeClient} decline={closeAlertModal} />
      )}
      <ClientsContainer
        refreshControl={<RefreshControl refreshing={false} onRefresh={rerender} />}
        contentContainerStyle={{
          paddingBottom: PADDING_BOTTOM,
        }}
      >
        <ClientList>
          {clients &&
            clients.map((client) => (
              <UserInfo key={client.id}>
                <ClientsName>
                  {client.firstName} {client.lastName}
                </ClientsName>
                <ClientsEmail>{client.email}</ClientsEmail>
                <ClientTextContainer>
                  <ClientInfoTextBold>Height:</ClientInfoTextBold>
                  <ClientInfoText>{client.height}cm</ClientInfoText>
                </ClientTextContainer>
                <ClientTextContainer>
                  <ClientInfoTextBold>Weight:</ClientInfoTextBold>
                  <ClientInfoText>{client.weight}kg</ClientInfoText>
                </ClientTextContainer>
                <ClientTextContainer>
                  <ClientInfoTextBold>BMI:</ClientInfoTextBold>
                  <ClientInfoText>{client.bmi.toFixed(2)}</ClientInfoText>
                </ClientTextContainer>
                <MealPlan onPress={() => navigation.navigate('MealPlan', { clientId: client.id })}>
                  <ButtonText>Meal Plan</ButtonText>
                </MealPlan>
                <QuitMembership
                  onPress={() => {
                    setOpenAlertModal(true);
                    setSelectedClientId(client.id);
                  }}
                >
                  <ButtonText>Remove client</ButtonText>
                </QuitMembership>
              </UserInfo>
            ))}
        </ClientList>
      </ClientsContainer>
      {isLoading && <Loading />}
    </>
  );
}
