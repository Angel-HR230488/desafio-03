import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Portal, Dialog, IconButton } from 'react-native-paper';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const BookFormScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const isEditing = route.params?.bookId;
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('to-read');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comment, setComment] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadBook();
    }
  }, [isEditing]);

  const loadBook = async () => {
    try {
      const bookDoc = await getDoc(doc(db, 'books', route.params.bookId));
      if (bookDoc.exists()) {
        const data = bookDoc.data();
        setTitle(data.title);
        setAuthor(data.author);
        setStatus(data.status);
        setStartDate(data.startDate || '');
        setEndDate(data.endDate || '');
        setComment(data.comment || '');
      }
    } catch (error) {
      console.error('Error al cargar el libro:', error);
      Alert.alert('Error', 'No se pudo cargar la información del libro');
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('El título es obligatorio');
      return false;
    }
    if (!author.trim()) {
      setError('El autor es obligatorio');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const bookData = {
        title: title.trim(),
        author: author.trim(),
        status,
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        comment: comment.trim(),
        userId: user.uid,
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        // Actualizar libro existente
        await setDoc(doc(db, 'books', route.params.bookId), bookData, { merge: true });
      } else {
        // Crear nuevo libro
        const newBookRef = doc(collection(db, 'books'));
        bookData.createdAt = new Date().toISOString();
        await setDoc(newBookRef, bookData);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar el libro:', error);
      Alert.alert('Error', 'No se pudo guardar el libro');
    } finally {
      setLoading(false);
    }
  };

  const handleDatePress = (type) => {
    setDateType(type);
    setShowDatePicker(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? 'Editar Libro' : 'Agregar Nuevo Libro'}
      </Text>

      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Autor"
        value={author}
        onChangeText={setAuthor}
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.label}>Estado</Text>
      <SegmentedButtons
        value={status}
        onValueChange={setStatus}
        buttons={[
          { value: 'to-read', label: 'Por leer' },
          { value: 'reading', label: 'Leyendo' },
          { value: 'completed', label: 'Completado' },
        ]}
        style={styles.segmentedButtons}
      />

      <View style={styles.dateContainer}>
        <TextInput
          label="Fecha de inicio"
          value={startDate}
          onChangeText={setStartDate}
          mode="outlined"
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={() => handleDatePress('start')}
            />
          }
        />

        <TextInput
          label="Fecha de finalización"
          value={endDate}
          onChangeText={setEndDate}
          mode="outlined"
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={() => handleDatePress('end')}
            />
          }
        />
      </View>

      <TextInput
        label="Comentarios"
        value={comment}
        onChangeText={setComment}
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={4}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        {isEditing ? 'Guardar Cambios' : 'Agregar Libro'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateInput: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 16,
  },
  error: {
    color: '#FF5252',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 