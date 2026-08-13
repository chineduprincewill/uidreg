import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonRouterLink,
  IonText,
  IonAlert,
} from '@ionic/react';
import { eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { useHistory, useLocation } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import Brand from '../../components/Brand';

const Login: React.FC = () => {
  const { login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const history = useHistory();
  const location = useLocation<{ from?: string }>();

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/dashboard';
      console.log('Authenticated, redirecting to:', from);
      history.replace(from);
    }
  }, [isAuthenticated, history, location.state?.from]); // ✅ Only depend on what's needed

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setAlertMessage('Please enter both email and password');
      setShowAlert(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setAlertMessage('Please enter a valid email address');
      setShowAlert(true);
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      // ✅ Auth context will trigger the useEffect above
      // The component will return null and redirect will happen
    } catch (err: any) {
      setAlertMessage(err.message || 'Login failed. Please try again.');
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setShowAlert(true);
    }
  }, [error]);

  // ✅ Don't render if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <IonPage>
      <IonContent fullscreen className="aurora">
        <div className="landing-container">
          <div className="text-center">
            <Brand />
            <IonText>
              <h1 className='auth-title !flex !items-center !gap-2 !justify-center !mt-4'>
                Sign In
              </h1>
              <p className='auth-sub'>
                Welcome back! Please enter your details.
              </p>
            </IonText>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-4 !py-4">
            <div className="field">
              <IonLabel className="field-label text-sm">
                Email Address
              </IonLabel>
              <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl">
                <IonIcon icon={mailOutline} className='text-gray-400 pl-4' />
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value || '')}
                  placeholder="you@example.com"
                  className="!pl-4 !h-14 !px-4"
                  mode="md"
                />
              </div>
            </div>

            <div className="field">
              <div className="flex justify-between items-center">
                <IonLabel className="field-label text-sm font-medium text-gray-700 block">
                  Password
                </IonLabel>
              </div>
              <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl">
                <IonIcon icon={lockClosedOutline} className="text-gray-400 pl-4" />
                <IonInput
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || '')}
                  placeholder="••••••••"
                  className="!pl-4 !h-14 !px-4"
                  mode="md"
                />
                <IonIcon 
                  icon={showPassword ? eyeOffOutline : eyeOutline} 
                  className="text-gray-400 pr-4 cursor-pointer" 
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <IonButton
              type="submit"
              expand="block"
              className='btn-primary !mt-6'
              disabled={submitting || loading}
            >
              {submitting ? (
                <IonSpinner name="crescent" className="text-white" />
              ) : (
                'Sign In'
              )}
            </IonButton>
            <div className="p-4 text-center">
              <p className="switch-line">
                Don&apos;t have an account?{' '}
                <IonRouterLink routerLink="/signup" className="font-semibold">
                  Sign Up
                </IonRouterLink>
              </p>
            </div>
          </form>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Login Error"
          message={alertMessage}
          buttons={['OK']}
        />

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Login;