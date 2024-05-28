import React, { FC } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
  z-index: 10;
`;

const Loading: FC = () => {
  return (
    <Container>
      <ActivityIndicator size="large" color={theme.palette.white} />
    </Container>
  );
};

export default Loading;
