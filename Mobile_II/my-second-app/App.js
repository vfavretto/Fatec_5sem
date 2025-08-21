import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { 
  Button, 
  Provider as PaperProvider, 
  TextInput, 
  Card, 
  Chip,
  Surface,
  IconButton,
  MD3LightTheme
} from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
  },
};

function AppContent() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState(null);

  const buscarCep = () => {
    const cleanValue = cep.replace(/\D/g, '');
    if (cleanValue.length === 8) {
      let url = `https://viacep.com.br/ws/${cleanValue}/json/`;
      fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Dados do CEP:', data);
        if (data.erro) {
          Alert.alert('Erro', 'CEP não encontrado!');
          setEndereco(null);
        } else {
          setEndereco(data);
        }
      });
    } else {
      Alert.alert('Atenção', 'Digite um CEP válido com 8 dígitos!');
    }
  };

  const formatCep = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return cleaned.replace(/(\d{5})(\d{0,3})/, '$1-$2');
  };

  const handleCepChange = (text) => {
    const formatted = formatCep(text);
    setCep(formatted);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <TextInput
          label="Digite o CEP"
          placeholder="00000-000"
          value={cep}
          onChangeText={handleCepChange}
          keyboardType="numeric"
          maxLength={9}
          mode="outlined"
          left={<TextInput.Icon icon="map-marker" />}
          style={styles.input}
        />
      </Surface>

      {endereco && (
        <Card style={styles.resultCard}>
          <Card.Title 
            title="Endereço Encontrado" 
            left={(props) => <IconButton {...props} icon="check-circle" iconColor="#4CAF50" />}
          />
          <Card.Content>
            <View style={styles.chipContainer}>
              <Chip icon="map-marker" style={styles.chip}>CEP: {endereco.cep}</Chip>
              {endereco.logradouro && (
                <Chip icon="road" style={styles.chip}>Rua: {endereco.logradouro}</Chip>
              )}
              {endereco.bairro && (
                <Chip icon="home-city" style={styles.chip}>Bairro: {endereco.bairro}</Chip>
              )}
              <Chip icon="city" style={styles.chip}>Cidade: {endereco.localidade}</Chip>
              <Chip icon="map" style={styles.chip}>Estado: {endereco.uf}</Chip>
            </View>
          </Card.Content>
        </Card>
      )}

      <Button 
        mode="contained" 
        onPress={buscarCep}
        style={styles.pressableButton}
        icon="magnify"
      >
        Buscar CEP
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2F8',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    backgroundColor: 'transparent',
  },
  resultCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  pressableButton: {
    borderRadius: 8,
    marginTop: 10,
  },
});

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppContent />
    </PaperProvider>
  );
}