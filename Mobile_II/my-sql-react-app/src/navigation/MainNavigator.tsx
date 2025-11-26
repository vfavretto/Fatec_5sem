import { useState } from 'react';
import { BookListScreen } from '../screens/BookListScreen';
import { MoviesScreen } from '../screens/MoviesScreen';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Screen = 'books' | 'movies';

export function MainNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('books');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, currentScreen === 'books' && styles.tabActive]}
          onPress={() => setCurrentScreen('books')}
        >
          <Text style={styles.tabIcon}>📚</Text>
          <Text style={[styles.tabText, currentScreen === 'books' && styles.tabTextActive]}>
            Livros
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, currentScreen === 'movies' && styles.tabActive]}
          onPress={() => setCurrentScreen('movies')}
        >
          <Text style={styles.tabIcon}>🎬</Text>
          <Text style={[styles.tabText, currentScreen === 'movies' && styles.tabTextActive]}>
            Filmes
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {currentScreen === 'books' ? <BookListScreen /> : <MoviesScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingTop: 40,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
});

