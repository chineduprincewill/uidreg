import React, { useCallback, useEffect, useState } from 'react';
import { IonApp, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonModal, IonRefresher, IonRefresherContent, IonSpinner, IonTitle, IonToolbar } from "@ionic/react"
import '../Home.css'
import { addOutline, alertCircleOutline, bagHandleOutline, cardOutline, closeCircleOutline, createOutline, filterOutline, peopleOutline, trendingUpOutline } from 'ionicons/icons';
import { ClientIdProps } from '../../types/auth.types';
import { get_client_ids } from '../../apis/log_apis';
import { useAuth } from '../../context/AuthContext';
import WelcomeText from '../../components/WelcomeText';
import LinkageForm from './LinkageForm';

const icons = {
    trendingUp: trendingUpOutline,
    card: cardOutline,
    people: peopleOutline,
    bag: bagHandleOutline,
  };

type iconTypes = {
    trendingUp: string;
    card: string;
    people: string;
    bag: string;
}

const Linkage: React.FC = () => {

    const { user } = useAuth();
    //const [activeTab, setActiveTab] = useState('Dashboard');
    //const contentRef = useRef(null);
    //const menuId = 'main-menu';
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState('W');
    const [linkages, setLinkages] = useState<ClientIdProps[]>([]);
    const [filteredReports, setFilteredReports] = useState<ClientIdProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isUpdated, setIsUpdated] = useState(0);
    const [isEditing, setIsEditing] = useState<ClientIdProps | null>(null)

    // Fetch reports
    const fetchLinkages = useCallback(async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            setError('Authentication required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await get_client_ids(token);
            if (data && Array.isArray(data)) {
                setLinkages(data);
                setFilteredReports(data);
            } else {
                setLinkages([]);
                setFilteredReports([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load reports';
            setError(message);
            setLinkages([]);
            setFilteredReports([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const editClientId = (client:ClientIdProps) => {
        setIsEditing(client);
        setShowModal(true)
    }

    // Initial load
    useEffect(() => {
        fetchLinkages();
    }, [fetchLinkages, isUpdated]);

    // Apply filters and search
    useEffect(() => {
        let filtered = [...linkages];

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(linkage =>
                linkage.uid?.toLowerCase().includes(term) ||
                linkage.facility?.toLowerCase().includes(term) ||
                linkage.formdata?.toLowerCase().includes(term)
            );
        }

        setFilteredReports(filtered);
    }, [linkages, searchTerm]);

    const refresh = async (e:any) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        setLoading(false);
        e.detail.complete();
    };

    return (
        <IonApp>
            <IonContent fullscreen className="aurora">
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                <IonRefresherContent pullingIcon="chevron-down-circle-outline" />
                </IonRefresher>

                <div className="page" style={{ paddingTop: 60 }}>
                    <WelcomeText />

                    <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl">
                        <IonInput
                            type="text"
                            placeholder="Filter..."
                            onIonChange={(e) => setSearchTerm(e.detail.value || '')}
                            className="!pl-4 !h-8 !px-4"
                            mode="md"
                        />
                        <IonIcon icon={filterOutline} className='text-gray-400 pl-4' />
                    </div>

                    <div className="section-head !items-center">
                        <h2 className="section-title !text-xl !font-extralight !px-2">Recent linkages</h2>
                        <IonIcon 
                            icon={addOutline} 
                            className='text-4xl cursor-pointer' 
                            onClick={() => setShowModal(true)}
                        />
                    </div>

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center h-64 px-4">
                        <IonIcon icon={alertCircleOutline} className="text-6xl text-red-500 mb-4" />
                        <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Reports</h3>
                        <p className="text-gray-600 text-center">{error}</p>
                        <IonButton className="mt-4" onClick={fetchLinkages}>
                            Try Again
                        </IonButton>
                        </div>
                    )}

                    <section className="panel" style={{ paddingTop: 4, paddingBottom: 4 }}>
                        {
                            loading && (
                            <div className="flex flex-col items-center justify-center h-64">
                            <IonSpinner name="crescent" className="text-primary-600" />
                            <p className="mt-4 text-gray-600">Loading log...</p>
                            </div>
                        )}
                        {
                            !loading && !error &&
                            filteredReports.map((row) => (
                                <div className="row-item" key={row.id}>
                                    <div>
                                        <div className="row-title">{row.uid}</div>
                                        <div className="row-sub">{row.facility}</div>
                                        <div className='row-sub !text-[10px]'>{row.created_at}</div>
                                    </div>
                                    <IonIcon 
                                        icon={createOutline} 
                                        size='large' 
                                        className={`!text-green-400 text-2xl row-amount`} 
                                        onClick={() => editClientId(row)}
                                    />
                                </div>
                            ))
                        }
                    </section>
                    <IonModal 
                        isOpen={showModal} 
                        onDidDismiss={() => setShowModal(false)}
                        breakpoints={[0, 0.25, 0.5, 0.87, 1]}
                        initialBreakpoint={0.87}
                        backdropBreakpoint={1}
                        handleBehavior="cycle"
                    >
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>
                                    <div className='!flex !items-center !justify-between'>
                                        <span>Link Client ID<span className='text-sm'> s</span></span>
                                        <IonIcon 
                                            icon={closeCircleOutline} 
                                            size='large' 
                                            className='!text-red-500' 
                                            onClick={() => setShowModal(false)}
                                        />
                                    </div>
                                </IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="!px-12">
                            <LinkageForm 
                                setShowModal={setShowModal} 
                                setIsUpdated={setIsUpdated} 
                                isEditing={isEditing}
                            />
                        </IonContent>
                    </IonModal>
                </div>
            </IonContent>
        </IonApp>
    )
}

export default Linkage