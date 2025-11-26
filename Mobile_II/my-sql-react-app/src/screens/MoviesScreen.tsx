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
import { MovieForm } from '../components/MovieForm';
import { MovieListItem } from '../components/MovieListItem';
import { MovieSearchModal } from '../components/MovieSearchModal';
import { useDatabase } from '../context/DatabaseContext';
import { useMovies } from '../hooks/useMovies';
import { Movie, MoviePayload } from '../types/movie';
import { colors } from '../theme/colors';

export function MoviesScreen() {
  const { selectedDatabase } = useDatabase();
  const { movies, isLoading, isSaving, error, refresh, addMovie, editMovie, removeMovie } =
    useMovies(selectedDatabase);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Ops!', error);
    }
  }, [error]);

  const handleCreate = () => {
    setEditingMovie(null);
    setIsFormVisible(true);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setIsFormVisible(true);
  };

  const handleDelete = (movie: Movie) => {
    Alert.alert('Confirmação', `Deseja excluir "${movie.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removeMovie(movie.id).catch(() => null)
      }
    ]);
  };

  const handleSubmit = async (payload: MoviePayload) => {
    if (editingMovie) {
      await editMovie(editingMovie.id, payload);
    } else {
      await addMovie(payload);
    }
    setIsFormVisible(false);
    setEditingMovie(null);
  };

  const handleImportMovie = async (payload: MoviePayload): Promise<void> => {
    await addMovie(payload);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Filmes</Text>
          <Text style={styles.headerSubtitle}>Gerencie sua coleção de filmes</Text>
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
        data={movies}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
        contentContainerStyle={movies.length === 0 ? styles.emptyContent : styles.listContent}
        renderItem={({ item }) => (
          <MovieListItem movie={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhum filme cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                Adicione filmes para acompanhar sua coleção e avaliações.
              </Text>
              <Pressable style={[styles.headerButton, styles.addButton]} onPress={handleCreate}>
                <Text style={styles.headerButtonText}>Cadastrar primeiro filme</Text>
              </Pressable>
            </View>
          )
        }
      />

      <MovieForm
        visible={isFormVisible}
        initialMovie={editingMovie}
        onClose={() => {
          setIsFormVisible(false);
          setEditingMovie(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
      />

      <MovieSearchModal
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        onImport={handleImportMovie}
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

