import React from 'react';
import {withRouter} from 'react-router-dom';
import {getLts, postLT, putLT} from '../../utils/routes';
import {Divider, IconButton, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import BeenhereIcon from '@material-ui/icons/Beenhere';
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';
import AddLastTime from "../LastTime/AddLastTime";

const LastTime = () => {
  const [items, setItems] = React.useState([]);
  const [isAdd, setIsAdd] = React.useState(false);

  const fetchLastTimeItems = () => {
    getLts().then(response => {
      if (response.data) {
        setItems(response.data);
      }
    });
  };
  React.useEffect(() => {
    fetchLastTimeItems();
  }, []);

  const handleListItemClick = (item) => {
    item.date = moment();
    putLT(item.id, item).then(response => {
      fetchLastTimeItems()
    });
  };

  const handleSubmit = values => postLT(values)
      .then(() => {
        fetchLastTimeItems();
        setIsAdd(false);
      })
      .catch(console.log);

  return (
    <div>
      <h1>LastTime</h1>
      <List>
        {items.map((item) => (
          <>
            <ListItem
                key={item.id}
                button
                onClick={() => handleListItemClick(item)}>
              <ListItemIcon>
                <BeenhereIcon/>
              </ListItemIcon>
              <ListItemText primary={item.body}>  </ListItemText>
              <ListItemText primary={moment(item.date).fromNow(true)}></ListItemText>
            </ListItem>
            <Divider/>
          </>
            )
        )}
      </List>
      <IconButton onClick={() => setIsAdd(true)}>
        <AddIcon />
      </IconButton>
      {isAdd ? <AddLastTime handleSubmit={handleSubmit} /> : null}
    </div>
    );
  };
export default withRouter(LastTime);
