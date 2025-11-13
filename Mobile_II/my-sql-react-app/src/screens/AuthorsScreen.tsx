import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { AuthorForm } from '../components/AuthorForm';
import { AuthorListItem } from '../components/AuthorListItem';
import { AuthorSearchModal } from '../components/AuthorSearchModal';
import { useDatabase } from '../context/DatabaseContext';
import { useAuthors } from '../hooks/useAuthors';
import { Author, AuthorPayload } from '../types/author';
import { colors } from '../theme/colors';

export function AuthorsScreen() {
  const { selectedDatabase } = useDatabase();
  const { authors, isLoading, isSaving, error, refresh, addAuthor, editAuthor, removeAuthor } =
    useAuthors(selectedDatabase);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Ops!', error);
    }
  }, [error]);

  const handleCreate = () => {
    setEditingAuthor(null);
    setIsFormVisible(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsFormVisible(true);
  };

  const handleDelete = (author: Author) => {
    Alert.alert('Confirmação', `Deseja excluir "${author.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removeAuthor(author.id).catch(() => null)
      }
    ]);
  };

  const handleSubmit = async (payload: AuthorPayload) => {
    if (editingAuthor) {
      await editAuthor(editingAuthor.id, payload);
    } else {
      await addAuthor(payload);
    }
    setIsFormVisible(false);
    setEditingAuthor(null);
  };

  const handleImportAuthor = async (payload: AuthorPayload) => {
    await addAuthor(payload);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Autores</Text>
          <Text style={styles.headerSubtitle}>Gerencie seus autores favoritos</Text>
        </View>
        <View style={styles.headerButtons}>
          <Pressable style={[styles.headerButton, styles.searchButton]} onPress={() => setIsSearchVisible(true)}>
            <Text style={styles.searchButtonText}>🔍 Buscar</Text>
          </Pressable>
          <Pressable style={[styles.headerButton, styles.addButton]} onPress={handleCreate}>
            <Text style={styles.headerButtonText}>➕ Novo</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={authors}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        contentContainerStyle={authors.length === 0 ? styles.emptyContent : styles.listContent}
        renderItem={({ item }) => (
          <AuthorListItem author={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhum autor cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                Adicione autores para acompanhar suas obras e biografias.
              </Text>
              <Pressable style={[styles.headerButton, styles.addButton]} onPress={handleCreate}>
                <Text style={styles.headerButtonText}>Cadastrar primeiro autor</Text>
              </Pressable>
            </View>
          )
        }
      />

      <AuthorForm
        visible={isFormVisible}
        initialAuthor={editingAuthor}
        onClose={() => {
          setIsFormVisible(false);
          setEditingAuthor(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
      />

      <AuthorSearchModal
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        onImport={handleImportAuthor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  headerInfo: {
    flex: 1,
    marginRight: 12
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary
  },
  headerSubtitle: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 15
  },
  headerButtons: {
    alignItems: 'flex-end',
    gap: 8
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12
  },
  headerButtonText: {
    fontWeight: '700',
    color: colors.surface,
    fontSize: 14
  },
  searchButton: {
    backgroundColor: colors.secondary
  },
  searchButtonText: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 14
  },
  addButton: {
    backgroundColor: colors.primary
  },
  listContent: {
    paddingBottom: 32
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 32
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text
  },
  emptySubtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 12,
    marginBottom: 20
  }
});

