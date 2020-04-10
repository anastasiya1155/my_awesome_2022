import React, { Component } from 'react';
import PinShow from '../Pin/PinShowd';
import {getPins} from '../../utils/routes';

export default class PinList extends Component {
  state = {
    contacts: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      this.fetchData();
    }
  }

  fetchData = () => {
    getPins()
      .then((response) => {
        const newContacts = response.data.map((c) => ({
          id: c.ID,
          name: c.Name,
          priority: c.Priority,
        }));

        this.setState({ contacts: newContacts });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div>
        {this.state.contacts.map((p) => (
          <PinShow key={p.id} priority={p.priority} name={p.name} />
        ))}
      </div>
    );
  }
}
