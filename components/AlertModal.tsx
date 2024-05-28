import React, { FC } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import { theme } from '../constants/Theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from './Modal';
import Button from './reusable-components/Button';
import { useUserData } from '../context/userContext';
import { PERSONAL_TRAINER_ROLE } from '../constants/constants';

interface IAlertModal {
  message: string;
  confirm: () => void;
  decline: () => void;
}

const Message = styled(Text)`
  text-align: center;
  font-size: ${hp('2%')}px;
  color: ${theme.palette.white};
  font-family: ${theme.fonts.interBold};
  margin: ${hp('1.5%')}px;
`;

const AlertModal: FC<IAlertModal> = ({ message, confirm, decline }: IAlertModal) => {
  const { userInfo } = useUserData();

  return (
    <Modal>
      <Message>{message}</Message>
      {userInfo.role.name === PERSONAL_TRAINER_ROLE ? (
        <>
          <Button label="Confirm" type="primaryTrainer" onPress={confirm} />
          <Button label="Decline" type="ternary" onPress={decline} />
        </>
      ) : (
        <>
          <Button label="Confirm" type="primary" onPress={confirm} />
          <Button label="Decline" type="ternary" onPress={decline} />
        </>
      )}
    </Modal>
  );
};

export default AlertModal;
