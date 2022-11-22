import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Linking,
  TextInput,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUser } from '../../redux/features/firebase/firebaseSlice';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { CHANGE_LOADING } from '../../redux/features/loadingSlice';
import AlertModal from '../../components/modals/AlertModal';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  getDatabase,
  ref,
  child,
  get,
  push,
  set,
  onValue,
  orderByChild,
  orderByValue,
  query,
  equalTo,
} from 'firebase/database';
import { async } from '@firebase/util';
import * as firebase from 'firebase/app';
import firebaseAuth from '../../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { snapshotToArray } from '../../firebase/helpers';

const HomeScreen = () => {
  const [message, setMessage] = useState('');
  const [isAddNewListVisible, setIsAddNewListVisible] = useState(false);

  const [isAddNewList, setIsAddNewList] = useState('');
  const [isTotalCount, setIsTotalCount] = useState(0);
  const [isHaciendoCount, setIsHaciendoCount] = useState(0);
  const [isHechoCount, setIsHechoCount] = useState(0);
  const [isLista, setLista] = useState([]);
  const [isListaHaciendo, setListaHaciendo] = useState([]);
  const [isListaHecho, setListaHecho] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState('');

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.value);
  const navigation = useNavigation();

  const errorMessage = useSelector(
    (state) => state.firebaseStore.error.errorBody
  );

  const handleSignOut = () => {
    console.log('cerrando sesión...');
    dispatch(CHANGE_LOADING(true));
    dispatch(signOutUser()).then(() => {
      setMessage('Se cerró la sesión!');
      dispatch(CHANGE_LOADING(false));
    });
  };

  const handleRequestClose = () => {
    setMessage('');
  };

  const showAddNewList = () => {
    setIsAddNewListVisible(true);
  };

  const hideAddNewList = () => {
    setIsAddNewListVisible(false);
  };

  const addNewList = async (lista) => {
    try {
      const db = getDatabase();

      // const mostViewedPosts = query(
      //   ref(db, `listas/${isCurrentUser}/${key}`),
      //   orderByValue('book'),
      //   equalTo(lista)
      // );
      // const snapshot = await firebase
      //   .database()
      //   .ref('listas')
      //   .child(isCurrentUser)
      //   .orderByChild('book')
      //   .equalTo(lista)
      //   .once('value');

      // if (snapshot.exists()) {
      //   console.log('unable to add as book already exists');
      // } else {
      //   console.log('fk');
      // }

      const key = push(child(ref(db), 'listas/' + isCurrentUser)).key;

      console.log(key);

      set(ref(db, 'listas/' + isCurrentUser + '/' + key), {
        lista: lista,
        read: false,
      });

      // const response = await firebase
      //   .database()
      //   .ref('listas')
      //   .child(isCurrentUser.uid)
      //   .child(key)
      //   .set({ titulo: lista, hecho: false });

      // const db = getDatabase();
      // set(ref(db, 'users/' + userCredential.user.uid), {
      //   email: userCredential.user.email,
      //   uid: userCredential.user.uid,
      // });

      setIsAddNewListVisible(false);
    } catch (error) {
      console.log(error);
    }

    setLista((isLista) => [...isLista, lista]);
    setListaHaciendo((isListaHaciendo) => [...isListaHaciendo, lista]);
    setIsTotalCount(isTotalCount + 1);
    setIsHaciendoCount(isHaciendoCount + 1);
    console.log(isLista);
  };

  const marcarComoLeido = (listaSeleccionada, index) => {
    let nuevaLista = isLista.filter((lista) => lista !== listaSeleccionada);
    let nuevaListaHaciendo = isListaHaciendo.filter(
      (lista) => lista !== listaSeleccionada
    );
    setLista(nuevaLista);
    setListaHaciendo(nuevaListaHaciendo);
    setListaHecho((isListaHecho) => [...isListaHecho, listaSeleccionada]);
    // setIsHaciendoCount(isHaciendoCount - 1);
    // setIsHechoCount(isHechoCount + 1);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setIsCurrentUser(uid);

        // ...
      } else {
        // User is signed out
        // ...
      }
    });

    const db = getDatabase();

    // const listas = push(child(ref(db), 'listas/' + isCurrentUser));

    const dbRef = ref(getDatabase());
    let returnArr = [];
    get(child(dbRef, `listas/${isCurrentUser}`))
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          let item = childSnapshot.val();
          item.key = childSnapshot.key;
          returnArr.push(item);
        });
        setLista(returnArr);
        // if (snapshot.exists()) {
        //   let item = snapshot.val();
        //   item.key = snapshot.key;
        //   returnArr.push(item);
        //   console.log(snapshot.val());
        //   console.log(snapshot.key);
        //   // setLista(returnArr);
        // } else {
        //   console.log('No data available');
        // }
      })
      .catch((error) => {
        console.error(error);
      });

    // const listasArray = snapshotToArray(listas);

    // setLista(listasArray);

    // const dbRef = ref(getDatabase());
    // get(child(dbRef, `listas/${isCurrentUser}`))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       console.log(snapshot.val());
    //       returnArr.push(snapshot.val());
    //       console.log(isLista.book);
    //     } else {
    //       console.log('No data available');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     // User logged in already or has just logged in.
    //     console.log(user.uid);
    //   } else {
    //     // User not logged in or has just logged out.
    //   }
    // });
    // async () => {
    //   const userCredential = await firebaseAuth.getCurrentUser();
    //   setIsCurrentUser(userCredential.user.uid);
    // };
    // const userCredential = firebaseAuth.getCurrentUser();
    // setIsCurrentUser(userCredential.user.uid);
    // console.log(isCurrentUser);
    // console.log(uid);
  });

  const renderLista = (item, index) => (
    <View
      style={{
        height: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '79%',
      }}
    >
      <View
        style={{
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white' }}> {item.lista} </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#a5deba',
          alignContent: 'center',
          justifyContent: 'center',
          width: 100,
        }}
        onPress={() => marcarComoLeido(item, index)}
      >
        <Text style={{ textAlign: 'center' }}>Mark as read</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' hidden={false} translucent={true} />
      {isAddNewListVisible ? (
        <View style={{ flexDirection: 'row', height: 30 }}>
          <TextInput
            onChangeText={(text) => setIsAddNewList(text)}
            placeholder='Insertar titulo de lista'
            placeholderTextColor='white'
            color='white'
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#a5deba',
              alignContent: 'center',
              justifyContent: 'center',
              width: 25,
            }}
            onPress={() => addNewList(isAddNewList)}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='ios-checkmark' color='white' size={15} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#deada5',
              alignContent: 'center',
              justifyContent: 'center',
              width: 25,
            }}
            onPress={hideAddNewList}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name='ios-close' color='white' size={15} />
            </View>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={isLista}
        renderItem={({ item }, index) => renderLista(item, index)}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={{ marginTop: 50, alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>
              No hay nada agregado a la lista...
            </Text>
          </View>
        }
      />

      <TouchableOpacity onPress={showAddNewList}>
        <View>
          <Text style={{ color: 'white', fontSize: 30 }}>+</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.tabContainer}>
        <View
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'white',
            borderWidth: 2,
          }}
        >
          <Text style={{ color: 'white' }}>Lista</Text>
          <Text style={{ color: 'white' }}>{isLista.length}</Text>
        </View>
        <TouchableOpacity
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'grey',
            borderWidth: 1,
          }}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Haciendo')}
        >
          <Text style={{ color: 'white' }}>Haciendo</Text>
          <Text style={{ color: 'white' }}>{isListaHaciendo.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'grey',
            borderWidth: 1,
          }}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Hecho')}
        >
          <Text style={{ color: 'white' }}>Hecho</Text>
          <Text style={{ color: 'white' }}>{isListaHecho.length}</Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton
        text={'Log Out'}
        allowed={true}
        useIndicator={isLoading}
        handlePress={handleSignOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    color: 'white',
  },
  imageContainer: {
    height: '100%',
    width: 'auto',
    aspectRatio: 1079 / 1080,
    borderRadius: 10,
  },
  textStyle: {
    color: 'white',
    fontSize: 25,
    marginVertical: 20,
  },
  instaContainer: {
    height: Dimensions.get('window').width - 40,
    width: Dimensions.get('window').width - 40,
    marginVertical: 30,
  },
  ORContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  lineContainer: {
    borderBottomColor: '#806e6c',
    borderBottomWidth: 1,
    flex: 1,
  },
  tabContainer: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  subTabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 50,
  },
});

export default HomeScreen;
