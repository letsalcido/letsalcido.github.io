import React from 'react';
import './global.scss';
import styles from './App.module.scss';
import Background from './background';

function App() {
  return (
    <div className={styles.App}>
      <Background />
          {/*<header className={styles.AppHeader}>*/}
          {/*    Luis Tadeo*/}
          {/*</header>*/}
    </div>
  );
}

export default App;
