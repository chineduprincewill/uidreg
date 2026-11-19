import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonBadge,
  IonImg,
  useIonRouter,
  IonChip,
  IonAvatar,
} from '@ionic/react';
import '../pages/Home.css'; // We'll create this
import { addCircleOutline, cartOutline, contractOutline, gridOutline, listOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';

// 🔥 Define the prop types
interface SidebarProps {
  menuId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuId, activeTab, setActiveTab }) => {

    const { user, logout } = useAuth();
    const router = useIonRouter();

    const menuItems = [
      { label: 'Dashboard', icon: gridOutline, path: '/dashboard', badge: null },
      { label: 'Create', icon: addCircleOutline, path: '/create', badge: null },
      { label: 'Track', icon: contractOutline, path: '/track', badge: null },
      { label: 'Log', icon: listOutline, path: '/log', badge: null },
      { label: 'Settings', icon: settingsOutline, path: '/settings', badge: null },
    ];

    const navigate = (label: string, url: string) => {
      setActiveTab(label);
      router.push(url, 'forward', 'replace');
    }

    return (
        <IonMenu contentId="main-content" menuId={menuId} type="overlay" className="shadow-xl" content="main-content">
          <IonHeader className="ion-no-border bg-[#f9f2d5]">
            <IonToolbar color="transparent" className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                  <IonImg 
                      src="/assets/logo.png" 
                      alt="App Logo"
                      className='w-8 h-8'
                  />
                </div>
                <div>
                  <IonTitle className="text-xl font-bold text-[#4b2571] p-0">UIDReg</IonTitle>
                  <p className="text-xs text-[#4b2571] -mt-1">v2.0 · admin</p>
                </div>
              </div>
            </IonToolbar>
          </IonHeader>
          <IonContent className="bg-slate-50">
            <div className='flex items-center gap-2 my-4'>
              <IonChip color="primary" outline={true} className="px-3 py-1">
                  <IonAvatar>
                      <img alt="avatar" src="https://i.pravatar.cc/40?img=12" />
                  </IonAvatar>
              </IonChip>
              <div className='grid'>
                <span className='text-sm text-gray-600'>{user && user?.email}</span>
                <span className='text-xs text-gray-600 mx-auto text-wrap'>{user && user?.facility+' | '+user?.facility_type}</span>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-800 to-transparent"></div>
            <IonList lines="none" className="py-2 bg-transparent">
              {menuItems.map((item, idx) => (
                <IonMenuToggle key={idx} autoHide={false}>
                  <IonItem 
                    button 
                    detail={false}
                    className={`mx-2 my-1 rounded-xl ${activeTab === item.label ? 'bg-indigo-50 text-[#4b2571] border-r-4 border-[#4b2571]' : 'text-slate-600 hover:bg-slate-100'}`}
                    onClick={() => navigate(item.label, item.path)}
                  >
                    <IonIcon icon={item.icon} slot="start" className="text-lg" />
                    <IonLabel className={`${activeTab === item.label ? "font-bold" : "font-medium"}`}>{item.label}</IonLabel>
                    {item.badge && (
                      <IonBadge color="danger" className="ml-auto text-xs">{item.badge}</IonBadge>
                    )}
                  </IonItem>
                </IonMenuToggle>
              ))}
            </IonList>
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <IonMenuToggle autoHide={false}>
                <IonItem 
                  button detail={false} className="mx-2 rounded-xl text-slate-500 hover:bg-slate-100"
                  onClick={() => logout()}
                >
                  <IonIcon icon={logOutOutline} slot="start" />
                  <IonLabel>Logout</IonLabel>
                </IonItem>
              </IonMenuToggle>
            </div>
          </IonContent>
        </IonMenu>
    );
};

export default Sidebar;