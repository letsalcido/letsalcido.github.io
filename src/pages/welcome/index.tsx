import React from 'react';
import Button from '../../components/Button';

export default function WelcomePage() {
    return (
      <>
          <h1>Hey there!</h1>
          <p>Thank you for checking out my personal website! It's still under development but you can enjoy the nice animation I created for now...</p>
          <p>What else would you like to do?
              <Button link="/statics/Luis_E_Tadeo_Resume_Nov_2019.pdf" target={"_blank"}>View resume</Button>
              <Button link={"https://linkedin.com/in/letadeos"} target={"_blank"}>Add on linkedin</Button>
          </p>
      </>
    );
}