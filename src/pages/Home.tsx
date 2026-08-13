import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonText,
  IonImg,
  IonSpinner,
  useIonRouter,
} from '@ionic/react';
import { arrowForwardOutline } from 'ionicons/icons';
//import './Home.css'; // We'll create this
import Footer from '../components/footer/Footer';
import Brand from '../components/Brand';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useIonRouter();
  
  const handleNext = () => {
    setLoading(true);
    // Simulate navigation or API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to next page or perform action
      //console.log('Next button clicked!');
      router.push('/login')
    }, 1000);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="aurora">
        {/* Optional Header with back button */}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Welcome</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Main Content */}
        <div className="landing-container">
          {/* Logo Section */}
          <div className="grid gap-2">
            <Brand />
            <IonText className='!flex !justify-center'>
              <h1 className='auth-title'>UIDReg</h1>
            </IonText>
            <IonText>
              <p className='auth-sub !text-center'>Managing health just got easier. We connect the dots between all your health programs. One Client. One Record. Unlimited Programs, linking every ID, so you know the whole story</p>
            </IonText>
          </div>

          {/* Flash Message / Announcement */}
          {/*<IonCard className="flash-message-card">
            <IonCardContent>
              <div className="flash-message">
                <div className="flash-icon-wrapper">
                  <IonIcon icon={flashOutline} className="flash-icon" />
                </div>
                <div className="flash-content">
                  <IonText color="dark">
                    <h3 className="flash-title">Welcome to the App!</h3>
                    <p className="flash-description">
                   
                    </p>
                  </IonText>
                </div>
              </div>
            </IonCardContent>
          </IonCard>*/}
          <IonButton
              expand="block"
              shape="round"
              size="large"
              className="btn-primary w-1/2"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  Next
                  <IonIcon slot="end" icon={arrowForwardOutline} />
                </>
              )}
            </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;