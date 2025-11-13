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
import { Book, BookPayload, BookStatus } from '../types/book';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean;
  initialBook?: Book | null;
  onClose(): void;
  onSubmit(payload: BookPayload): Promise<void>;
  isSubmitting?: boolean;
};

type FormState = {
  titulo: string;
  autor: string;
  status: BookStatus;
  nota: string;
};

const STATUS_OPTIONS: Array<{ value: BookStatus; label: string }> = [
  { value: 'planejado', label: 'Planejado' },
  { value: 'lido', label: 'Lido' }
];

const defaultState: FormState = {
  titulo: '',
  autor: '',
  status: 'planejado',
  nota: ''
};

export function BookForm({ visible, initialBook, onClose, onSubmit, isSubmitting }: Props) {
  const [form, setForm] = useState<FormState>(defaultState);

  useEffect(() => {
    if (initialBook) {
      setForm({
        titulo: initialBook.titulo,
        autor: initialBook.autor,
        status: initialBook.status,
        nota: typeof initialBook.nota === 'number' ? String(initialBook.nota) : ''
      });
    } else {
      setForm(defaultState);
    }
  }, [initialBook, visible]);

  const title = useMemo(
    () => (initialBook ? 'Editar livro' : 'Novo livro'),
    [initialBook]
  );

  const handleSubmit = async () => {
    if (!form.titulo.trim() || !form.autor.trim()) {
      Alert.alert('Atenção', 'Informe título e autor do livro.');
      return;
    }

    let notaNumber: number | undefined;
    if (form.nota.trim().length > 0) {
      const parsed = Number(form.nota.replace(',', '.'));
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 5) {
        Alert.alert('Atenção', 'A nota deve ser um número entre 0 e 5.');
        return;
      }
      notaNumber = parsed;
    }

    await onSubmit({
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      status: form.status,
      nota: notaNumber
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
              placeholder="Ex.: O Hobbit"
              value={form.titulo}
              onChangeText={(value) => setForm((prev) => ({ ...prev, titulo: value }))}
            />

            <Text style={styles.label}>Autor</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: J.R.R. Tolkien"
              value={form.autor}
              onChangeText={(value) => setForm((prev) => ({ ...prev, autor: value }))}
            />

            <Text style={styles.label}>Status</Text>
            <View style={styles.statusGroup}>
              {STATUS_OPTIONS.map((option, index) => {
                const isActive = form.status === option.value;
                return (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.statusButton,
                      index !== STATUS_OPTIONS.length - 1 && styles.statusButtonSpacing,
                      isActive && styles.statusButtonActive
                    ]}
                    onPress={() => setForm((prev) => ({ ...prev, status: option.value }))}
                  >
                    <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Nota (0 a 5)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 4.5"
              keyboardType="decimal-pad"
              value={form.nota}
              onChangeText={(value) => setForm((prev) => ({ ...prev, nota: value }))}
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
  statusGroup: {
    flexDirection: 'row'
  },
  statusButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.background
  },
  statusButtonSpacing: {
    marginRight: 12
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  statusText: {
    color: colors.text,
    fontWeight: '600'
  },
  statusTextActive: {
    color: colors.surface
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

