import * as React from 'react';
import { RootStackScreenProps } from '../navigation/root-navigator';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/reusable-components/Button';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Input from '../components/Input';
import { DropdownSelect } from '../components/Dropdown';
import Modal from '../components/Modal';
import { searchIngredient } from '../api/ingredient/ingredient';
import { Ingredient, MealIngredient, MealType } from '../api/types';
import Loading from '../components/Loading';
import { addNewMeal, getAllMealTypes, updateMeal } from '../api/meal/meal';
import { useAuthData } from '../context/authContext';
import { getDateWithOffset, getTimeFromPicker, getTimeWithoutOffset } from '../utils/date';
import { Error, ErrorMessage } from './Login';
import { QUANTITY_ERROR_MESSAGE } from '../constants/constants';
import DateTimePicker from '@react-native-community/datetimepicker';

const Container = styled(View)`
  width: ${wp('90%')}px;
  margin: 0 auto;
  padding: ${hp('5%')}px ${wp('5%')}px;
`;

const Subtitle = styled(Text)`
  font-size: ${hp('2%')}px;
  font-family: ${theme.fonts.interSemiBold};
  margin: ${hp('1.5%')}px;
  color: ${theme.palette.white};
`;

const Form = styled(ScrollView)`
  width: 100%;
  height: ${hp('75%')}px;
`;

const AddIngredientButton = styled(TouchableOpacity)`
  background-color: ${theme.palette.secondary};
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

const IngredientContainer = styled(TouchableOpacity)`
  background: ${theme.palette.secondary};
  margin: ${wp('1.5%')}px;
  border-radius: 10px;
  padding: ${hp('1.5%')}px; 
  z-index: 1;
`;

export const ChosenIngredientContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: ${wp('1.5%')}px;
  padding: 0 ${wp('5%')}px;
  z-index: 1;
`;

const ScrollContainer = styled(ScrollView)`
  background: ${theme.palette.primary};
  height: ${hp('30%')}px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${theme.palette.white};
  padding: ${hp('1.5%')}px;
  margin: ${hp('1.5%')}px;
  z-index: 2;
`;

export const NotFoundContainer = styled(View)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PickerContainer = styled(View)`
  height: ${hp('6%')}px;
  border-radius: 10px;
  margin: ${hp('1.5%')}px;
  background-color: ${theme.palette.primary};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.palette.white};
  padding-left: ${wp('5.9%')}px;
  padding-right: ${wp('5.9%')}px;
`;

export const NotFoundText = styled(Text)`
  font-size: ${hp('2%')}px;
  font-family: ${theme.fonts.interLight};
  color: ${theme.palette.white};
`;

const TextBold = styled(Text)`
  font-size: ${hp('2%')}px;
  font-family: ${theme.fonts.interBold};
  color: ${theme.palette.white};
`;

const IngredientText = styled(Text)`
  font-size: ${hp('2%')}px;
  font-family: ${theme.fonts.interMedium};
  color: ${theme.palette.white};
`;

const TimeText = styled(Text)`
  font-size: ${hp('2%')}px;
  font-family: ${theme.fonts.interMedium};
  color: ${theme.palette.white};
`;

const TimePickerIOS = styled(DateTimePicker)`
  width: 50%;
`;

