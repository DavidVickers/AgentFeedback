import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DealForm from './components/DealForm';
import DealList from './components/DealList';
import './App.css';

const API_URL = 'http://localhost:5001';

function App() {
  const [deals, setDeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/deals`);
      setDeals(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching deals. Please try again later.');
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDealAdded = () => {
    fetchDeals();
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TA Deal Tracker</h1>
        <button 
          className="toggle-form-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'View Deals' : 'Add New Deal'}
        </button>
      </header>

      <main className="app-main">
        {showForm ? (
          <DealForm onDealAdded={handleDealAdded} />
        ) : (
          <DealList deals={deals} onRefresh={fetchDeals} />
        )}
      </main>
    </div>
  );
}

export default App;
