import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import './styles/tailwind.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Create from './pages/create/Create';
import Dispatch from './pages/dispatch/Dispatch';
import Track from './pages/track/Track';
import Log from './pages/log/Log';
import Settings from './pages/settings/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { gridOutline, linkOutline, logOutOutline, personCircleOutline, statsChartOutline } from 'ionicons/icons';
import Linkage from './pages/linkage/Linkage';
import NavigationBar from './components/NavigationBar';
import AppLayout from './components/AppLayout';
import Profile from './pages/profile/Profile';

setupIonicReact();

const App: React.FC = () => (

  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <Register />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <ProtectedRoute exact path="/dashboard">
            <Dashboard />
          </ProtectedRoute>
          <ProtectedRoute exact path="/linkage">
            <Linkage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/dispatch/:form_report_id">
            <Dispatch />
          </ProtectedRoute>
          <ProtectedRoute exact path="/profile">
            <Profile />
          </ProtectedRoute>
          <ProtectedRoute exact path="/log">
            <Log />
          </ProtectedRoute>
          <ProtectedRoute exact path="/settings">
            <Settings />
          </ProtectedRoute>
          <Redirect exact from="/" to="/home" />
        </IonRouterOutlet>
        <AppLayout />
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
