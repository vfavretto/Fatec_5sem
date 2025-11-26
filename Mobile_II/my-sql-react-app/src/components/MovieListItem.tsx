import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Movie } from '../types/movie';
import { colors } from '../theme/colors';

type Props = {
  movie: Movie;
  onEdit(movie: Movie): void;
  onDelete(movie: Movie): void;
};

export function MovieListItem({ movie, onEdit, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{movie.titulo}</Text>
          {movie.notaPessoal !== undefined && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {movie.notaPessoal.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>🎬 {movie.diretor}</Text>
        <Text style={styles.detailText}>📅 {movie.ano}</Text>
        <Text style={styles.detailText}>🎭 {movie.genero}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.actionButton, styles.editButton]} onPress={() => onEdit(movie)}>
          <Text style={[styles.actionText, styles.editText]}>Editar</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(movie)}>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text
  },
  ratingBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary
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

