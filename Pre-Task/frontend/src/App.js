import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Home from './Home'; // Ensure Home is correctly imported
import Statistics from './Statistics'; // Ensure Statistics is correctly imported
import stats from './data/stats.json'; // Ensure stats.json is within src folder
import './App.css'; // Import CSS file for styles

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(stats); // Load the stats.json file
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <h2 className="app-title">Home - Image Grid</h2>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              <Link to="/statistics" className="nav-link">Statistics</Link>
            </li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/statistics">
            {data && <Statistics stats={data} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;