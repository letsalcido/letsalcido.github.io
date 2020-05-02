import React from 'react';
import './global.scss';
import styles from './App.module.scss';
import img from './statics/profilePic.jpg';
import Background from './backgrounds/LightWaveBackground';
import WelcomePage from "./pages/welcome";

function App() {
  return (
    <div className={styles.app}>
      <Background />
      <div className={styles.appContainer}>
          <header className={styles.header}>
              <div className={styles.profilePic}>
                  <img src={img} />
              </div>
              <div className={styles.content}>
                  <h2>Luis Tadeo</h2>
                  <h3>Software Engineer</h3>
              </div>
          </header>
          <div className={styles.pageWrapper}>
              <div className={styles.pageContainer}>
                  <WelcomePage/>
              </div>
          </div>
          <div className={styles.sideAnnex}>
          </div>
      </div>
    </div>
  );
}

export default App;
