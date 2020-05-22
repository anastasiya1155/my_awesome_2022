import moment from 'moment';

export const POSTS_LOADED = '@post/POSTS_LOADED';
export const POSTS_HISTORY_LOADED = '@post/POSTS_HISTORY_LOADED';
export const LABELS_LOADED = '@post/LABELS_LOADED';
export const PERIODS_LOADED = '@post/PERIODS_LOADED';

const initialState = {
  posts: [],
  postsHistory: [],
  labels: [],
  periods: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case POSTS_LOADED: {
      const posts = action.payload.data.map(c => ({
        id: c.ID,
        labels: c.Labels,
        comments: c.Comments,
        periods: c.Periods,
        body: c.Body,
        date: c.Date.slice(0, 10),
      }));
      return { ...state, posts };
    }
    case POSTS_HISTORY_LOADED: {
      const postsHistory = action.payload.data.map(c => ({
        id: c.ID,
        labels: c.Labels,
        comments: c.Comments,
        periods: c.Periods,
        body: c.Body,
        date: c.Date.slice(0, 10),
      }));
      return { ...state, postsHistory };
    }
    case LABELS_LOADED: {
      const labels = action.payload.data.map(c => ({
        id: c.ID,
        name: c.Name,
        color: c.Color,
        colorActive: c.ColorActive,
      }));
      return { ...state, labels };
    }
    case PERIODS_LOADED:
      const periods = action.payload.data.map(c => ({
        id: c.ID,
        name: c.Name,
        start: moment(c.Start).format('YYYY-MM-DD'),
        end: c.End === '0001-01-01T00:00:00Z' ? null : moment(c.End).format('YYYY-MM-DD'),
      }));
      return { ...state, periods };
    default:
      return state;
  }
};

export default reducer;
