import * as React from 'react';
import { RootStackScreenProps } from '../navigation/root-navigator';
import { RefreshControl, Text, View } from 'react-native';
import { CLIENT_ROLE, PADDING_BOTTOM, PERSONAL_TRAINER_ROLE, REMOVE_MEAL_MESSAGE } from '../constants/constants';
import Button from '../components/reusable-components/Button';
import { useUserData } from '../context/userContext';
import { Container } from './MealPlan';
import styled from 'styled-components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme } from '../constants/Theme';
import { ChosenIngredientContainer } from './AddMeal';
import { getTime } from '../utils/date';
import AlertModal from '../components/AlertModal';
import { deleteMeal, getClientMealsDay, getTrainerClientMealsDay } from '../api/meal/meal';
import Loading from '../components/Loading';
import { useAuthData } from '../context/authContext';
import { MealResponse } from '../api/types';

const White = styled(Text)`
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
`;

const WhiteBold = styled(Text)`
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
  font-family: ${theme.fonts.interBold};
`;

const InfoContainer = styled(View)`
  background: ${theme.palette.secondary};
  margin: ${wp('1.5%')}px;
  border-radius: 10px;
  padding: ${hp('1.5%')}px;
`;

const TitleContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-color: ${theme.palette.red};
  border-bottom-width: 1px;
`;

const Title = styled(Text)`
  font-size: ${hp('2.5%')}px;
  margin: ${hp('2%')}px;
  color: ${theme.palette.white};
  font-family: ${theme.fonts.interBold};
`;

const MealTime = styled(Text)`
  font-size: ${hp('2%')}px;
  margin: ${hp('2%')}px;
  color: ${theme.palette.white};
  font-family: ${theme.fonts.interLight};
`;

const ItemValue = styled(View)`
  margin: ${hp('1.5%')}px;
`;

export default function Meals({ navigation, route }: RootStackScreenProps<'Meals'>) {
  const { clientId, date } = route.params;

  const { accessToken } = useAuthData();
  const { userInfo } = useUserData();

  const [openAlertModal, setOpenAlertModal] = React.useState<boolean>(false);
  const [selectedMealId, setSelectedMealId] = React.useState<number>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [forceRerender, setForceRerender] = React.useState<boolean>(true);

  const rerender = () => {
    setForceRerender(!forceRerender);
  };

  const [meals, setMeals] = React.useState<MealResponse[]>();

  React.useEffect(() => {
    getMeals();
  }, [forceRerender, navigation]);

  const getMeals = () => {
    if (userInfo.role.name === CLIENT_ROLE) {
      setIsLoading(true);
      getClientMealsDay(date, accessToken)
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
      getTrainerClientMealsDay(date, clientId, accessToken)
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

  const removeMeal = async () => {
    setIsLoading(true);
    try {
      if (selectedMealId) await deleteMeal(selectedMealId, accessToken);
    } catch (e) {
      console.log(e);
    } finally {
      rerender();
      setIsLoading(false);
      setOpenAlertModal(false);
      setSelectedMealId(undefined);
    }
  };

  const closeAlertModal = async () => {
    setSelectedMealId(undefined);
    setOpenAlertModal(false);
  };

  return (
    <>
      {isLoading && <Loading />}
      {openAlertModal && <AlertModal message={REMOVE_MEAL_MESSAGE} confirm={removeMeal} decline={closeAlertModal} />}
      {userInfo.role.name === PERSONAL_TRAINER_ROLE && (
        <Button
          label={'Add meal'}
          type="primaryTrainer"
          onPress={() => navigation.navigate('AddMeal', { clientId, date })}
        />
      )}
      <Container
        refreshControl={<RefreshControl refreshing={false} onRefresh={rerender} />}
        contentContainerStyle={{
          paddingBottom: PADDING_BOTTOM,
        }}
      >
        {meals &&
          meals.map((item) => (
            <InfoContainer key={item.id}>
              <TitleContainer>
                <Title>{item.name}</Title>
                <MealTime>{getTime(item.mealDateTime)}</MealTime>
              </TitleContainer>
              <ItemValue>
                <WhiteBold>Meal type:</WhiteBold>
                <White>{item.mealType}</White>
              </ItemValue>
              <ItemValue>
                <WhiteBold>Preparation time:</WhiteBold>
                <White>{item.preparationTime}</White>
              </ItemValue>
              <ItemValue>
                <WhiteBold>Description:</WhiteBold>
                <White>{item.description}</White>
              </ItemValue>
              <ItemValue>
                <WhiteBold>Ingredients:</WhiteBold>
                {item.ingredients.map((ing) => (
                  <ChosenIngredientContainer key={ing.id}>
                    <White>{ing.name}</White>
                    <WhiteBold>{ing.quantity}</WhiteBold>
                  </ChosenIngredientContainer>
                ))}
              </ItemValue>
              {userInfo.role.name === PERSONAL_TRAINER_ROLE && (
                <Button
                  label={'Edit meal'}
                  type="primaryTrainer"
                  onPress={() => navigation.navigate('AddMeal', { clientId, date, meal: item })}
                />
              )}
              {userInfo.role.name === PERSONAL_TRAINER_ROLE && (
                <Button
                  label={'Remove meal'}
                  type="ternary"
                  onPress={() => {
                    setOpenAlertModal(true);
                    setSelectedMealId(item.id);
                  }}
                />
              )}
            </InfoContainer>
          ))}
      </Container>
    </>
  );
}
