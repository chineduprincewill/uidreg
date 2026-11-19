import React, { useCallback, useEffect, useState } from 'react';
import { IonApp, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonLabel, IonModal, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSpinner, IonTitle, IonToolbar } from "@ionic/react"
import '../Home.css'
import { addOutline, alertCircleOutline, bagHandleOutline, cardOutline, closeCircleOutline, closeOutline, createOutline, filterOutline, gitMergeOutline, peopleOutline, searchOutline, trendingUpOutline } from 'ionicons/icons';
import { ClientIdProps } from '../../types/auth.types';
import { get_client_ids, search_client_id } from '../../apis/log_apis';
import { useAuth } from '../../context/AuthContext';
import WelcomeText from '../../components/WelcomeText';
import LinkageForm from './LinkageForm';
import MergeForm from './MergeForm';
import FacilitySearch from '../../components/FacilitySearch';

type Tab = "facility" | "clientid";

const Linkage: React.FC = () => {
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [linkages, setLinkages] = useState<ClientIdProps[]>([]);
    const [filteredReports, setFilteredReports] = useState<ClientIdProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isUpdated, setIsUpdated] = useState(0);
    const [isEditing, setIsEditing] = useState<ClientIdProps | null>(null)
    const [mergeItems, setMergeItems] = useState<ClientIdProps[]>([]);
    const [mergeModal, setMergeModal] = useState(false);
    const [facility, setFacility] = useState('')
    const [clientid, setClientid] = useState('');
    const [tab, setTab] = useState<Tab>("facility");
    const [fetching, setFetching] = useState(false)

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Fetch client ids by facility
    const fetchLinkages = useCallback(async (page = 1) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            setError('Authentication required');
            return;
        }

        setFetching(true);
        setError(null);

        try {
            // Pass the page number to the API
            const response = await get_client_ids(token, facility, page);
            
            // Handle the new paginated response structure
            if (response && response.data) {
                setLinkages(response.data);
                setFilteredReports(response.data);
                
                // Update pagination state
                setCurrentPage(response.current_page);
                setLastPage(response.last_page);
                setTotalRecords(response.total);
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
            setFetching(false);
        }
    }, [facility]);

    // Search record with client id (Not paginated in this example, but you can add it)
    const fetchClientIDLinkages = useCallback(async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            setError('Authentication required');
            return;
        }

        setFetching(true);
        setError(null);

        try {
            const data = await search_client_id(token, clientid);
            // Assuming search returns a flat array. If it returns a paginator, adjust here.
            if (data && Array.isArray(data)) {
                setLinkages(data);
                setFilteredReports(data);
                // Hide pagination for searches
                setLastPage(1);
                setCurrentPage(1);
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
            setFetching(false);
        }
    }, [clientid]);

    const editClientId = (client:ClientIdProps) => {
        setIsEditing(client);
        setShowModal(true)
    }

    const selectToMerge = (client:ClientIdProps) => {
        const exists = mergeItems.some(u => u.id === client.id);
        if(mergeItems.length === 2){
            alert('Sorry, you can only add two client records!')
            return;
        }
        
        !exists &&
        setMergeItems(() => [
            ...mergeItems,
            client
        ])  
    }

    const emptyMergeSelection = () => {
        if(window.confirm("Are you sure you want to clear your selections?")){
            setMergeItems([]);
        }
    }

    const mergeClientIds = () => {
        setMergeModal(true)
    }

    // Initial load and when facility or isUpdated changes
    useEffect(() => {
        if (facility) {
            fetchLinkages(1); // Reset to page 1 when facility changes
        } else {
            // Facility was cleared — reset everything
            setLinkages([]);
            setFilteredReports([]);
            setCurrentPage(1);
            setLastPage(1);
            setTotalRecords(0);
            setError(null);
            setSearchTerm('');
        }
    }, [fetchLinkages, isUpdated, facility]);

    const newClientRecord = () => {
        setIsEditing(null)
        setShowModal(true)
    }

    // Apply filters and search (Client side filtering only applies to current page)
    useEffect(() => {
        let filtered = [...linkages];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            
            filtered = filtered.filter(linkage => {
                const matchUid = linkage.uid?.toLowerCase().includes(term);
                const matchFacility = linkage.facility?.toLowerCase().includes(term);

                let matchFormdata = false;
                if (linkage.formdata) {
                    try {
                        const parsedData = typeof linkage.formdata === 'string' 
                            ? JSON.parse(linkage.formdata) 
                            : linkage.formdata;

                        matchFormdata = Object.values(parsedData).some(
                            (val) => val && String(val).toLowerCase().includes(term)
                        );
                    } catch (e) {
                        matchFormdata = linkage.formdata.toLowerCase().includes(term);
                    }
                }

                return matchUid || matchFacility || matchFormdata;
            });
        }

        setFilteredReports(filtered);
    }, [linkages, searchTerm]);

    const refresh = async (e:any) => {
        setLoading(true);
        await fetchLinkages(currentPage);
        e.detail.complete();
    };

    // --- PAGINATION HANDLERS ---
    const handleNextPage = () => {
        if (currentPage < lastPage) {
            fetchLinkages(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            fetchLinkages(currentPage - 1);
        }
    };

    //console.log(linkages)

    return (
        <IonApp>
            <IonContent fullscreen className="aurora">
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                <IonRefresherContent pullingIcon="chevron-down-circle-outline" />
                </IonRefresher>

                <div className="page" style={{ paddingTop: 90 }}>
                    <IonSegment
                        value={tab}
                        onIonChange={(e) => {
                            const v = e.detail.value as Tab | undefined;
                            if (v) setTab(v);
                        }}
                        style={{ marginBottom: 0 }}
                        >
                        <IonSegmentButton value="facility">
                            <IonLabel>Facility</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="clientid">
                            <IonLabel>Client ID</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                {
                    tab === "facility" ?
                        <FacilitySearch facility={facility} setFacility={setFacility} />
                        :
                        <div className="field-box w-full !grid !gap-2 !border !border-white/10 !rounded-2xl !mt-2">
                            <IonInput
                                type="text"
                                value={clientid}
                                placeholder="Enter client ID..."
                                onIonInput={(e) => setClientid(e.detail.value || '')}
                                className="!h-6 !p-4"
                                mode="md"
                            />
                            <IonButton
                                expand="block"
                                className="!w-full btn-primary ion-margin-top !mb-2 !h-8"
                                onClick={() => fetchClientIDLinkages()}
                            >
                                Search
                            </IonButton>
                        </div>
                }
                {
                    filteredReports && filteredReports.length > 0 &&
                    <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl !mt-2">
                        <IonInput
                            type="text"
                            value={searchTerm}
                            placeholder="Filter..."
                            onIonInput={(e) => setSearchTerm(e.detail.value || '')}
                            className="!pl-4 !h-8 !px-4"
                            mode="md"
                        />
                        <IonIcon 
                            icon={closeOutline} 
                            size='large'
                            className='text-red-600 pl-4' 
                            onClick={() => setSearchTerm('')}
                        />
                    </div>
                }

                    <div className="section-head !items-center !mt-2">
                        <h2 className="section-title !text-xl !font-extralight !px-2">
                            Clients record <span className="text-sm text-gray-400">({totalRecords})</span>
                        </h2>
                        <div className='!flex !items-center !gap-2'>
                            <div className='!flex !items-center !gap-1'>
                            {
                                mergeItems.length > 0 && 
                                    <>
                                    <IonIcon 
                                        icon={closeCircleOutline}
                                        className='text-red-500'
                                        onClick={() => emptyMergeSelection()}
                                    />
                                    {mergeItems.length}
                                    </>
                            }
                                <IonIcon 
                                    icon={gitMergeOutline} 
                                    className={`text-2xl cursor-pointer ${mergeItems.length === 0 && 'text-gray-700'}`}
                                    onClick={() => mergeClientIds()}
                                />
                            </div>
                            <IonIcon 
                                icon={addOutline} 
                                className='text-4xl cursor-pointer' 
                                onClick={() => newClientRecord()}
                            />
                        </div>
                    </div>

                    {error && !fetching && (
                        <div className="flex flex-col items-center justify-center h-64 px-4">
                        <IonIcon icon={alertCircleOutline} className="text-6xl text-red-500 mb-4" />
                        <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Reports</h3>
                        <p className="text-gray-600 text-center">{error}</p>
                        <IonButton className="mt-4" onClick={() => fetchLinkages(1)}>
                            Try Again
                        </IonButton>
                        </div>
                    )}

                    {/* --- PAGINATION CONTROLS --- */}
                    {!fetching && !error && lastPage > 1 && (
                        <div className="flex justify-between items-center mb-2 px-2">
                            <IonButton 
                                size="small" 
                                fill="outline" 
                                onClick={handlePrevPage} 
                                disabled={currentPage === 1}
                                className='!text-xs !border !border-none !bg-transparent'
                            >
                                Previous
                            </IonButton>
                            
                            <span className="text-sm text-gray-500">
                                Page {currentPage} of {lastPage}
                            </span>
                            
                            <IonButton 
                                size="small" 
                                fill="outline" 
                                onClick={handleNextPage} 
                                disabled={currentPage === lastPage}
                                className='!text-xs !border !border-none !bg-transparent'
                            >
                                Next
                            </IonButton>
                        </div>
                    )}

                    <section className="panel !h-[55vh] !overflow-y-scroll" style={{ paddingTop: 4, paddingBottom: 4 }}>
                        {fetching && (
                            <div className="flex flex-col items-center justify-center h-64">
                            <IonSpinner name="crescent" className="text-primary-600" />
                            <p className="mt-4 text-gray-600">Loading log...</p>
                            </div>
                        )}
                        {!fetching && !error &&
                           ( filteredReports.length > 0 ?
                            filteredReports.map((row) => (
                                <div className="row-item !justify-between" key={row.id}>
                                    <div>
                                        <div className="row-title">
                                            {row.uid}
                                        </div>
                                        <div className="row-sub">{row.facility}</div>
                                        <div className='row-sub !text-[10px]'>{row.created_at}</div>
                                    </div>
                                    <div className='!flex !items-center !gap-2'>
                                        <IonIcon 
                                            icon={gitMergeOutline} 
                                            size='small' 
                                            className={`!text-white text-2xl row-amount`} 
                                            onClick={() => selectToMerge(row)}
                                        />
                                        <IonIcon 
                                            icon={createOutline} 
                                            size='small' 
                                            className={`!text-green-400 text-2xl row-amount`} 
                                            onClick={() => editClientId(row)}
                                        />
                                    </div>
                                </div>
                            )) : 
                            <div className='!p-1'>
                                <span className='!font-extralight !text-gray-400'>No record displayed yet! Select a facility or search with a client ID</span>
                            </div>)
                        }
                    </section>

                    {/* Modals... */}
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

                    <IonModal 
                        isOpen={mergeModal} 
                        onDidDismiss={() => setMergeModal(false)}
                        breakpoints={[0, 0.25, 0.5, 0.87, 1]}
                        initialBreakpoint={0.87}
                        backdropBreakpoint={1}
                        handleBehavior="cycle"
                    >
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>
                                    <div className='!flex !items-center !justify-between'>
                                        <span>Merge Client ID<span className='text-sm'> s</span></span>
                                        <IonIcon 
                                            icon={closeCircleOutline} 
                                            size='large' 
                                            className='!text-red-500' 
                                            onClick={() => setMergeModal(false)}
                                        />
                                    </div>
                                </IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="!px-12">
                            <MergeForm 
                                mergeItems={mergeItems}
                                setMergeModal={setMergeModal} 
                                setIsUpdated={setIsUpdated} 
                                setMergeItems={setMergeItems}
                            />
                        </IonContent>
                    </IonModal>
                </div>
            </IonContent>
        </IonApp>
    )
}

export default Linkage