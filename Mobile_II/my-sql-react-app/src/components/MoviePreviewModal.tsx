import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { colors } from '../theme/colors';
import { MoviePayload } from '../types/movie';

type Props = {
  visible: boolean;
  movie: MoviePayload | null;
  onClose(): void;
  onConfirm(): void;
  isSubmitting?: boolean;
};

export function MoviePreviewModal({ visible, movie, onClose, onConfirm, isSubmitting }: Props) {
  if (!movie) return null;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirmar Importação</Text>
            <Pressable onPress={onClose} style={styles.closeButton} disabled={isSubmitting}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.infoSection}>
              <Text style={styles.label}>🎬 Título</Text>
              <Text style={styles.value}>{movie.titulo}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>👤 Diretor</Text>
              <Text style={styles.value}>{movie.diretor}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>📅 Ano</Text>
              <Text style={styles.value}>{movie.ano}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>🎭 Gênero</Text>
              <Text style={styles.value}>{movie.genero}</Text>
            </View>

            {movie.notaPessoal !== undefined && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>⭐ Nota</Text>
                <Text style={styles.value}>{movie.notaPessoal.toFixed(1)}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton, isSubmitting && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.buttonText}>✓ Cadastrar Filme</Text>
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
    backgroundColor: 'rgba(44, 24, 16, 0.8)',
    justifyContent: 'center',
    padding: 20
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    maxHeight: '80%',
    borderWidth: 3,
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
    fontSize: 22,
    fontWeight: '800',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  infoSection: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 26
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
    borderTopWidth: 2,
    borderTopColor: colors.border
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50
  },
  cancelButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.border
  },
  confirmButton: {
    backgroundColor: colors.primary
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.surface
  },
  cancelText: {
    color: colors.text
  }
});

