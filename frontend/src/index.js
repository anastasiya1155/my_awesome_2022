import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {CssBaseline, Button, Typography} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reducer from './shared/redux/reducer';
import theme from './shared/config/theme';

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.register({
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', event => {
        if (event.target && event.target.state === 'activated') {
          window.location.reload();
        }
      });
      const messageNode = document.querySelector('#message');
      const handleClick = () => {
        waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      };
      if (messageNode) {
        ReactDOM.render(
          <div>
            <Typography>Update is available.</Typography>
            <Button onClick={handleClick} variant="contained" fullWidth>
              Reload
            </Button>
          </div>,
          messageNode,
        );
        messageNode.className = 'root-message';
      }
    }
  },
});
