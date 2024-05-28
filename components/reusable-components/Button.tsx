import React, { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { theme } from '../../constants/Theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface IButton {
  label: string;
  type: 'primary' | 'secondary' | 'ternary' | 'primaryTrainer' | 'secondaryTrainer';
  onPress: () => void;
}

export const CustomButton = styled(TouchableOpacity)<IButton>`
  height: ${hp('6%')}px;
  border-radius: 10px;
  margin: ${hp('1.5%')}px;
  background-color: ${(p) => theme.components.button[p.type].background};
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: ${(p) => theme.components.button[p.type].borderWidth};
  border-color: ${(p) => theme.components.button[p.type].borderColor};
`;

export const CustomText = styled(Text)<Omit<IButton, 'onPress'>>`
  font-family: ${theme.fonts.interSemiBold};
  font-size: ${hp('2.1%')}px;
  font-weight: bold;
  color: ${(p) => theme.components.button[p.type].color};
`;

const Button: FC<IButton> = ({ label, onPress, ...props }) => {
  return (
    <CustomButton {...props} label={label} onPress={onPress}>
      <CustomText {...props} label={label}>
        {label}
      </CustomText>
    </CustomButton>
  );
};

Button.displayName = 'Button';

export default Button;
