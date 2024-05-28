/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import styled from 'styled-components';
import { Text as DefaultText } from 'react-native';
import { theme } from '../constants/Theme';

export type TextProps = DefaultText['props'];

export const Text = styled(DefaultText)`
  width: 100%;
  color: ${theme.palette.white};
`;

export const WarningText = styled(Text)`
  color: ${theme.palette.red};
`;
