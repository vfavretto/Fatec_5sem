import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Movie, MoviePayload } from '../types/movie';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean;
  initialMovie?: Movie | null;
  onClose(): void;
  onSubmit(payload: MoviePayload): Promise<void>;
  isSubmitting?: boolean;
};

type FormState = {
  titulo: string;
  diretor: string;
  ano: string;
  genero: string;
  notaPessoal: string;
};

const defaultState: FormState = {
  titulo: '',
  diretor: '',
  ano: '',
  genero: '',
  notaPessoal: ''
};

export function MovieForm({ visible, initialMovie, onClose, onSubmit, isSubmitting }: Props) {
  const [form, setForm] = useState<FormState>(defaultState);

  useEffect(() => {
    if (initialMovie) {
      setForm({
        titulo: initialMovie.titulo,
        diretor: initialMovie.diretor,
        ano: String(initialMovie.ano),
        genero: initialMovie.genero,
        notaPessoal: initialMovie.notaPessoal ? String(initialMovie.notaPessoal) : ''
      });
    } else {
      setForm(defaultState);
    }
  }, [initialMovie, visible]);

  const title = useMemo(
    () => (initialMovie ? 'Editar filme' : 'Novo filme'),
    [initialMovie]
  );

  const handleSubmit = async () => {
    if (!form.titulo.trim()) {
      Alert.alert('Atenção', 'Informe o título do filme.');
      return;
    }

    if (!form.diretor.trim()) {
      Alert.alert('Atenção', 'Informe o diretor do filme.');
      return;
    }

    if (!form.ano.trim()) {
      Alert.alert('Atenção', 'Informe o ano do filme.');
      return;
    }

    const anoNumber = Number(form.ano);
    if (Number.isNaN(anoNumber) || anoNumber < 1888 || anoNumber > new Date().getFullYear() + 5) {
      Alert.alert('Atenção', 'Ano inválido. Deve estar entre 1888 e ' + (new Date().getFullYear() + 5));
      return;
    }

    if (!form.genero.trim()) {
      Alert.alert('Atenção', 'Informe o gênero do filme.');
      return;
    }

    let notaNumber: number | undefined;
    if (form.notaPessoal.trim().length > 0) {
      const parsed = Number(form.notaPessoal);
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 10) {
        Alert.alert('Atenção', 'Nota pessoal deve estar entre 0 e 10.');
        return;
      }
      notaNumber = parsed;
    }

    await onSubmit({
      titulo: form.titulo.trim(),
      diretor: form.diretor.trim(),
      ano: anoNumber,
      genero: form.genero.trim(),
      notaPessoal: notaNumber
    });

    setForm(defaultState);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>{title}</Text>
          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: O Poderoso Chefão"
              value={form.titulo}
              onChangeText={(value) => setForm((prev) => ({ ...prev, titulo: value }))}
            />

            <Text style={styles.label}>Diretor</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Francis Ford Coppola"
              value={form.diretor}
              onChangeText={(value) => setForm((prev) => ({ ...prev, diretor: value }))}
            />

            <Text style={styles.label}>Ano</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 1972"
              keyboardType="number-pad"
              value={form.ano}
              onChangeText={(value) => setForm((prev) => ({ ...prev, ano: value }))}
            />

            <Text style={styles.label}>Gênero</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Drama, Ação, Comédia"
              value={form.genero}
              onChangeText={(value) => setForm((prev) => ({ ...prev, genero: value }))}
            />

            <Text style={styles.label}>Minha Nota (0-10) - Opcional</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 8.5"
              keyboardType="decimal-pad"
              value={form.notaPessoal}
              onChangeText={(value) => setForm((prev) => ({ ...prev, notaPessoal: value }))}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={isSubmitting}>
              <Text style={[styles.buttonText, styles.cancelText]}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>{isSubmitting ? 'Salvando...' : 'Salvar'}</Text>
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
    backgroundColor: 'rgba(44, 24, 16, 0.6)',
    justifyContent: 'center',
    padding: 16
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: colors.border
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 20,
    color: colors.primary
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 12
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 6
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    gap: 12
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10
  },
  cancelButton: {
    backgroundColor: colors.surfaceAlt
  },
  saveButton: {
    backgroundColor: colors.primary
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface
  },
  cancelText: {
    color: colors.text
  }
});

