import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Container from '../components/layout/Container';
import { RootStackScreenProps } from '../navigation/root-navigator';

export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
  return (
    <Container>
      <Text>{"This screen doesn't exist."}</Text>
      <TouchableOpacity onPress={() => navigation.push('ScreenOne')}>
        <Text>Go to home screen!</Text>
      </TouchableOpacity>
    </Container>
  );
}
