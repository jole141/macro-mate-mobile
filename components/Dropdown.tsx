import React, { FC, useState } from 'react';
import { ScrollView, TouchableOpacity, View, ViewStyle } from 'react-native';
import styled from 'styled-components';
import { AntDesign } from '@expo/vector-icons';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Text } from './Text';

interface IDropdownSelectProps extends Partial<ViewStyle> {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  items: IDropdownOption[];
}

export interface IDropdownOption {
  value: string;
  id?: number;
}

const Container = styled(View)`
  border-radius: 10px;
  margin: ${hp('1.5%')}px;
  background-color: ${theme.palette.primary};
  display: flex;
  border-width: 1px;
  border-color: ${theme.palette.white};
  padding-left: ${wp('5.9%')}px;
  padding-right: ${wp('5.9%')}px;
`;

const SelectedValue = styled(View)`
  height: ${hp('5.55%')}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PlaceholderValue = styled(SelectedValue)`
  color: ${theme.palette.darkgrey};
`;

const DropdownContainer = styled(View)<Partial<ViewStyle>>`
  width: 100%;
  height: ${hp('5.55%')}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: ${wp('2%')}px;
`;

const DropdownOption = styled(TouchableOpacity)<Partial<ViewStyle>>`
  height: ${hp('5.55%')}px;
  display: flex;
  justify-content: center;
`;

const Option = styled(Text)`
  margin: ${wp('2%')}px 0;
  color: ${theme.palette.darkgrey};
  font-family: ${theme.fonts.interMedium};
  font-size: ${hp('1.6%')}px;
`;

const DropdownList = styled(ScrollView)`
  max-height: ${hp('18%')}px;
`;

export const CustomTextInput = styled(Text)`
  font-family: ${theme.fonts.interMedium};
  font-size: ${hp('1.9%')}px;
  color: ${theme.palette.white};
`;

export const Placeholder = styled(Text)`
  font-family: ${theme.fonts.interMedium};
  font-size: ${hp('1.9%')}px;
  color: ${theme.palette.darkgrey};
`;

const Line = styled(View)<{ height: number }>`
  width: 100%;
  height: ${(p) => p.height}px;
  background-color: ${theme.palette.wildsand};
`;

const Icon = styled(AntDesign)`
  color: ${theme.palette.darkgrey};
  font-size: ${hp('2%')}px;
  margin-right: ${wp('2%')}px;
`;

export const DropdownSelect: FC<IDropdownSelectProps> = ({
  value: value,
  onChange: onChange,
  placeholder,
  label,
  items,
  ...props
}) => {
  const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);

  const selectItem = (item: IDropdownOption) => {
    onChange(item.value);
    setShowDropdownMenu(false);
  };

  const renderItem = (item: IDropdownOption) => {
    return (
      <DropdownOption key={item.value} onPress={() => selectItem(item)}>
        <Option>{item.value}</Option>
        {items.indexOf(item) !== items.length - 1 && <Line height={1} />}
      </DropdownOption>
    );
  };

  return (
    <Container>
      <TouchableOpacity onPress={() => setShowDropdownMenu(!showDropdownMenu)}>
        <DropdownContainer style={{ ...props }}>
          {value ? (
            <SelectedValue>
              <CustomTextInput>{value}</CustomTextInput>
            </SelectedValue>
          ) : (
            <PlaceholderValue>
              <Placeholder>{placeholder}</Placeholder>
            </PlaceholderValue>
          )}
          <Icon name={showDropdownMenu ? 'up' : 'down'} />
        </DropdownContainer>
      </TouchableOpacity>
      {showDropdownMenu && (
        <>
          <DropdownList<React.ElementType> nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
            {items.map((el: IDropdownOption) => renderItem(el))}
          </DropdownList>
        </>
      )}
    </Container>
  );
};
