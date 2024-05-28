import React, { FC } from 'react';
import { TextInput, View } from 'react-native';
import styled from 'styled-components';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/Theme';

interface ISearchBarProps {
  term: string;
  onTermChange: (term: string) => void;
  onTermSubmit: () => void;
}

const Container = styled(View)`
  width: 330px;
  height: 40px;
  border-radius: 20px;
  background-color: ${theme.palette.wildsand};
  display: flex;
  flex-direction: row;
  padding: 10px;
  align-items: center;
`;

const Input = styled(TextInput)`
  flex: 1;
  color: ${theme.palette.darkgrey};
`;

const Icon = styled(Feather)`
  color: ${theme.palette.darkgrey};
  font-size: 20px;
  margin-right: 10px;
`;

export const SearchBar: FC<ISearchBarProps> = ({ term, onTermChange, onTermSubmit }) => {
  return (
    <Container>
      <Icon name="search" />
      <Input
        placeholder="Search..."
        placeholderTextColor="#9a9a9a"
        autoCorrect={false}
        autoCapitalize="none"
        value={term}
        onChangeText={onTermChange}
        onEndEditing={onTermSubmit}
      />
    </Container>
  );
};

/*HOW TO USE -> 
    on the screen that uses searchbar, define   

    const [term, setTerm] = useState("");

    and then call the searchbar like this: 

    <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={() => searchApi(term)}
      />

*/
