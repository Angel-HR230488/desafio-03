import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Chip, Card, IconButton, Portal, Dialog } from 'react-native-paper';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const BookDetailsScreen = ({ navigation, route }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const { bookId } = route.params;
  const { user } = useAuth();

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      const bookDoc = await getDoc(doc(db, 'books', bookId));
      if (bookDoc.exists()) {
        setBook({ id: bookDoc.id, ...bookDoc.data() });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar el libro:', error);
      Alert.alert('Error', 'No se pudo cargar la información del libro');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'books', bookId));
      navigation.goBack();
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      Alert.alert('Error', 'No se pudo eliminar el libro');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reading':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'to-read':
        return '#FFC107';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'reading':
        return 'Leyendo';
      case 'completed':
        return 'Completado';
      case 'to-read':
        return 'Por leer';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.centerContainer}>
        <Text>No se encontró el libro</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.title}>{book.title}</Text>
            <IconButton
              icon="pencil"
              onPress={() => navigation.navigate('EditBook', { bookId: book.id })}
            />
          </View>
          
          <Text style={styles.author}>por {book.author}</Text>

          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(book.status) }]}
            textStyle={{ color: 'white' }}
          >
            {getStatusText(book.status)}
          </Chip>

          {book.startDate && (
            <View style={styles.infoSection}>
              <Text style={styles.label}>Fecha de inicio:</Text>
              <Text>{book.startDate}</Text>
            </View>
          )}

          {book.endDate && (
            <View style={styles.infoSection}>
              <Text style={styles.label}>Fecha de finalización:</Text>
              <Text>{book.endDate}</Text>
            </View>
          )}

          {book.comment && (
            <View style={styles.infoSection}>
              <Text style={styles.label}>Comentarios:</Text>
              <Text style={styles.comment}>{book.comment}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => setDeleteDialogVisible(true)}
        style={styles.deleteButton}
        buttonColor="#FF5252"
      >
        Eliminar Libro
      </Button>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Eliminar Libro</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro que deseas eliminar este libro?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleDelete}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginVertical: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginVertical: 12,
  },
  infoSection: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  comment: {
    fontSize: 16,
    lineHeight: 24,
  },
  deleteButton: {
    margin: 16,
  },
}); 