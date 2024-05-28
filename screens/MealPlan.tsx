import * as React from 'react';
import { RootStackScreenProps } from '../navigation/root-navigator';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useUserData } from '../context/userContext';
import { CLIENT_ROLE, PADDING_BOTTOM, PERSONAL_TRAINER_ROLE } from '../constants/constants';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getClientMeals, getTrainerClientMeals } from '../api/meal/meal';
import { MealResponse } from '../api/types';
import Loading from '../components/Loading';
import { useAuthData } from '../context/authContext';
import { NotFoundContainer, NotFoundText } from './AddMeal';
import { getDateName, getDateUSFormat, getMondayDate, getTime } from '../utils/date';

const White = styled(Text)`
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
`;

const WhiteBold = styled(Text)`
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
  font-family: ${theme.fonts.interBold};
`;

export const Container = styled(ScrollView)`
  padding: ${hp('1.5%')}px ${wp('5%')}px;
`;

export const InfoContainer = styled(TouchableOpacity)`
  background: ${theme.palette.secondary};
  margin: ${wp('1.5%')}px;
  border-radius: 10px;
  padding: ${hp('1.5%')}px;
`;

const DayName = styled(View)``;

const NameText = styled(Text)`
  font-size: ${hp('2.22%')}px;
  font-family: ${theme.fonts.interBold};
  margin: ${hp('1.5%')}px;
  color: ${theme.palette.white};
`;

const MealInfo = styled(View)`
  padding: ${hp('1.5%')}px;
  margin: 0 ${hp('1.5%')}px;
   display:flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${theme.palette.primary};
`;

export default function MealPlan({ navigation, route }: RootStackScreenProps<'MealPlan'>) {
  const { clientId } = route.params;
  const { userInfo } = useUserData();
  const { accessToken } = useAuthData();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [meals, setMeals] = React.useState<MealResponse[][]>();
  const [forceRerender, setForceRerender] = React.useState<boolean>(true);

  const rerender = () => {
    setForceRerender(!forceRerender);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  }, [navigation]);

  React.useEffect(() => {
    getMealPlan();
  }, [forceRerender]);

  const getMealPlan = () => {
    if (userInfo.role.name === CLIENT_ROLE) {
      setIsLoading(true);
      getClientMeals(getMondayDate(), accessToken)
        .then((res) => {
          setMeals(res);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } else if (userInfo.role.name === PERSONAL_TRAINER_ROLE) {
      setIsLoading(true);
      getTrainerClientMeals(getMondayDate(), clientId, accessToken)
        .then((res) => {
          setMeals(res);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <Container
        refreshControl={<RefreshControl refreshing={false} onRefresh={rerender} />}
        contentContainerStyle={{
          paddingBottom: PADDING_BOTTOM,
        }}
      >
        {meals &&
          meals.map((mealsPerDay) => (
            <InfoContainer
              key={meals.indexOf(mealsPerDay)}
              onPress={() =>
                navigation.navigate('Meals', {
                  meals: mealsPerDay,
                  clientId,
                  date: getDateUSFormat(meals.indexOf(mealsPerDay)),
                })
              }
            >
              <DayName>
                <NameText>{getDateName(meals.indexOf(mealsPerDay))}</NameText>
              </DayName>
              {mealsPerDay && mealsPerDay.length !== 0 ? (
                mealsPerDay.map((mealInDay) => (
                  <MealInfo key={mealInDay.id}>
                    <White>{mealInDay.name}</White>
                    <WhiteBold>{getTime(mealInDay.mealDateTime)}</WhiteBold>
                  </MealInfo>
                ))
              ) : (
                <NotFoundContainer>
                  <NotFoundText>Not available</NotFoundText>
                </NotFoundContainer>
              )}
            </InfoContainer>
          ))}
      </Container>
    </>
  );
}
