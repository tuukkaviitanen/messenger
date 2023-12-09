import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {Provider} from 'react-redux';

import App from './components/App';
import store from './store';

const theme = createTheme({
	palette: {
		primary: {
			main: '#22092C',
		},
		secondary: {
			main: '#872341',
		},
		background: {
			default: '#872341',
		},
		text: {
			primary: '#22092C',
			secondary: '#000000',
		},
	},
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<App />
				</ThemeProvider>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
);
