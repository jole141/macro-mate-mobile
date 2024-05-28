import React, { FC, PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';
import styled from 'styled-components';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { theme } from '../../constants/Theme';

const Wrapper = styled(View)`
  width: ${wp('90%')}px;
  margin: 0 auto;
`;

const OuterContainer = styled(View)`
  background-color: ${theme.palette.primary};
  color: ${theme.palette.white};
`;

const Container: FC<PropsWithChildren<ViewProps>> = ({ children, ...props }: PropsWithChildren<ViewProps>) => {
  return (
    <OuterContainer {...props}>
      <Wrapper>{children}</Wrapper>
    </OuterContainer>
  );
};

export default Container;
