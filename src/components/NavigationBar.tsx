import { IonAlert, IonButton, IonIcon, IonLabel, IonTabBar, IonTabButton, useIonRouter } from '@ionic/react';
import React, { useContext, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { gridOutline, linkOutline, logOutOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router';


const NavigationBar: React.FC = () => {

    const { user, logout, isAuthenticated } = useAuth();
    const router = useIonRouter();
    const history = useHistory();
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    const logoutUser = async () => {
        try {
            // 1. Clear auth state
            await logout();
            
            // 2. Clear all storage
            localStorage.clear();
            sessionStorage.clear();
            
            // 3. Navigate to login with multiple fallbacks
            // Method 1: Use history (most reliable)
            history.replace('/login');
            
            // Method 2: Use IonRouter (as backup)
            setTimeout(() => {
                router.push('/login', 'root', 'replace');
            }, 50);
            
            // Method 3: Force navigation (last resort)
            setTimeout(() => {
                window.location.href = '/login';
            }, 200);
            
        } catch (error) {
            console.error('Logout failed:', error);
            // Still try to navigate even on error
            history.replace('/login');
        }
    };

    const handleLogout = () => {
        // Show confirmation first
        setShowLogoutAlert(true);
    };

    const confirmLogout = async () => {
        setShowLogoutAlert(false);
        await logoutUser();
    };

    return (
        //(loc.pathname !== '/home' && loc.pathname !== '/login' && loc.pathname !== '/signup') && 
        <>
            <IonTabBar slot="bottom" className="tabbar">
                <IonTabButton tab="dashboard" href="/dashboard">
                    <IonIcon icon={gridOutline} />
                    <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="analytics" href="/linkage">
                    <IonIcon icon={linkOutline} />
                    <IonLabel>Linkage</IonLabel>
                </IonTabButton>
            {
                user && user?.role === 'admin' &&
                <IonTabButton tab="profile" href="/profile">
                    <IonIcon icon={personCircleOutline} />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
            }
                <IonTabButton 
                    tab="logout"
                    className="text-red-600"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                    }}
                >
                    <IonIcon icon={logOutOutline} />
                    <IonLabel>Logout</IonLabel>
                </IonTabButton>
            </IonTabBar>
            <IonAlert
                isOpen={showLogoutAlert}
                onDidDismiss={() => setShowLogoutAlert(false)}
                header="Confirm Logout"
                message="Are you sure you want to logout?"
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                    {
                        text: 'Logout',
                        role: 'destructive',
                        handler: confirmLogout,
                    },
                ]}
            />
        </>
    )
}

export default NavigationBar