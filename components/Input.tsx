import React, { FC } from 'react';
import { KeyboardTypeOptions, ReturnKeyType, TextInput, View } from 'react-native';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface IInput {
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  numberOfLines?: number;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyType;
  autoCapitalize?: string;
}

export const CustomInput = styled(View)<Partial<IInput>>`
  height: ${(p) => (p.numberOfLines ? p.numberOfLines * hp('6%') : hp('6%'))}px;
  border-radius: 10px;
  margin: ${hp('1.5%')}px;
  background-color: ${theme.palette.primary};
  display: flex;
  justify-content: ${(p) => (p.numberOfLines ? 'flex-start' : 'center')};
  border-width: 1px;
  border-color: ${theme.palette.white};
  padding-left: ${wp('5.9%')}px;
  padding-right: ${wp('5.9%')}px;
  padding-top: ${(p) => (p.numberOfLines ? hp('1%') : 0)}px;
`;

export const CustomTextInput = styled(TextInput)`
  font-family: ${theme.fonts.interMedium};
  font-size: ${hp('1.9%')}px;
  color: ${theme.palette.white};
`;

const Input: FC<IInput> = ({
  value: value,
  onChange: onChange,
  onFocus: onFocus,
  onSubmitEditing: onSubmitEditing,
  placeholder,
  secureTextEntry,
  numberOfLines,
  multiline,
  keyboardType,
  returnKeyType,
  autoCapitalize,
  ...props
}) => {
  return (
    <CustomInput {...props} numberOfLines={numberOfLines}>
      <CustomTextInput
        {...props}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={theme.palette.darkgrey}
        numberOfLines={numberOfLines}
        multiline={multiline}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        autoCapitalize={autoCapitalize}
      />
    </CustomInput>
  );
};

export default Input;
