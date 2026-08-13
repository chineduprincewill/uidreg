import React, { useState } from 'react';
import { IonApp, IonContent, IonPage, IonSplitPane } from "@ionic/react"
import Sidebar from "../../components/Sidebar"
import '../Home.css'
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import SettingsContent from './SettingsContent';

const Settings: React.FC = () => {

    const [activeTab, setActiveTab] = useState('Settings');
    //const contentRef = useRef(null);
    const menuId = 'main-menu';

    return (
        <IonApp>
            <IonSplitPane contentId="main-content" when="md">
                <Sidebar 
                    menuId={menuId}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <IonPage id='main-content'>
                    {/* Header with menu toggle */}
                    <Header />
                    <IonContent className="landing-content">
                        {/* Settings content (only one page for demo) */}
                        <SettingsContent />
                        <Footer />
                    </IonContent>
                </IonPage>
            </IonSplitPane>
        </IonApp>
    )
}

export default Settings