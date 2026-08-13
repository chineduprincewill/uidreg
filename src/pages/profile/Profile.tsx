import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IonAlert, IonApp, IonButton, IonContent, IonIcon, IonInput, IonPage, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSkeletonText, IonSpinner, IonSplitPane } from "@ionic/react"
import '../Home.css'
import { addOutline, alertCircleOutline, arrowDownOutline, arrowUpOutline, bagHandleOutline, cardOutline, closeCircleOutline, createOutline, filterOutline, notificationsOutline, pencilOutline, peopleOutline, shieldCheckmarkOutline, trendingUpOutline } from 'ionicons/icons';
import { activity, stats, summary } from '../dashboard/data/dasbhoard';
import { User } from '../../types/auth.types';
import { activate_user, get_cidlink_users } from '../../apis/log_apis';
import { useAuth } from '../../context/AuthContext';
import WelcomeText from '../../components/WelcomeText';

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

const Profile: React.FC = () => {

    const { user } = useAuth();
    //const [activeTab, setActiveTab] = useState('Dashboard');
    //const contentRef = useRef(null);
    //const menuId = 'main-menu';
    const token = localStorage.getItem('authToken');
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState('W');
    const [users, setUsers] = useState<User[]>([]);
    const [filteredReports, setFilteredReports] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [updateid, setUpdateid] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [updated, setUpdated] = useState<number>(0);
    
        // Get unique values for filters
        /**const uniqueStatuses = useMemo(() => {
            const statuses = reports.map(r => r.Status).filter(Boolean);
            return [...new Set(statuses)];
        }, [reports]);*/
    
    const getFirstCharacters = (sentence:string) => {
        return sentence
            .split(' ')           // Split by spaces
            .map(word => word.charAt(0)) // Get first character
            .join('');            // Join back together
    }

    const updateUserStatus = (id:number, username:string, status:number) => {
        setUpdateid(id);
        setShowUpdateAlert(true);
        setAlertMessage(`Are you sure you want to ${status === 1 ? 'disable' : 'enable'} ${username}?`)
    }

    const confirmUpdate = async() => {
        setShowUpdateAlert(false);

        setLoading(true);
        
        // Simulate API call
        try {
            // Replace with actual Register logic
            const response = await activate_user(token, updateid);
    
            if(response){
                setResponseMessage('Update Successfull!');
                setShowAlert(true)
                setUpdated(Date.now())
                //refresh();
            }
            //console.log('Register successful', data);
            // Navigate to dashboard
        } catch (err) {
            setResponseMessage('Could not update!');
            setShowAlert(true)
        } finally {
            setShowAlert(false);
            setLoading(false);
        }
    }

    // Fetch users
    const fetchUsers = useCallback(async () => {
        if (!token) {
            setError('Authentication required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await get_cidlink_users(token);
            if (data && Array.isArray(data)) {
                setUsers(data);
                setFilteredReports(data);
            } else {
                setUsers([]);
                setFilteredReports([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load reports';
            setError(message);
            setUsers([]);
            setFilteredReports([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, updated]);

    // Apply filters and search
    useEffect(() => {
        let filtered = [...users];

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(term) ||
                user.email?.toLowerCase().includes(term) ||
                user.role?.toLowerCase().includes(term) ||
                user.state_name?.toLowerCase().includes(term) 
            );
        }

        setFilteredReports(filtered);
    }, [users, searchTerm]);

    const refresh = async (e:any) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        setLoading(false);
        e.detail.complete();
    };

    console.log(users)

    return (
        <IonApp>
            <IonContent fullscreen className="aurora"> 
                <IonRefresher slot="end" onIonRefresh={refresh}>
                    <IonRefresherContent pullingIcon="chevron-down-circle-outline" />
                </IonRefresher>

                <div className="page" style={{ paddingTop: 60 }}>
                        <WelcomeText />

                    <div className="field-box w-full flex items-center gap-0 !border !border-gray-300 !rounded-2xl">
                        <IonInput
                            type="text"
                            placeholder="Filter User"
                            className="!pl-4 !h-8 !px-4"
                            value={searchTerm}
                            onIonChange={(e) => setSearchTerm(e.detail.value || '')}
                            mode="md"
                        />
                        <IonIcon icon={filterOutline} className='text-gray-400 pl-4' />
                    </div>

                    <div className="section-head">
                        <h2 className="section-title !text-xl !font-extralight !px-2">Users</h2>
                    </div>

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center h-64 px-4">
                        <IonIcon icon={alertCircleOutline} className="text-6xl text-red-500 mb-4" />
                        <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Reports</h3>
                        <p className="text-gray-600 text-center">{error}</p>
                        <IonButton className="mt-4" onClick={fetchUsers}>
                            Try Again
                        </IonButton>
                        </div>
                    )}

                    <section className="panel" style={{ paddingTop: 4, paddingBottom: 4 }}>
                        {
                            loading && (
                            <div className="flex flex-col items-center justify-center h-64">
                            <IonSpinner name="crescent" className="text-primary-600" />
                            <p className="mt-4 text-gray-600">Loading users...</p>
                            </div>
                        )}
                        {
                            !loading && !error &&
                            filteredReports.map((row) => (
                                <div 
                                    className="row-item" key={row.id}
                                    onClick={() => updateUserStatus(row.id, row.name, row.status)}
                                >
                                    <div className="row-avatar !uppercase !rounded-full px-2 pb-2 pt-1.5 !bg-gray-700">
                                        {getFirstCharacters(row.name)}
                                    </div>
                                    <div>
                                        <div className="row-title">{row.name}</div>
                                        <div className="row-sub">{row.email}</div>
                                    </div>
                                    <IonIcon icon={row?.status === 1 ? shieldCheckmarkOutline : closeCircleOutline} size='large' className={`${row.status === 1 ? '!text-green-400' : 'text-orange-600'} text-2xl row-amount`} />
                                </div>
                            ))
                        }
                    </section>
                </div>
                <IonAlert
                    isOpen={showUpdateAlert}
                    onDidDismiss={() => setShowUpdateAlert(false)}
                    header="Confirm Update"
                    message={alertMessage}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                        },
                        {
                            text: 'Yes',
                            role: 'destructive',
                            handler: confirmUpdate,
                        },
                    ]}
                />
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={"Alert"}
                    message={responseMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonApp>
    )
}

export default Profile