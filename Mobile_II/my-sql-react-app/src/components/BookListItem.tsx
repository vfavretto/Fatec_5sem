import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Book } from '../types/book';

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
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
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
    color: '#111827',
    flex: 1,
    marginRight: 8
  },
  author: {
    marginTop: 6,
    color: '#4B5563',
    fontSize: 15
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  statusChipSuccess: {
    backgroundColor: '#DCFCE7'
  },
  statusChipInfo: {
    backgroundColor: '#DBEAFE'
  },
  statusChipText: {
    fontWeight: '600',
    color: '#1F2937',
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
    color: '#6B7280',
    marginRight: 6,
    fontSize: 14
  },
  ratingValue: {
    fontWeight: '700',
    color: '#111827',
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
    backgroundColor: '#EFF6FF'
  },
  deleteButton: {
    backgroundColor: '#FEE2E2'
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600'
  },
  editText: {
    color: '#1D4ED8'
  },
  deleteText: {
    color: '#DC2626'
  }
});

