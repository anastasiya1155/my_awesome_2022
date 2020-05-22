import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CssBaseline, Button, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reduxStore from './shared/redux/config';
import theme from './shared/config/theme';

ReactDOM.render(
  <Provider store={reduxStore}>
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
