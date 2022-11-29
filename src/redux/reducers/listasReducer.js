import { ActionCodeOperation } from 'firebase/auth';

const initialState = {};

const listas = (state = initialState, action) => {
  switch (action.type) {
    case 'CARGAR_LISTAS_DEL_SERVIDOR':
      return {};
    default:
      return state;
  }
};

export default listas;
