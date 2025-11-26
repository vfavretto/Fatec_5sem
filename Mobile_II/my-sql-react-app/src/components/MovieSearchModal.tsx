import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { colors } from '../theme/colors';
import {
  searchMovies,
  getMovieDetails,
  extractYear,
  getGenreNames
} from '../api/moviedb';
import { MoviePayload } from '../types/movie';

type Props = {
  visible: boolean;
  onClose(): void;
  onImport(payload: MoviePayload): Promise<void>;
};

export function MovieSearchModal({ visible, onClose, onImport }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchedMovie, setLastSearchedMovie] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Atenção', 'Digite um título para buscar.');
      return;
    }

    setIsSearching(true);
    setLastSearchedMovie(null);
    
    try {
      console.log('🔍 Buscando filme:', searchQuery);
      
      // Buscar filmes na API
      const data = await searchMovies(searchQuery);
      console.log('✅ Filmes encontrados:', data.results.length);
      
      if (data.results.length === 0) {
        Alert.alert('Sem resultados', 'Nenhum filme encontrado com esse título. Tente outro termo.');
        setIsSearching(false);
        return;
      }

      // Pegar o primeiro resultado
      const firstMovie = data.results[0];
      console.log('🎯 Primeiro filme:', firstMovie.title);
      setLastSearchedMovie(firstMovie.title);

      // Buscar detalhes completos do filme
      console.log('📥 Buscando detalhes do filme ID:', firstMovie.id);
      const details = await getMovieDetails(firstMovie.id);
      console.log('✅ Detalhes recebidos:', details.title);
      
      // Criar payload com todos os dados
      const payload: MoviePayload = {
        titulo: details.title || firstMovie.title,
        diretor: details.director || 'Diretor Desconhecido',
        ano: extractYear(details.release_date) || new Date().getFullYear(),
        genero: getGenreNames(details.genres),
        notaPessoal: details.vote_average ? Math.round(details.vote_average * 10) / 10 : undefined
      };
      
      console.log('💾 Salvando filme:', payload.titulo);
      
      // Adicionar filme diretamente ao banco
      await onImport(payload);
      
      // Limpar e fechar
      setSearchQuery('');
      setIsSearching(false);
      
      Alert.alert(
        '✅ Filme Adicionado!', 
        `"${payload.titulo}" foi adicionado à sua coleção.\n\n` +
        `📅 Ano: ${payload.ano}\n` +
        `🎬 Diretor: ${payload.diretor}\n` +
        `🎭 Gênero: ${payload.genero}\n` +
        `⭐ Nota: ${payload.notaPessoal ? payload.notaPessoal.toFixed(1) : 'Sem nota'}`,
        [
          {
            text: 'Ver na Lista',
            onPress: () => onClose()
          },
          {
            text: 'Buscar Outro',
            style: 'cancel'
          }
        ]
      );
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar/adicionar filme:', error);
      setIsSearching(false);
      Alert.alert(
        'Erro', 
        'Não foi possível adicionar o filme. Tente novamente.'
      );
    }
  };

  const handleClose = () => {
    if (!isSearching) {
      setSearchQuery('');
      setLastSearchedMovie(null);
      onClose();
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>🎬 Buscar Filme</Text>
            <Pressable onPress={handleClose} style={styles.closeButton} disabled={isSearching}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoText}>
                O primeiro resultado será adicionado automaticamente
              </Text>
            </View>

            <View style={styles.searchSection}>
              <TextInput
                style={styles.searchInput}
                placeholder="Ex.: Matrix, Inception..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                editable={!isSearching}
                returnKeyType="search"
              />
            </View>

            {isSearching ? (
              <View style={styles.searchingState}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.searchingText}>Buscando filme...</Text>
              </View>
            ) : lastSearchedMovie ? (
              <View style={styles.successState}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successText}>Adicionado:</Text>
                <Text style={styles.successMovie} numberOfLines={2}>"{lastSearchedMovie}"</Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🎥</Text>
                <Text style={styles.emptyText}>Experimente buscar:</Text>
                <View style={styles.examplesList}>
                  <Text style={styles.exampleText}>Matrix • Harry Potter</Text>
                  <Text style={styles.exampleText}>Inception • Avatar</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isSearching}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>Fechar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.searchButton, (!searchQuery.trim() || isSearching) && styles.buttonDisabled]}
              onPress={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.buttonText}>🔍 Buscar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 24, 16, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: '100%',
    maxWidth: 440,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    backgroundColor: colors.background
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    flex: 1,
    paddingRight: 12
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.surface
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center'
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
    fontWeight: '600'
  },
  searchSection: {
    marginBottom: 16
  },
  searchInput: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
    fontWeight: '500',
    height: 48
  },
  searchingState: {
    alignItems: 'center',
    paddingVertical: 30,
    minHeight: 120
  },
  searchingText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700'
  },
  successState: {
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.secondary,
    minHeight: 120
  },
  successIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  successText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600'
  },
  successMovie: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    paddingHorizontal: 10
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
    minHeight: 120
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 10
  },
  emptyText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 10
  },
  examplesList: {
    alignItems: 'center'
  },
  exampleText: {
    fontSize: 13,
    color: colors.textMuted,
    marginVertical: 2,
    fontWeight: '500'
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 10
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48
  },
  cancelButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.border
  },
  searchButton: {
    backgroundColor: colors.primary
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface
  },
  cancelText: {
    color: colors.text
  }
});

