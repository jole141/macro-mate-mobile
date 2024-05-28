import React, { FC, PropsWithChildren } from 'react';
import { ScrollView, View, ViewProps } from 'react-native';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const Container = styled(View)`
  position: absolute;
  background: ${theme.palette.trasparentgray};
  width: ${wp('100%')}px;
  height: ${hp('100%')}px;
  color: ${theme.palette.white};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

export const ContentContainer = styled(View)`
  background: ${theme.palette.secondary};
  width: 320px;
  max-height: ${hp('70%')}px;
  color: ${theme.palette.white};
  display: flex;
  justify-content: center;
  z-index: 5;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${theme.palette.white};
  padding: ${wp('5%')}px;
`;

const Modal: FC<PropsWithChildren<ViewProps>> = ({ children, ...props }: PropsWithChildren<ViewProps>) => {
  return (
    <Container {...props}>
      <ContentContainer>
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </ContentContainer>
    </Container>
  );
};

export default Modal;
