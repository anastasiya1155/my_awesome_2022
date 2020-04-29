import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

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
                  }}
                  className={this.props.selected === m.YM ? this.props.classes.monthSelected : null}
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

const styles = theme => ({
  monthSelected: {
    color: theme.palette.primary.light,
  },
});

export default withStyles(styles)(Year);
