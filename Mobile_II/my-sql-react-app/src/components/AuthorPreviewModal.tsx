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
import { AuthorPayload } from '../types/author';

type Props = {
  visible: boolean;
  author: AuthorPayload | null;
  onClose(): void;
  onConfirm(): void;
  isSubmitting?: boolean;
};

export function AuthorPreviewModal({ visible, author, onClose, onConfirm, isSubmitting }: Props) {
  if (!author) return null;

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
              <Text style={styles.label}>📝 Nome</Text>
              <Text style={styles.value}>{author.nome}</Text>
            </View>

            {author.anoNascimento && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>📅 Ano de Nascimento</Text>
                <Text style={styles.value}>{author.anoNascimento}</Text>
              </View>
            )}

            {author.nacionalidade && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>🌍 Nacionalidade</Text>
                <Text style={styles.value}>{author.nacionalidade}</Text>
              </View>
            )}

            {author.biografia && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>📖 Biografia</Text>
                <Text style={styles.bioValue}>{author.biografia}</Text>
              </View>
            )}

            {!author.biografia && !author.nacionalidade && !author.anoNascimento && (
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningText}>
                  Apenas o nome do autor está disponível. Você pode editar depois para adicionar mais informações.
                </Text>
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
                <Text style={styles.buttonText}>✓ Cadastrar Autor</Text>
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
  bioValue: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'justify'
  },
  warningBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20
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

