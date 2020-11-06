import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CssBaseline, Button, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import reduxStore from './shared/redux/config';
import theme from './shared/config/theme';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', (event) => {
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
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <div>
              <Typography>Update is available.</Typography>
              <Button onClick={handleClick} variant="contained" fullWidth>
                Reload
              </Button>
            </div>
          </MuiThemeProvider>,
          messageNode,
        );
        messageNode.className = 'root-message';
      }
    }
  },
});

reportWebVitals(console.log);
