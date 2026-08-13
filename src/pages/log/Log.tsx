import React, { useEffect, useState } from 'react';
import { IonApp, IonContent, IonPage, IonSplitPane } from "@ionic/react"
import Sidebar from "../../components/Sidebar"
import '../Home.css'
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import LogContent from './LogContent';

const Log: React.FC = () => {

    const [activeTab, setActiveTab] = useState('Log');
    //const contentRef = useRef(null);
    const menuId = 'main-menu';

    //window.location.reload();

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
                        {/* Log content (only one page for demo) */}
                        <LogContent />
                        <Footer />
                    </IonContent>
                </IonPage>
            </IonSplitPane>
        </IonApp>
    )
}

export default Log