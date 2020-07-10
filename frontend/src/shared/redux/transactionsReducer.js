export const TRANS_CATEGORIES_LOADED = '@transactions/TRANS_CATEGORIES_LOADED';

const initialState = {
  categories: [],
  nextId: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TRANS_CATEGORIES_LOADED:
      let nextId = 0;
      const { data } = action.payload;
      const categories = Object.keys(data).map(key => {
        if (data[key].id >= state.nextId) {
          nextId = data[key].id + 1;
        }
        return {
          id: data[key].id,
          name: data[key].name,
        };
      });
      return { ...state, categories, nextId };
    default:
      return state;
  }
};

export default reducer;
