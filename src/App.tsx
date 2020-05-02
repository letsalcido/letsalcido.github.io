import React from 'react';
import './global.scss';
import styles from './App.module.scss';
import Background from './background';

function App() {
  return (
    <div className={styles.app}>
      <Background />
      <div className={styles.appContainer}>

      </div>
    </div>
  );
}

export default App;
