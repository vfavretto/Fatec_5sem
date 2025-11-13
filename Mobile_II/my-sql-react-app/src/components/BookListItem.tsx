import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Book } from '../types/book';
import { colors } from '../theme/colors';

type Props = {
  book: Book;
  onEdit(book: Book): void;
  onDelete(book: Book): void;
};

export function BookListItem({ book, onEdit, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{book.titulo}</Text>
        <View style={[styles.statusChip, book.status === 'lido' ? styles.statusChipSuccess : styles.statusChipInfo]}>
          <Text style={styles.statusChipText}>{book.status === 'lido' ? 'Lido' : 'Planejado'}</Text>
        </View>
      </View>
      <Text style={styles.author}>por {book.autor}</Text>

      <View style={styles.footer}>
        {typeof book.nota === 'number' && (
          <View style={styles.rating}>
            <Text style={styles.ratingLabel}>Nota</Text>
            <Text style={styles.ratingValue}>{book.nota.toFixed(1)}</Text>
          </View>
        )}
        <View style={styles.actions}>
          <Pressable style={[styles.actionButton, styles.editButton]} onPress={() => onEdit(book)}>
            <Text style={[styles.actionText, styles.editText]}>Editar</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(book)}>
            <Text style={[styles.actionText, styles.deleteText]}>Excluir</Text>
          </Pressable>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8
  },
  author: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 15
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  statusChipSuccess: {
    backgroundColor: '#D4EDDA',
  },
  statusChipInfo: {
    backgroundColor: '#D1ECF1',
  },
  statusChipText: {
    fontWeight: '700',
    color: colors.text,
    textTransform: 'capitalize'
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingLabel: {
    color: colors.textMuted,
    marginRight: 6,
    fontSize: 14
  },
  ratingValue: {
    fontWeight: '700',
    color: colors.secondary,
    fontSize: 16
  },
  actions: {
    flexDirection: 'row'
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8
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

