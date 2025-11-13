import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Author } from '../types/author';
import { colors } from '../theme/colors';

type Props = {
  author: Author;
  onEdit(author: Author): void;
  onDelete(author: Author): void;
};

export function AuthorListItem({ author, onEdit, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{author.nome}</Text>
      </View>

      <View style={styles.details}>
        {author.nacionalidade && (
          <Text style={styles.detailText}>🌍 {author.nacionalidade}</Text>
        )}
        {author.anoNascimento && (
          <Text style={styles.detailText}>📅 {author.anoNascimento}</Text>
        )}
      </View>

      {author.biografia && (
        <Text style={styles.bio} numberOfLines={2}>
          {author.biografia}
        </Text>
      )}

      <View style={styles.actions}>
        <Pressable style={[styles.actionButton, styles.editButton]} onPress={() => onEdit(author)}>
          <Text style={[styles.actionText, styles.editText]}>Editar</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(author)}>
          <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3
  },
  header: {
    marginBottom: 8
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text
  },
  details: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary
  },
  bio: {
    marginTop: 4,
    marginBottom: 12,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700'
  },
  editText: {
    color: colors.surface
  },
  deleteText: {
    color: colors.surface
  }
});

