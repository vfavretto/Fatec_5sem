import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';
import { DATABASE_OPTIONS } from '../types/database';

export function SplashScreen() {
  const { selectDatabase } = useDatabase();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={require('../../assets/splash-icon.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Biblioteca Inteligente</Text>
      <Text style={styles.subtitle}>Escolha onde quer guardar seus livros antes de começar.</Text>

      <View style={styles.options}>
        {DATABASE_OPTIONS.map((option) => (
          <Pressable key={option.key} style={styles.optionCard} onPress={() => selectDatabase(option.key)}>
            <Text style={styles.optionTitle}>{option.label}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center'
  },
  subtitle: {
    color: '#CBD5F5',
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center'
  },
  options: {
    width: '100%',
    marginTop: 36
  },
  optionCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)'
  },
  optionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700'
  },
  optionDescription: {
    color: '#CBD5F5',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20
  }
});

