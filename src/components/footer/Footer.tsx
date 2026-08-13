import React from 'react';
import {
  IonText,
  IonImg,
  IonFooter,
} from '@ionic/react';
import '../../pages/Home.css'; // We'll create this

const Footer: React.FC = () => {

  return (
    <IonFooter className="landing-footer !pb-2">
        <div className="footer-content">
          {/* Optional Skip/Login links */}
          <div className="footer-links">
              <IonText color="medium">
              <p className="footer-text">
                  <IonImg 
                  src="/assets/apin-logo.png" 
                  alt="Apin Logo"
                  className="apin-logo"
                  />
                  <span>APIN Public Health Initiatives</span>
              </p>
              </IonText>
          </div>
        </div>
    </IonFooter>
  );
};

export default Footer;