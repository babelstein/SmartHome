import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={{
      display: 'flex',
      padding: '10px 20px',
      backgroundColor: '#333',
      color: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h1 style={{ margin: 0 }}>PV System Info</h1>
      <nav>
        <Link to="/" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Live Data</Link>
        <Link to="/history" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>History</Link>
        <Link to="/time-summary" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Summary</Link>
      </nav>
    </header>
  );
};

export default Header;