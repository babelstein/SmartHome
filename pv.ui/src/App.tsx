import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LiveData from './pages/LiveData';
import History from './pages/History';
import TimeSummary from './pages/TimeSummary';
import { Provider } from 'react-redux';
import { store } from './app/store'
import Header from './components/Header';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <div style={{ padding: '20px' }}></div>
        <Routes>
          <Route path="/" element={<LiveData />} />
          <Route path="/history" element={<History />} />
          <Route path="/time-summary" element={<TimeSummary />} />
        </Routes>
      </Router>
    </Provider>

  );
}
export default App;