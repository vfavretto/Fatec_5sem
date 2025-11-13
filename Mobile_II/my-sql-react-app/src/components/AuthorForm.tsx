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
import { Author, AuthorPayload } from '../types/author';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean;
  initialAuthor?: Author | null;
  onClose(): void;
  onSubmit(payload: AuthorPayload): Promise<void>;
  isSubmitting?: boolean;
};

type FormState = {
  nome: string;
  biografia: string;
  nacionalidade: string;
  anoNascimento: string;
};

const defaultState: FormState = {
  nome: '',
  biografia: '',
  nacionalidade: '',
  anoNascimento: ''
};

export function AuthorForm({ visible, initialAuthor, onClose, onSubmit, isSubmitting }: Props) {
  const [form, setForm] = useState<FormState>(defaultState);

  useEffect(() => {
    if (initialAuthor) {
      setForm({
        nome: initialAuthor.nome,
        biografia: initialAuthor.biografia ?? '',
        nacionalidade: initialAuthor.nacionalidade ?? '',
        anoNascimento: initialAuthor.anoNascimento ? String(initialAuthor.anoNascimento) : ''
      });
    } else {
      setForm(defaultState);
    }
  }, [initialAuthor, visible]);

  const title = useMemo(
    () => (initialAuthor ? 'Editar autor' : 'Novo autor'),
    [initialAuthor]
  );

  const handleSubmit = async () => {
    if (!form.nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do autor.');
      return;
    }

    let anoNumber: number | undefined;
    if (form.anoNascimento.trim().length > 0) {
      const parsed = Number(form.anoNascimento);
      if (Number.isNaN(parsed) || parsed < 1000 || parsed > new Date().getFullYear()) {
        Alert.alert('Atenção', 'Ano de nascimento inválido.');
        return;
      }
      anoNumber = parsed;
    }

    await onSubmit({
      nome: form.nome.trim(),
      biografia: form.biografia.trim() || undefined,
      nacionalidade: form.nacionalidade.trim() || undefined,
      anoNascimento: anoNumber
    });

    setForm(defaultState);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>{title}</Text>
          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Machado de Assis"
              value={form.nome}
              onChangeText={(value) => setForm((prev) => ({ ...prev, nome: value }))}
            />

            <Text style={styles.label}>Biografia (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Breve biografia do autor..."
              multiline
              numberOfLines={4}
              value={form.biografia}
              onChangeText={(value) => setForm((prev) => ({ ...prev, biografia: value }))}
            />

            <Text style={styles.label}>Nacionalidade (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Brasileiro"
              value={form.nacionalidade}
              onChangeText={(value) => setForm((prev) => ({ ...prev, nacionalidade: value }))}
            />

            <Text style={styles.label}>Ano de Nascimento (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 1839"
              keyboardType="number-pad"
              value={form.anoNascimento}
              onChangeText={(value) => setForm((prev) => ({ ...prev, anoNascimento: value }))}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top'
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

