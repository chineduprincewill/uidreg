import React, { useState } from 'react';
import { IonApp, IonContent, IonIcon, IonPage, IonSplitPane, useIonRouter } from "@ionic/react"
import Sidebar from "../../components/Sidebar"
import '../Home.css'
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import DispatchContent from './DispatchContent';
import { closeCircleOutline } from 'ionicons/icons';

const Dispatch: React.FC = () => {

    //const router = useIonRouter();
    const [activeTab, setActiveTab] = useState('Dispatch');
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
                        {/* Dispatch content (only one page for demo) */}
                        <DispatchContent />
                        <Footer />
                    </IonContent>
                </IonPage>
            </IonSplitPane>
        </IonApp>
    )
}

export default Dispatch