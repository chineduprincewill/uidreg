import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonLabel,
  IonIcon,
  IonSpinner,
  IonRouterLink,
  IonImg,
  IonText,
  IonAlert,
  useIonRouter,
} from '@ionic/react';
import { arrowBack, callOutline, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, personOutline } from 'ionicons/icons';
import Footer from '../../components/footer/Footer';
import Brand from '../../components/Brand';
import { register_users } from '../../apis/log_apis';

const Register: React.FC = () => {

    const router = useIonRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirm_password] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!name || !email || !password) {
      setAlertMessage('Please fill in all fields');
      setShowAlert(true)
      return;
    }
    else if(password !== confirm_password){
      setAlertMessage('Confirm password mismatch');
      setShowAlert(true)
      return;
    }

    const data = {
      name,email,password,confirm_password
    }

    setLoading(true);

    // Simulate API call
    try {
      // Replace with actual Register logic
      const response = await register_users(data);

      if(response){
        setAlertMessage('Registration Successfull!')
        setShowAlert(true)
        setTimeout(() => {
            router.push('/login');
        }, 500);
      }
      //console.log('Register successful', data);
      // Navigate to dashboard
    } catch (err) {
      setAlertMessage('Invalid email or password');
      setShowAlert(true)
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="aurora">
        <div className="landing-container">
          {/* Logo/Icon Section */}
          <div className="text-center">
            <Brand />
            <IonText>
                <h1 className='auth-title !flex !items-center !gap-2 !justify-center !mt-4'>
                    Sign Up
                </h1>
                <p className='auth-sub'>
                Welcome! Please enter your details.
                </p>
            </IonText>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-1 py-1 border-b border-red-100">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="w-full space-y-4 !py-4">
            {/* First and last names Input */}
            <div className="field">
              <div className="flex justify-between items-center">
                <IonLabel className="field-label text-sm font-medium text-gray-700 block">
                  Fullname
                </IonLabel>
              </div>
              <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl">
                  <IonIcon icon={personOutline} className='text-gray-400 pl-4' />
                  <IonInput
                      type="text"
                      value={name}
                      onIonChange={(e) => setName(e.detail.value || '')}
                      placeholder="Fullname"
                      className="!pl-4 !h-14 !px-4"
                      mode="md"
                  />
              </div>
            </div>
            <div className="field">
              <div className="flex justify-between items-center">
                <IonLabel className="field-label text-sm font-medium text-gray-700 block">
                  Email
                </IonLabel>
              </div>
              <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl">
                  <IonIcon icon={mailOutline} className='text-gray-400 pl-4' />
                  <IonInput
                      type="email"
                      value={email}
                      onIonChange={(e) => setEmail(e.detail.value || '')}
                      placeholder="Email"
                      className="!pl-4 !h-14 !px-4"
                      mode="md"
                  />
              </div>
            </div>
            {/* Password Input */}
            <div className="field">
              <div className="flex justify-between items-center">
                <IonLabel className="field-label text-sm font-medium text-gray-700 block">
                  Password
                </IonLabel>
              </div>
              <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl">
                  <IonIcon 
                      icon={lockClosedOutline} 
                      className="text-gray-400 pl-4" 
                  />
                  <IonInput
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || '')}
                  placeholder="Password"
                  className="!pl-4 !h-14 !px-4"
                  mode="md"
                  />
                  <IonIcon 
                      icon={showPassword ? eyeOffOutline : eyeOutline} 
                      className="text-gray-400 pr-4" 
                      onClick={() => setShowPassword(!showPassword)}
                  />
              </div>
            </div>
            <div className="field">
              <div className="flex justify-between items-center">
                <IonLabel className="field-label text-sm font-medium text-gray-700 block">
                  Confirm Password
                </IonLabel>
              </div>
              <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl">
                  <IonIcon 
                      icon={lockClosedOutline} 
                      className="text-gray-400 pl-4" 
                  />
                  <IonInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirm_password}
                  onIonChange={(e) => setConfirm_password(e.detail.value || '')}
                  placeholder="Confirm password"
                  className="!pl-4 !h-14 !px-4"
                  mode="md"
                  />
                  <IonIcon 
                      icon={showConfirmPassword ? eyeOffOutline : eyeOutline} 
                      className="text-gray-400 pr-4" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
              </div>
            </div>
            {/* Remember Me Checkbox */}
            {/*<div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
            </div>*/}

            {/* Register Button */}
            <IonButton
              type="submit"
              expand="block"
              className='btn-primary'
              disabled={loading}
            >
              {loading ? (
                <IonSpinner name="crescent" className="text-white" />
              ) : (
                'Sign Up'
              )}
            </IonButton>
            <div className="p-4 text-center">
                <p className="switch-line">
                    Already have an account?{' '}
                    <IonRouterLink
                    routerLink="/login"
                    className="font-semibold "
                    >
                    Sign In
                    </IonRouterLink>
                </p>
            </div>

          </form>
        </div>
        <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={alertMessage === "Registration Successfull!" ? "Register Success" : "Register Error"}
            message={alertMessage}
            buttons={['OK']}
        />
        {/* Footer with Next Button */}
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Register;