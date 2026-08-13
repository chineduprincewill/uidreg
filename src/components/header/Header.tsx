import { IonAvatar, IonButton, IonButtons, IonChip, IonHeader, IonIcon, IonImg, IonLabel, IonMenuButton, IonTitle, IonToolbar } from "@ionic/react";
import { menuOutline, notificationsOutline, personOutline } from "ionicons/icons";
import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header: React.FC = () => {

    const { user } = useAuth();

    return (
        <IonHeader className="ion-no-border shadow-sm">
            <IonToolbar className="px-1">
                <IonButtons slot="start">
                    <IonMenuButton autoHide={false} menu={'main-menu'} className="text-slate-700 text-2xl">
                        <IonIcon icon={menuOutline}></IonIcon>
                    </IonMenuButton>
                </IonButtons>
                <IonTitle className="text-slate-800 font-semibold flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <IonImg 
                            src="/assets/logo.png" 
                            alt="App Logo"
                            className='w-6 h-6'
                        />
                    </div>
                    <span className="hidden md:block">Dashboard</span>
                </IonTitle>
                <IonButtons slot="end" className="flex items-center gap-">
                    <IonButton fill="clear" color="dark" className="text-lg">
                        <IonIcon icon={notificationsOutline}></IonIcon>
                    </IonButton>
                    <IonChip color="primary" outline={true} className="px-3 py-1 text-sm">
                        <IonAvatar>
                            <img alt="avatar" src="https://i.pravatar.cc/40?img=12" />
                        </IonAvatar>
                    </IonChip>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    )
}

export default Header