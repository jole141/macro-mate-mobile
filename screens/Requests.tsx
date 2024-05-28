import * as React from 'react';
import { RootStackScreenProps } from '../navigation/root-navigator';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuthData } from '../context/authContext';
import { UserInfoResponse } from '../api/types';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ClientInfoText, ClientInfoTextBold, ClientTextContainer } from './Homepage';
import Loading from '../components/Loading';
import { acceptRequest, declineRequest, getTrainersRequests } from '../api/request/request';
import { PADDING_BOTTOM } from '../constants/constants';

const RequestsContainer = styled(ScrollView)`
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

const ClientList = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${wp('90%')}px;
`;

const Buttons = styled(View)`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Accept = styled(TouchableOpacity)`
  background-color: ${theme.palette.success};
  height: ${hp('5%')}px;
  border-radius: 10px;
  margin: ${hp('1%')}px 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.palette.white};
  width: 40%;
`;

const Decline = styled(TouchableOpacity)`
  background-color: ${theme.palette.red};
  height: ${hp('5%')}px;
  border-radius: 10px;
  margin: ${hp('1%')}px 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.palette.white};
  width: 40%;
`;

const ButtonText = styled(Text)`
  font-family: ${theme.fonts.interBold};
  color: ${theme.palette.primary};
`;

export default function Requests({}: RootStackScreenProps<'Requests'>) {
  const { accessToken } = useAuthData();

  const [requests, setRequests] = React.useState<UserInfoResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [forceRerender, setForceRerender] = React.useState<boolean>(true);

  const rerender = () => {
    setForceRerender(!forceRerender);
  };

  React.useEffect(() => {
    setIsLoading(true);
    getTrainersRequests(accessToken)
      .then((res) => {
        setIsLoading(false);
        setRequests(res);
      })
      .catch((e) => console.log(e));
  }, [forceRerender]);

  const accept = async (id: number) => {
    setIsLoading(true);
    try {
      await acceptRequest(id, accessToken);
    } catch (e) {
      console.log(e);
    } finally {
      rerender();
      setIsLoading(false);
    }
  };

  const decline = async (id: number) => {
    setIsLoading(true);
    try {
      await declineRequest(id, accessToken);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      rerender();
    }
  };

  return (
    <>
      <RequestsContainer
        refreshControl={<RefreshControl refreshing={false} onRefresh={rerender} />}
        contentContainerStyle={{
          paddingBottom: PADDING_BOTTOM,
        }}
      >
        <ClientList>
          {requests &&
            requests.map((client) => (
              <UserInfo key={client.id}>
                <ClientsName>
                  {client.firstName} {client.lastName}
                </ClientsName>
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
                <Buttons>
                  <Accept onPress={() => accept(client.id)}>
                    <ButtonText>Accept</ButtonText>
                  </Accept>
                  <Decline onPress={() => decline(client.id)}>
                    <ButtonText>Decline</ButtonText>
                  </Decline>
                </Buttons>
              </UserInfo>
            ))}
        </ClientList>
      </RequestsContainer>
      {isLoading && <Loading />}
    </>
  );
}
