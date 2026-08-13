import React, { useState } from 'react';
import { IonApp, IonContent, IonPage, IonSplitPane } from "@ionic/react"
import Sidebar from "../../components/Sidebar"
import '../Home.css'
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import CreateContent from './CreateContent';

const Create: React.FC = () => {

    const [activeTab, setActiveTab] = useState('Create');
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
                        {/* Create content (only one page for demo) */}
                        <CreateContent />
                        <Footer />
                    </IonContent>
                </IonPage>
            </IonSplitPane>
        </IonApp>
    )
}

export default Create