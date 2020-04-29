import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { RELOAD_TRANS_CATEGORIES_LIST } from '../../shared/redux/actions';
import { postTransactionsCategories } from '../../shared/utils/routes';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class TransactionsCategoriesCreate extends Component {
  state = {
    showInput: false,
    value: '',
  };

  handleText = e => {
    this.setState({ value: e.target.value });
  };

  toggleInput = e => {
    this.setState(prevState => ({ showInput: !prevState.showInput }));
  };

  createCategory = e => {
    const post = {
      name: this.state.value,
      id: this.props.nextId,
    };
    postTransactionsCategories(post)
      .then(response => {
        this.setState({ value: '' });
        this.props.reloadList(true);
        this.toggleInput();
      })
      .catch(error => console.log(error));
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button variant="outlined" onClick={this.toggleInput}>
          Add +
        </Button>
        {this.state.showInput ? (
          <span>
            <TextField
              type="text"
              className={classes.textField}
              value={this.state.value}
              onChange={this.handleText}
            />
            <Button variant="outlined" onClick={this.createCategory}>
              Save
            </Button>
          </span>
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    reloadList: reload => {
      dispatch({
        type: RELOAD_TRANS_CATEGORIES_LIST,
        payload: {
          reload,
        },
      });
    },
  };
};
export default connect(null, mapDispatchToProps)(withStyles(styles)(TransactionsCategoriesCreate));
