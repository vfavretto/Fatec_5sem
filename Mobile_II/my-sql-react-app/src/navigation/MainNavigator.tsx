import { useState } from 'react';
import { BookListScreen } from '../screens/BookListScreen';
import { AuthorsScreen } from '../screens/AuthorsScreen';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Screen = 'books' | 'authors';

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
          style={[styles.tab, currentScreen === 'authors' && styles.tabActive]}
          onPress={() => setCurrentScreen('authors')}
        >
          <Text style={styles.tabIcon}>✍️</Text>
          <Text style={[styles.tabText, currentScreen === 'authors' && styles.tabTextActive]}>
            Autores
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {currentScreen === 'books' ? <BookListScreen /> : <AuthorsScreen />}
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

