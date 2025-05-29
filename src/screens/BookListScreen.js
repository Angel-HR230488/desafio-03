import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Card, Chip, Button, Searchbar } from 'react-native-paper';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const BookListScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'books'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const booksData = [];
      querySnapshot.forEach((doc) => {
        booksData.push({ id: doc.id, ...doc.data() });
      });
      setBooks(booksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

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

  const filteredBooks = books.filter(book => {
    const matchesFilter = selectedFilter === 'all' || book.status === selectedFilter;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderBook = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('BookDetails', { bookId: item.id })}
    >
      <Card.Content>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Chip
          style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
          textStyle={{ color: 'white' }}
        >
          {getStatusText(item.status)}
        </Chip>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Libros</Text>
        <Button onPress={logout}>Cerrar Sesión</Button>
      </View>

      <Searchbar
        placeholder="Buscar libros..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => setSelectedFilter('all')}
          style={styles.filterChip}
        >
          Todos
        </Chip>
        <Chip
          selected={selectedFilter === 'reading'}
          onPress={() => setSelectedFilter('reading')}
          style={styles.filterChip}
        >
          Leyendo
        </Chip>
        <Chip
          selected={selectedFilter === 'completed'}
          onPress={() => setSelectedFilter('completed')}
          style={styles.filterChip}
        >
          Completados
        </Chip>
        <Chip
          selected={selectedFilter === 'to-read'}
          onPress={() => setSelectedFilter('to-read')}
          style={styles.filterChip}
        >
          Por leer
        </Chip>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text>Cargando libros...</Text>
        </View>
      ) : filteredBooks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text>No hay libros para mostrar</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddBook')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    margin: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 