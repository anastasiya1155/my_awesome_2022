import moment from 'moment';

export const mapLabel = label => ({
  id: label.ID,
  name: label.Name,
  color: label.Color,
  colorActive: label.ColorActive,
});

export const mapPost = post => ({
  id: post.ID,
  labels: post.Labels,
  comments: post.Comments,
  periods: post.Periods,
  body: post.Body,
  date: post.Date.slice(0, 10),
});

export const mapPeriod = period => ({
  id: period.ID,
  name: period.Name,
  start: moment(period.Start).format('YYYY-MM-DD'),
  end: period.End === '0001-01-01T00:00:00Z' ? null : moment(period.End).format('YYYY-MM-DD'),
});
