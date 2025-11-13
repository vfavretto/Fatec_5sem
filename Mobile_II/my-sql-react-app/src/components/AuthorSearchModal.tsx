import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { colors } from '../theme/colors';
import {
  searchAuthors,
  getAuthorDetails,
  extractBio,
  extractBirthYear,
  OpenLibraryAuthor
} from '../api/openLibrary';
import { AuthorPayload } from '../types/author';
import { AuthorPreviewModal } from './AuthorPreviewModal';

type Props = {
  visible: boolean;
  onClose(): void;
  onImport(payload: AuthorPayload): void;
};

type SearchResultItem = {
  key: string;
  name: string;
  birth_date?: string;
  work_count?: number;
};

export function AuthorSearchModal({ visible, onClose, onImport }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [previewAuthor, setPreviewAuthor] = useState<AuthorPayload | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Atenção', 'Digite um nome para buscar.');
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchAuthors(searchQuery);
      setResults(data.docs.slice(0, 10));
      if (data.docs.length === 0) {
        Alert.alert('Sem resultados', 'Nenhum autor encontrado com esse nome.');
      }
    } catch (error: any) {
      console.error('Erro ao buscar autores:', error);
      Alert.alert(
        'Erro de Conexão', 
        `Não foi possível acessar a Open Library API.\n\nDetalhes: ${error.message}\n\nVerifique sua conexão com a internet e tente novamente.`
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (authorKey: string, authorName: string) => {
    setIsLoadingDetails(true);
    try {
      const details: OpenLibraryAuthor = await getAuthorDetails(authorKey);
      
      const payload: AuthorPayload = {
        nome: details.name || authorName,
        biografia: extractBio(details.bio),
        nacionalidade: undefined,
        anoNascimento: extractBirthYear(details.birth_date)
      };
      
      setPreviewAuthor(payload);
      setIsPreviewVisible(true);
    } catch (error: any) {
      console.error('Erro ao buscar detalhes:', error);
      Alert.alert('Erro', `Não foi possível buscar os detalhes do autor.\n\n${error.message}`);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewAuthor) return;
    
    setIsSaving(true);
    try {
      await onImport(previewAuthor);
      
      // Limpar tudo e fechar
      setIsPreviewVisible(false);
      setPreviewAuthor(null);
      setSearchQuery('');
      setResults([]);
      onClose();
      
      Alert.alert('Sucesso', `Autor "${previewAuthor.nome}" cadastrado com sucesso!`);
    } catch (error) {
      console.error('Erro ao cadastrar autor:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o autor.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewVisible(false);
    setPreviewAuthor(null);
  };

  const handleClose = () => {
    setSearchQuery('');
    setResults([]);
    onClose();
  };

  return (
    <>
      <Modal animationType="slide" transparent visible={visible} onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Buscar Autor na Open Library</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.searchSection}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ex.: Machado de Assis, J.K. Rowling..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              editable={!isSearching && !isLoadingDetails}
            />
            <Pressable
              style={[styles.searchButton, (isSearching || isLoadingDetails) && styles.buttonDisabled]}
              onPress={handleSearch}
              disabled={isSearching || isLoadingDetails}
            >
              {isSearching ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.searchButtonText}>🔍 Buscar</Text>
              )}
            </Pressable>
          </View>

          <ScrollView style={styles.resultsContainer}>
            {isLoadingDetails && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Importando detalhes...</Text>
              </View>
            )}

            {results.length > 0 && (
              <View style={styles.resultsList}>
                <Text style={styles.resultsTitle}>
                  {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </Text>
                {results.map((author) => (
                  <View key={author.key} style={styles.resultCard}>
                    <View style={styles.resultInfo}>
                      <Text style={styles.authorName}>{author.name}</Text>
                      {author.birth_date && (
                        <Text style={styles.authorDetail}>📅 {author.birth_date}</Text>
                      )}
                      {author.work_count && (
                        <Text style={styles.authorDetail}>📚 {author.work_count} obras</Text>
                      )}
                    </View>
                    <Pressable
                      style={[styles.importButton, isLoadingDetails && styles.buttonDisabled]}
                      onPress={() => handleImport(author.key, author.name)}
                      disabled={isLoadingDetails}
                    >
                      <Text style={styles.importButtonText}>Importar</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {!isSearching && results.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>
                  Busque autores na Open Library e importe diretamente para sua biblioteca
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>

    <AuthorPreviewModal
      visible={isPreviewVisible}
      author={previewAuthor}
      onClose={handleClosePreview}
      onConfirm={handleConfirmImport}
      isSubmitting={isSaving}
    />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 24, 16, 0.7)',
    justifyContent: 'center',
    padding: 16
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    maxHeight: '85%',
    borderWidth: 2,
    borderColor: colors.secondary
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.border
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    flex: 1
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  searchSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 12
  },
  searchInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    minWidth: 100
  },
  searchButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 241, 232, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 12,
    margin: 20
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600'
  },
  resultsList: {
    paddingBottom: 20
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center'
  },
  resultInfo: {
    flex: 1,
    marginRight: 12
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4
  },
  authorDetail: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2
  },
  importButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  importButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22
  }
});

