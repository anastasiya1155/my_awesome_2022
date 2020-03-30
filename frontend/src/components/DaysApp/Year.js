import React, { Component } from 'react';

class Year extends Component {
  state = {
    collapsed: true,
  };

  toggleMonths = () => {
    this.setState(prevState => ({
      collapsed: !prevState.collapsed,
    }));
  };

  proxyFetchMonth = ym => {
    this.props.fetchmonth(ym);
  };

  render() {
    return (
      <div>
        <span style={{ cursor: 'pointer' }} onClick={this.toggleMonths}>
          {this.props.year}
        </span>
        {this.state.collapsed ? null : (
          <ul>
            {this.props.months.map(m => (
              <li key={m.YM}>
                <span
                  style={{
                    cursor: 'pointer',
                    backgroundColor: this.props.selected === m.YM ? 'rgb(222, 210, 210)' : 'white',
                  }}
                  onClick={() => this.proxyFetchMonth(m.YM)}
                >
                  {m.M} ({m.Cnt})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default Year;