export default function AddMeal({ navigation, route }: RootStackScreenProps<'AddMeal'>) {
  const { accessToken } = useAuthData();
  const { clientId, date, meal } = route.params;

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>(meal?.name || '');
  const [description, setDescription] = React.useState<string>(meal?.description || '');
  const [preparationTime, setPreparationTime] = React.useState<string>(meal?.preparationTime || '');
  const [mealType, setMealType] = React.useState<string>(meal?.mealType || '');
  const [mealDate, setMealDate] = React.useState<string>(date);
  const [time, setTime] = React.useState<Date>(meal?.mealDateTime ? getDateWithOffset(meal?.mealDateTime) : new Date());
  const [chosenIngredients, setChosenIngredients] = React.useState<MealIngredient[]>(meal?.ingredients || []);
  const [mealTypes, setMealTypes] = React.useState<MealType[]>([]);

  const [openAddModal, setOpenAddModal] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [quantity, setQuantity] = React.useState<string>('');
  const [quantityError, setQuantityError] = React.useState<boolean>(false);
  const [ingredients, setIngredients] = React.useState<Ingredient[]>();
  const [selectedIngredient, setSelectedIngredient] = React.useState<Ingredient>();

  const [openRemoveModal, setOpenRemoveModal] = React.useState<boolean>(false);
  const [ingredientToDelete, setIngredientToDelete] = React.useState<string>('');

  const [show, setShow] = React.useState<boolean>(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: meal ? 'Edit meal' : 'Add meal',
    });
  }, [navigation]);

  React.useEffect(() => {
    setIsLoading(true);
    getAllMealTypes()
      .then((res) => {
        setMealTypes(res);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);

  const searchIngredients = async () => {
    setIsLoading(true);
    await searchIngredient(search)
      .then((res) => {
        setIngredients(res);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const isAlreadySelected = (item: Ingredient): boolean => {
    let selected = false;
    for (let i = 0; i < chosenIngredients.length; i++) {
      if (chosenIngredients[i].id === item.id) {
        selected = true;
        break;
      }
    }
    return selected;
  };

  const resetData = () => {
    setSelectedIngredient(undefined);
    setSearch('');
    setQuantity('');
    setIngredients(undefined);
    setOpenAddModal(false);
    setIngredientToDelete('');
    setOpenRemoveModal(false);
  };

  const closeModal = () => {
    setOpenAddModal(false);
    resetData();
  };

  const addIngredient = () => {
    if (quantity === '') {
      setQuantityError(true);
      setTimeout(function () {
        setQuantityError(false);
      }, 5000);
      return;
    }
    if (selectedIngredient) {
      setChosenIngredients([
        ...chosenIngredients,
        { id: selectedIngredient.id, name: selectedIngredient.name, quantity },
      ]);
    }
    resetData();
  };

  const removeSelectedIngredient = () => {
    if (ingredientToDelete) {
      setChosenIngredients(chosenIngredients.filter((ing) => ing.name !== ingredientToDelete));
    }
    resetData();
  };

  const addMeal = async () => {
    setIsLoading(true);
    try {
      await addNewMeal(
        {
          name,
          description,
          preparationTime,
          mealType,
          mealDateTime: `${mealDate}T${getTimeFromPicker(time)}`,
          ingredients: chosenIngredients,
        },
        clientId,
        accessToken,
      );
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      navigation.goBack();
    }
  };

  const editMeal = async () => {
    setIsLoading(true);
    try {
      await updateMeal(
        {
          id: meal?.id,
          name,
          description,
          preparationTime,
          mealType,
          mealPlanId: meal?.mealPlanId,
          mealDateTime: `${mealDate}T${getTimeFromPicker(time)}`,
          ingredients: chosenIngredients,
        },
        accessToken,
      );
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      navigation.goBack();
    }
  };

  const onDateChange = (event: Event, selectedDate: Date) => {
    if (selectedDate) {
      setTime(selectedDate);
    } else {
      setTime(new Date());
    }
    setShow(false);
  };

  return (
    <>
      {isLoading && <Loading />}
      {Platform.OS === 'android' && show && (
        <TimePickerIOS
          testID="dateTimePicker"
          value={time || new Date()}
          mode="time"
          type="inline"
          is24Hour={true}
          onChange={onDateChange}
        />
      )}
      {openAddModal && (
        <Modal>
          {!selectedIngredient && (
            <>
              <Input onChange={setSearch} value={search} placeholder="Search" onSubmitEditing={searchIngredients} />
              <ScrollContainer nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                {ingredients ? (
                  ingredients.map(
                    (ing) =>
                      !isAlreadySelected(ing) && (
                        <IngredientContainer key={ing.id} onPress={() => setSelectedIngredient(ing)}>
                          <IngredientText>{ing.name}</IngredientText>
                        </IngredientContainer>
                      ),
                  )
                ) : (
                  <NotFoundContainer>
                    <NotFoundText>Not found</NotFoundText>
                  </NotFoundContainer>
                )}
              </ScrollContainer>
              <Button label="Search" type="secondaryTrainer" onPress={searchIngredients} />
              <Button label="Close" type="ternary" onPress={closeModal} />
            </>
          )}
          {selectedIngredient && (
            <>
              <IngredientText>
                <TextBold>Selected:</TextBold> {selectedIngredient.name}
              </IngredientText>
              {quantityError && (
                <Error>
                  <ErrorMessage>{QUANTITY_ERROR_MESSAGE}</ErrorMessage>
                </Error>
              )}
              <Input
                onChange={setQuantity}
                value={quantity}
                placeholder="Quantity (ex 12g, 2L)"
                onSubmitEditing={addIngredient}
              />
              <Button label="Add ingredient" type="primaryTrainer" onPress={addIngredient} />
              <Button
                label="Close"
                type="ternary"
                onPress={() => {
                  setOpenAddModal(false);
                  resetData();
                }}
              />
            </>
          )}
        </Modal>
      )}
      {openRemoveModal && (
        <Modal>
          <DropdownSelect
            value={ingredientToDelete}
            onChange={setIngredientToDelete}
            items={chosenIngredients.map((ing) => {
              return { id: ing.id, value: ing.name };
            })}
            placeholder="Choose ingredient"
          />
          <Button label="Remove ingredient" type="primaryTrainer" onPress={removeSelectedIngredient} />
          <Button label="Close" type="secondaryTrainer" onPress={() => setOpenRemoveModal(false)} />
        </Modal>
      )}
      <Container>
        <Form showsVerticalScrollIndicator={false}>
          <Input onChange={setName} value={name} placeholder="Name" />
          <Input
            onChange={setDescription}
            value={description}
            numberOfLines={3}
            multiline={true}
            placeholder="Preparation description..."
          />
          <Input onChange={setPreparationTime} value={preparationTime} placeholder="Preparation time" />
          <DropdownSelect
            value={mealType}
            onChange={setMealType}
            items={mealTypes.map((mT) => {
              return { id: mT.id, value: mT.name };
            })}
            placeholder="Meal type"
          />
          {Platform.OS === 'android' ? (
            <>
              <PickerContainer>
                <TimeText>{getTimeWithoutOffset(time)}</TimeText>
              </PickerContainer>
              <Button label="Pick meal time" type="secondaryTrainer" onPress={() => setShow(true)} />
            </>
          ) : (
            <PickerContainer>
              <TimeText>Meal time:</TimeText>
              <TimePickerIOS testID="dateTimePicker" value={time} mode="time" is24Hour={true} onChange={onDateChange} />
            </PickerContainer>
          )}

          <Input onChange={setMealDate} value={mealDate} placeholder="Date (yyyy-MM-dd)" />
          <Subtitle>Ingredients</Subtitle>
          <AddIngredientButton onPress={() => setOpenRemoveModal(true)}>
            <ButtonText>Remove ingredient</ButtonText>
          </AddIngredientButton>
          <AddIngredientButton onPress={() => setOpenAddModal(true)}>
            <ButtonText>Add ingredient</ButtonText>
          </AddIngredientButton>
          {chosenIngredients &&
            chosenIngredients.map((ing) => (
              <ChosenIngredientContainer key={ing.id}>
                <TextBold>{ing.name}</TextBold>
                <IngredientText>{ing.quantity}</IngredientText>
              </ChosenIngredientContainer>
            ))}
        </Form>
        {meal ? (
          <Button label={'Edit meal'} type="primaryTrainer" onPress={editMeal} />
        ) : (
          <Button label={'Add meal'} type="primaryTrainer" onPress={addMeal} />
        )}
      </Container>
    </>
  );
}
