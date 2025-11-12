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
import { BookForm } from '../components/BookForm';
import { BookListItem } from '../components/BookListItem';
import { useDatabase } from '../context/DatabaseContext';
import { useBooks } from '../hooks/useBooks';
import { Book, BookPayload } from '../types/book';

export function BookListScreen() {
  const { selectedDatabase, clearSelection } = useDatabase();
  const { books, isLoading, isSaving, error, refresh, addBook, editBook, removeBook } = useBooks(selectedDatabase);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Ops!', error);
    }
  }, [error]);

  const handleCreate = () => {
    setEditingBook(null);
    setIsFormVisible(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormVisible(true);
  };

  const handleDelete = (book: Book) => {
    Alert.alert('Confirmação', `Deseja excluir "${book.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removeBook(book.id).catch(() => null)
      }
    ]);
  };

  const handleSubmit = async (payload: BookPayload) => {
    if (editingBook) {
      await editBook(editingBook.id, payload);
    } else {
      await addBook(payload);
    }
    setIsFormVisible(false);
    setEditingBook(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Minha Estante</Text>
          <Text style={styles.headerSubtitle}>
            Banco selecionado:{' '}
            <Text style={styles.driverHighlight}>{selectedDatabase === 'mongo' ? 'MongoDB' : 'SQLite'}</Text>
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <Pressable style={[styles.headerButton, styles.swapButton]} onPress={clearSelection}>
            <Text style={[styles.headerButtonText, styles.swapButtonText]}>Trocar banco</Text>
          </Pressable>
          <Pressable style={[styles.headerButton, styles.addButton]} onPress={handleCreate}>
            <Text style={styles.headerButtonText}>Novo livro</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        contentContainerStyle={books.length === 0 ? styles.emptyContent : styles.listContent}
        renderItem={({ item }) => (
          <BookListItem book={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhum livro cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                Adicione novos livros para acompanhar suas leituras e planejamentos.
              </Text>
              <Pressable style={[styles.headerButton, styles.addButton]} onPress={handleCreate}>
                <Text style={styles.headerButtonText}>Cadastrar primeiro livro</Text>
              </Pressable>
            </View>
          )
        }
      />

      <BookForm
        visible={isFormVisible}
        initialBook={editingBook}
        onClose={() => {
          setIsFormVisible(false);
          setEditingBook(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 32
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A'
  },
  headerSubtitle: {
    marginTop: 6,
    color: '#475569',
    fontSize: 15
  },
  driverHighlight: {
    fontWeight: '700'
  },
  headerButtons: {
    alignItems: 'flex-end'
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 8
  },
  headerButtonText: {
    fontWeight: '600',
    color: '#fff'
  },
  swapButton: {
    backgroundColor: '#E2E8F0'
  },
  swapButtonText: {
    color: '#1E293B'
  },
  addButton: {
    backgroundColor: '#2563EB'
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
    color: '#1E293B'
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#475569',
    marginVertical: 12
  }
});

