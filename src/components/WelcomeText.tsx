import { IonIcon, IonLabel } from '@ionic/react';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationsOutline } from 'ionicons/icons';

const WelcomeText: React.FC = () => {

    const { user } = useAuth();

    return (
        <div
            className="hero"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
            <div>
                <div className="hero-eyebrow">Welcome</div>
                <h1 className="hero-title !text-xl">{user && user?.name} 👋</h1>
            </div>
            <div
            style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: 'var(--surface-1)',
                border: '1px solid var(--hairline)',
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
            }}
            >
                <IonIcon icon={notificationsOutline} style={{ fontSize: 19 }} />
                <span
                    style={{
                    position: 'absolute',
                    top: 10,
                    right: 11,
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: 'var(--brand-magenta)',
                    }}
                />
            </div>
        </div>
    )
}

export default WelcomeText