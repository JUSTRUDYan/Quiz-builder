import '../styles/global.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Header from "../components/Header";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Header />
      <Component {...pageProps} />
    </Provider>
  );
}
