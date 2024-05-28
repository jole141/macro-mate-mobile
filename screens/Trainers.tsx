import * as React from 'react';
import { RootStackScreenProps } from '../navigation/root-navigator';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getAllTrainers } from '../api/user/user';
import { useAuthData } from '../context/authContext';
import { UserInfoResponse } from '../api/types';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TrainerInfoText } from './Homepage';
import Loading from '../components/Loading';
import { sendRequest } from '../api/request/request';
import { PADDING_BOTTOM } from '../constants/constants';

const TrainersContainer = styled(ScrollView)`
  padding: ${hp('1.5%')}px ${wp('5%')}px;
`;

const UserInfo = styled(View)`
  background: ${theme.palette.secondary};
  margin: ${wp('1.5%')}px;
  border-radius: 10px;
  width: ${wp('90%')}px;
  padding: ${hp('1.5%')}px;
`;

const TrainerName = styled(Text)`
  font-family: ${theme.fonts.interExtraBold};
  font-size: ${hp('1.8%')}px;
  color: ${theme.palette.white};
  margin: ${hp('0.5%')}px 0;
`;

const Rating = styled(Text)`
  font-family: ${theme.fonts.interLight};
  font-size: ${hp('1.8%')}px;
  color: ${theme.palette.white};
  margin: ${hp('0.5%')}px 0;
`;

const TrainersList = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${wp('90%')}px;
`;

const SendRequest = styled(TouchableOpacity)`
  background-color: ${theme.palette.primary};
  height: ${hp('5%')}px;
  border-radius: 10px;
  margin: ${hp('1%')}px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.palette.white};
`;

const ButtonText = styled(Text)`
  color: ${theme.palette.white};
`;

export default function Trainers({}: RootStackScreenProps<'Trainers'>) {
  const { accessToken } = useAuthData();

  const [trainers, setTrainers] = React.useState<UserInfoResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsLoading(true);
    getAllTrainers()
      .then((res) => {
        setTrainers(res);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);

  const sendRequestToTrainer = async (id: number) => {
    setIsLoading(true);
    try {
      await sendRequest(id, accessToken);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <TrainersContainer
        contentContainerStyle={{
          paddingBottom: PADDING_BOTTOM,
        }}
      >
        <TrainersList>
          {trainers &&
            trainers.map((trainer) => (
              <UserInfo key={trainer.id}>
                <TrainerName>
                  {trainer.firstName} {trainer.lastName}
                </TrainerName>
                <Rating>Rating: {trainer.rating}/5</Rating>
                <Rating>Description:</Rating>
                <TrainerInfoText>{trainer.description}</TrainerInfoText>
                <SendRequest onPress={() => sendRequestToTrainer(trainer.id)}>
                  <ButtonText>Send request</ButtonText>
                </SendRequest>
              </UserInfo>
            ))}
        </TrainersList>
      </TrainersContainer>
      {isLoading && <Loading />}
    </>
  );
}
