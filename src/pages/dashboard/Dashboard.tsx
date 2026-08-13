import React, { useCallback, useEffect, useState } from 'react';
import { IonApp, IonContent, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSkeletonText, IonSpinner, IonSplitPane } from "@ionic/react"
import '../Home.css'
import { arrowDownOutline, arrowUpOutline, bagHandleOutline, cardOutline, notificationsOutline, peopleOutline, trendingUpOutline, walletOutline } from 'ionicons/icons';
import { activity, stats, summary } from '../dashboard/data/dasbhoard';
import { useAuth } from '../../context/AuthContext';
import WelcomeText from '../../components/WelcomeText';
import { Formfields } from '../../types/auth.types';
import { get_formfields } from '../../apis/log_apis';

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

const Dashboard: React.FC = () => {

    //const [activeTab, setActiveTab] = useState('Dashboard');
    //const contentRef = useRef(null);
    //const menuId = 'main-menu';
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState('W');
    const [error, setError] = useState<string | null>(null);
    const [formfields, setFormfields] = useState<Formfields[]>([]);
    const token = localStorage.getItem('authToken');
    const form_id = 'cidlink';

    const getRandomInt = (max:number) => {
        return Math.floor(Math.random() * max);
    }

    function getRandomHexColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const refresh = async (e:any) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        setLoading(false);
        e.detail.complete();
    };

    const fetchFormfields = useCallback(async () => {
        if (!token) {
            setError('Authentication required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await get_formfields(token, form_id);
            if (data && Array.isArray(data)) {
                setFormfields(data);
            } else {
                setFormfields([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load form fields';
            setError(message);
            setFormfields([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFormfields();
    }, [fetchFormfields])
    

    return (
        <IonApp>
            {/*<IonSplitPane contentId="main-content" when="md">
                <Sidebar 
                    menuId={menuId}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <IonPage id='main-content'>
                    <Header />
                    <IonContent className="aurora">
                        <DashboardContent />
                        <Footer />
                    </IonContent>
                </IonPage>
            </IonSplitPane>*/}
            <IonContent fullscreen className="aurora">
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                <IonRefresherContent pullingIcon="chevron-down-circle-outline" />
                </IonRefresher>

                <div className="page" style={{ paddingTop: 60 }}>
                    <WelcomeText />

                    <section className="balance-card">
                        <div className="balance-label">Total linkage</div>
                        {loading ? (
                        <IonSkeletonText animated style={{ width: '58%', height: 34, marginTop: 8 }} />
                        ) : (
                        <div className="balance-value !text-6xl">
                            {getRandomInt(5000)}
                        </div>
                        )}
                        <div className="balance-meta">
                        <IonIcon icon={arrowUpOutline} />
                        <span>
                            <b>{Math.round(summary.changePct)}</b> this month
                        </span>
                        </div>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mt-12"></div>

                    <div className="section-head !px-2">
                        <h2 className="section-title">Overview</h2>
                        <span className="section-link">This month</span>
                    </div>
                {

                    loading && (
                        <div className="flex flex-col items-center justify-center h-64">
                        <IonSpinner name="crescent" className="text-primary-600" />
                        <p className="mt-4 text-gray-600">Loading stats...</p>
                        </div>
                    )
                }
                {
                    !loading &&
                    <div className="stat-grid">
                        {formfields.map((s) => (
                        <article className="stat-card" key={s.id}>
                            <div className='flex items-center justify-between'>
                                <div className="stat-label !uppercase">{s.display_name}</div>
                                <div className={`stat-icon bg-[#b14dff]/20`}>
                                    <IonIcon icon={walletOutline} />
                                </div>
                            </div>   
                            <div className='flex justify-between items-end'>
                                {loading ? (
                                <IonSkeletonText animated style={{ width: '65%', height: 22, marginTop: 4 }} />
                                ) : (
                                <div className="stat-value !text-gray-500 !text-3xl !font-extralight">{getRandomInt(1000)}</div>
                                )}
                                <div className={`stat-delta ${getRandomInt(1000) > 500 ? 'up' : 'down'}`}>
                                    <IonIcon icon={arrowUpOutline} />
                                    {getRandomInt(100)}
                                </div>
                            </div>
                        </article>
                        ))}
                    </div>
                }
                    {/*<div className="stat-grid">
                        {stats.map((s) => (
                        <article className="stat-card" key={s.key}>
                            <div className="stat-icon" style={{ background: s.tint, color: s.color }}>
                            {/*<IonIcon icon={icons[s.icon]} />
                            </div>
                            <div className="stat-label">{s.label}</div>
                            {loading ? (
                            <IonSkeletonText animated style={{ width: '65%', height: 22, marginTop: 4 }} />
                            ) : (
                            <div className="stat-value">{s.value}</div>
                            )}
                            <div className={`stat-delta ${s.up ? 'up' : 'down'}`}>
                            <IonIcon icon={s.up ? arrowUpOutline : arrowDownOutline} />
                            {s.delta}
                            </div>
                        </article>
                        ))}
                    </div>*/}

                {/*<div className="section-head">
                    <h2 className="section-title">Revenue</h2>
                </div>

                <section className="panel">
                    <IonSegment
                        className="seg"
                        value={range}
                        mode="ios"
                    >
                        <IonSegmentButton value="W">Week</IonSegmentButton>
                        <IonSegmentButton value="M">Month</IonSegmentButton>
                        <IonSegmentButton value="Y">Year</IonSegmentButton>
                    </IonSegment>
                    <RevenueChart labels={active.labels} data={active.data} />
                </section>*/}
                </div>
            </IonContent>
        </IonApp>
    )
}

export default Dashboard