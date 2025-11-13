import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';
import { DATABASE_OPTIONS } from '../types/database';
import { colors } from '../theme/colors';
import { useEffect, useRef } from 'react';

type Props = {
  onContinue: () => void;
};

export function SplashScreen({ onContinue }: Props) {
  const { selectDatabase, selectedDatabase } = useDatabase();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSelectDatabase = async (key: 'mongo' | 'sqlite') => {
    await selectDatabase(key);
    onContinue();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.bookIcon}>📚</Text>
          <View style={styles.decorativeLine} />
        </View>
        
        <Text style={styles.title}>Biblioteca Pessoal</Text>
        <Text style={styles.subtitle}>Organize seus livros, planeje leituras e acompanhe autores favoritos</Text>

        <View style={styles.options}>
          <Text style={styles.chooseText}>Escolha seu armazenamento:</Text>
          {DATABASE_OPTIONS.map((option) => (
            <Pressable 
              key={option.key} 
              style={styles.optionCard} 
              onPress={() => handleSelectDatabase(option.key)}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.iconText}>{option.key === 'mongo' ? '☁️' : '💾'}</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          ))}
        </View>

        {selectedDatabase && (
          <Pressable style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueText}>Continuar com {selectedDatabase === 'mongo' ? 'MongoDB' : 'SQLite'}</Text>
          </Pressable>
        )}
      </Animated.View>
      
      <Text style={styles.footer}>Sua biblioteca digital completa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bookIcon: {
    fontSize: 80,
    marginBottom: 12,
  },
  decorativeLine: {
    width: 120,
    height: 3,
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
  title: {
    color: colors.secondary,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.secondaryLight,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  options: {
    width: '100%',
    marginTop: 40,
  },
  chooseText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: '700',
  },
  optionDescription: {
    color: colors.secondaryLight,
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  arrow: {
    color: colors.secondary,
    fontSize: 24,
    fontWeight: '600',
  },
  continueButton: {
    marginTop: 24,
    backgroundColor: colors.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  continueText: {
    color: colors.splashBg,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    color: colors.secondaryLight,
    fontSize: 12,
    opacity: 0.6,
  },
});

