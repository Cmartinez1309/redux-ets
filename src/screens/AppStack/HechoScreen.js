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
  SafeAreaView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
  update,
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
import * as Animatable from 'react-native-animatable';

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

  let textInputRef = null;

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

  // const UploadScreen = () => {
  //   const [image, setImage] = useState(null);
  //   const [uploading, setUploading] = useState(false);

  //   const pickImage = async() => {
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.launchImageLibraryAsync
  //     })
  //   }
  // }

  const addNewList = async (lista) => {
    setIsAddNewList('');
    textInputRef.setNativeProps({ text: '' });
    try {
      const db = getDatabase();

      const key = push(child(ref(db), 'listas/' + isCurrentUser)).key;

      console.log(key);

      set(ref(db, 'listas/' + isCurrentUser + '/' + key), {
        lista: lista,
        read: false,
      });

      setIsAddNewListVisible(false);
    } catch (error) {
      console.log(error);
    }

    // setLista((isLista) => [...isLista, lista]);
    // setListaHaciendo((isListaHaciendo) => [...isListaHaciendo, lista]);
    // setIsTotalCount(isTotalCount + 1);
    // setIsHaciendoCount(isHaciendoCount + 1);
    // console.log(isLista);
  };

  const marcarComoLeido = async (listaSeleccionada, index) => {
    try {
      const db = getDatabase();

      update(ref(db, 'listas/' + isCurrentUser + '/' + listaSeleccionada.key), {
        read: true,
      });

      let nuevaLista = isLista.map((lista) => {
        if (lista.lista == listaSeleccionada.lista) {
          return { ...lista, read: true };
        }
        return lista;
      });
      let nuevaListaHaciendo = isListaHaciendo.filter(
        (lista) => lista.lista !== listaSeleccionada.lista
      );
      setLista(nuevaLista);
      setListaHaciendo(nuevaListaHaciendo);
      setListaHecho((isListaHecho) => [
        ...isListaHecho,
        { lista: listaSeleccionada.lista, read: true },
      ]);
      // setIsHaciendoCount(isHaciendoCount - 1);
      // setIsHechoCount(isHechoCount + 1);
    } catch (error) {
      console.log(error);
    }
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

    // const db = getDatabase();

    // const dbRef = ref(getDatabase());
    // let returnArr = [];
    // get(child(dbRef, `listas/${isCurrentUser}`))
    //   .then((snapshot) => {
    //     snapshot.forEach((childSnapshot) => {
    //       let item = childSnapshot.val();
    //       item.key = childSnapshot.key;
    //       returnArr.push(item);
    //     });

    //     setLista(returnArr);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  });

  useEffect(() => {
    const db = getDatabase();

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
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isLista]);

  const isListaHaciendoo = isLista.filter((lista) => !lista.read);
  const isListaHechoo = isLista.filter((lista) => lista.read);

  const renderLista = (item, index) => (
    <View
      style={{
        minHeight: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        width: 325,
      }}
    >
      {/* <View style={{ height: 70, width: 70 }}>
        <Image
          source={require('../../../assets/icon.png')}
          style={{ flex: 1, height: null, width: null, borderRadius: 35 }}
        />
      </View> */}

      <View
        style={{
          borderWidth: 1,
          borderColor: 'white',
          justifyContent: 'center',
          width: 170,
        }}
      >
        <Text style={{ color: 'white' }}> {item.lista} </Text>
      </View>
      {item.read ? (
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            width: 80,
          }}
        >
          <Ionicons name='ios-checkmark' color='white' size={15} />
        </View>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#a5deba',
            alignContent: 'center',
            justifyContent: 'center',
            width: 80,
          }}
          onPress={() => marcarComoLeido(item, index)}
        >
          <Text style={{ textAlign: 'center' }}>Mark as read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' hidden={false} translucent={true} />
      <View
        style={{
          backgroundColor: '#16181c',
          height: 40,
          width: 250,
          borderRadius: 25,
          marginVertical: 10,
          justifyContent: 'center',
        }}
      >
        <TextInput
          onChangeText={(text) => setIsAddNewList(text)}
          placeholder='Insertar titulo de lista'
          placeholderTextColor='#dbdbdb'
          color='white'
          style={{ backgroundColor: 'transparent', paddingLeft: 15 }}
          ref={(component) => {
            textInputRef = component;
          }}
        />
      </View>
      {/* {isAddNewListVisible ? (
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
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name='ios-close' color='white' size={15} />
            </View>
          </TouchableOpacity>
        </View>
      ) : null} */}
      <FlatList
        data={isLista.filter((lista) => lista.read)}
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

      {/* Boton de agregar */}
      {isAddNewList.length > 0 ? (
        <Animatable.View
          animation={isAddNewList.length > 0 ? 'slideInRight' : 'slideOutRight'}
          // style={
          //   {
          //     // borderColor: 'white',
          //     // borderWidth: 1,
          //   }
          // }
        >
          <View style={{ justifyContent: 'center' }}>
            <Text
              onPress={() => addNewList(isAddNewList)}
              style={{
                textAlign: 'center',
                color: '#000',
                fontSize: 30,
                bottom: 80,
                width: 50,
                height: 50,
                backgroundColor: '#1DA1F2',
                borderRadius: 50,
                paddingTop: 3,
              }}
            >
              +
            </Text>
          </View>
        </Animatable.View>
      ) : null}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'grey',
            borderWidth: 1,
          }}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={{ color: 'white' }}>Lista</Text>
          <Text style={{ color: 'white' }}>{isLista.length}</Text>
        </TouchableOpacity>
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
          <Text style={{ color: 'white' }}>{isListaHechoo.length}</Text>
        </TouchableOpacity>
        <View
          style={{
            ...styles.subTabContainer,
            borderBottomColor: 'white',
            borderWidth: 2,
          }}
        >
          <Text style={{ color: 'white' }}>Hecho</Text>
          <Text style={{ color: 'white' }}>{isListaHaciendoo.length}</Text>
        </View>
      </View>
      <PrimaryButton
        text={'Cerrar Sesión'}
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
