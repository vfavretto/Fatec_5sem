import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';

// Configure o IP do seu backend aqui (use o IP da sua máquina na rede local)
const API_URL = 'http://localhost:3000/api/enderecos';

interface Endereco {
  _id?: string;
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero?: string;
  observacoes?: string;
}

export default function App() {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);
  const [enderecoAtual, setEnderecoAtual] = useState<Endereco>({
    cep: '',
    logradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarEnderecos();
  }, []);

  const carregarEnderecos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setEnderecos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os endereços');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buscarCep = async () => {
    if (cep.length !== 8) {
      Alert.alert('Erro', 'CEP deve ter 8 dígitos');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/enderecos/buscar-cep/${cep}`);
      const data = await response.json();

      if (data.error) {
        Alert.alert('Erro', data.error);
        return;
      }

      setEnderecoAtual({
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento || '',
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
        numero: '',
        observacoes: '',
      });
      setModalVisible(true);
      setEditando(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o CEP');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const salvarEndereco = async () => {
    try {
      setLoading(true);
      const url = editando && enderecoAtual._id
        ? `${API_URL}/${enderecoAtual._id}`
        : API_URL;

      const method = editando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enderecoAtual),
      });

      if (response.ok) {
        Alert.alert('Sucesso', `Endereço ${editando ? 'atualizado' : 'cadastrado'} com sucesso!`);
        setModalVisible(false);
        limparFormulario();
        carregarEnderecos();
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o endereço');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o endereço');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const editarEndereco = (endereco: Endereco) => {
    setEnderecoAtual(endereco);
    setEditando(true);
    setModalVisible(true);
  };

  const deletarEndereco = async (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                Alert.alert('Sucesso', 'Endereço excluído com sucesso!');
                carregarEnderecos();
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o endereço');
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o endereço');
              console.error(error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const limparFormulario = () => {
    setCep('');
    setEnderecoAtual({
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      localidade: '',
      uf: '',
      numero: '',
      observacoes: '',
    });
    setEditando(false);
  };

  const renderItem = ({ item }: { item: Endereco }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>CEP: {item.cep}</Text>
        <Text style={styles.cardSubtitle}>{item.localidade}/{item.uf}</Text>
      </View>
      <Text style={styles.cardText}>
        {item.logradouro}, {item.numero || 'S/N'}
      </Text>
      <Text style={styles.cardText}>
        {item.bairro}
      </Text>
      {item.complemento && (
        <Text style={styles.cardText}>Complemento: {item.complemento}</Text>
      )}
      {item.observacoes && (
        <Text style={styles.cardText}>Obs: {item.observacoes}</Text>
      )}
      <View style={styles.cardButtons}>
        <TouchableOpacity
          style={[styles.button, styles.buttonEdit]}
          onPress={() => editarEndereco(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonDelete]}
          onPress={() => item._id && deletarEndereco(item._id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciador de Endereços</Text>
        <Text style={styles.headerSubtitle}>CRUD com MongoDB e ViaCEP</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o CEP (8 dígitos)"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
          maxLength={8}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={buscarCep}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Buscar CEP</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Endereços Cadastrados ({enderecos.length})</Text>
        {loading && enderecos.length === 0 ? (
          <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
        ) : (
          <FlatList
            data={enderecos}
            renderItem={renderItem}
            keyExtractor={(item) => item._id || Math.random().toString()}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={carregarEnderecos}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum endereço cadastrado</Text>
            }
          />
        )}
      </View>

      {/* Modal de Cadastro/Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          limparFormulario();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {editando ? 'Editar Endereço' : 'Novo Endereço'}
              </Text>

              <Text style={styles.label}>CEP</Text>
              <TextInput
                style={styles.modalInput}
                value={enderecoAtual.cep}
                onChangeText={(text) => setEnderecoAtual({ ...enderecoAtual, cep: text })}
                editable={!editando}
              />

              <Text style={styles.label}>Logradouro</Text>
              <TextInput
                style={styles.modalInput}
                value={enderecoAtual.logradouro}
                onChangeText={(text) => setEnderecoAtual({ ...enderecoAtual, logradouro: text })}
              />

              <Text style={styles.label}>Número</Text>
              <TextInput
                style={styles.modalInput}
                value={enderecoAtual.numero}
                onChangeText={(text) => setEnderecoAtual({ ...enderecoAtual, numero: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Complemento</Text>
              <TextInput
                style={styles.modalInput}
                value={enderecoAtual.complemento}
                onChangeText={(text) => setEnderecoAtual({ ...enderecoAtual, complemento: text })}
              />

              <Text style={styles.label}>Bairro</Text>
              <TextInput
                style={styles.modalInput}
                value={enderecoAtual.bairro}
                onChangeText={(text) => setEnderecoAtual({ ...enderecoAtual, bairro: text })}
              />

              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={styles.modalInput}
                value={enderecoAtual.localidade}
                onChangeText={(text) => setEnderecoAtual({ ...enderecoAtual, localidade: text })}
              />

              <Text style={styles.label}>UF</Text>
              <TextInput
                style={styles.modalInput}
                value={enderecoAtual.uf}
                onChangeText={(text) => setEnderecoAtual({ ...enderecoAtual, uf: text })}
                maxLength={2}
              />

              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                value={enderecoAtual.observacoes}
                onChangeText={(text) => setEnderecoAtual({ ...enderecoAtual, observacoes: text })}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => {
                    setModalVisible(false);
                    limparFormulario();
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={salvarEndereco}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalButtonText}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E6F2FF',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D9E6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#FAFBFC',
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonEdit: {
    backgroundColor: '#FFA726',
  },
  buttonDelete: {
    backgroundColor: '#EF5350',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D9E6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFBFC',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#95A5A6',
  },
  modalButtonSave: {
    backgroundColor: '#27AE60',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
