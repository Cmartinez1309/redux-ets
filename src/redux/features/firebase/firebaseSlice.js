import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebaseAuth from '../../../firebase/firebase';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

import { getDatabase, ref, set } from 'firebase/database';

const initialState = {
  error: {
    errorOccured: false,
    errorMain: '',
    errorBody: '',
  },
  phoneAuth: {
    verificationId: '',
  },
  user: {},
  facebook: {
    accessToken: '',
  },
};

export const signUpEmail = createAsyncThunk(
  'firebase/signUpEmail',
  async ({ email, password, capRef }) => {
    try {
      const auth = firebaseAuth.getAuth();

      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const db = getDatabase();
      set(ref(db, 'users/' + userCredential.user.uid), {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
      });

      return { user: userCredential.user };
    } catch (err) {
      return { errorCode: err.code };
    }
  }
);

export const logInEmail = createAsyncThunk(
  'firebase/logInEmail',
  async ({ email, password }) => {
    try {
      console.log(' * Iniciando sesion usando correo y contraseña');
      const auth = firebaseAuth.getAuth();
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: userCredential.user };
    } catch (err) {
      return { errorCode: err.code };
    }
  }
);

export const signOutUser = createAsyncThunk(
  'firebase/signOutUser',
  async () => {
    const auth = firebaseAuth.getAuth();
    await firebaseAuth.signOut(auth);
  }
);

const firebaseSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {
    updateVerificationId: (state, action) => {
      state.phoneAuth.verificationId = action.payload.verificationId;
    },
    updateErrorMessage: (state) => {
      state.error.errorBody = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signUpEmail.fulfilled, (state, action) => {
        console.log(' * Registro intento');
        console.log(action);
        if (action.payload.errorCode) {
          switch (action.payload.errorCode) {
            case 'auth/email-already-in-use':
              state.error.errorBody =
                'Correo electrónico ya en uso. Por favor use un correo electrónico differente';
              break;
          }
        }
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(signUpEmail.rejected, () => {
        console.log(' * Error en registro');
      })

      .addCase(logInEmail.fulfilled, (state, action) => {
        console.log(' * Inicio de sesion intento');
        if (action.payload.errorCode) {
          console.log(action.payload.errorCode);
          switch (action.payload.errorCode) {
            case 'auth/wrong-password':
              state.error.errorBody =
                'Contraseña incorrecta. Por favor intente de nuevo.';
              break;
            case 'auth/user-not-found':
              state.error.errorBody =
                'Correo electronico no esta registrado. Por favor intente con un correo electrónico diferente';
              break;
            case 'auth/user-disabled':
              state.error.errorBody =
                'Su cuenta esta temporalmente deshabilitada. Intente de nuevo despues de unos minutos.';
              break;
          }
        }
        if (action.payload.user) {
          console.log(' * Inicio de sesion exitoso!');
          state.user = action.payload.user;
        }
      })

      .addCase(signOutUser.fulfilled, (state) => {
        console.log(' * Sesion cerrada exitosamente!');
        state.user = {};
      })
      .addCase(signOutUser.rejected, (state) => {
        state.error.errorBody = 'Ocurrio un error. Intente de nuevo.';
      });
  },
});

export const { updateVerificationId, updateErrorMessage } =
  firebaseSlice.actions;

export default firebaseSlice.reducer;
