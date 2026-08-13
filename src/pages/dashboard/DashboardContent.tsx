import React, { useState } from 'react';
import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonLabel, IonRow } from "@ionic/react"
import { analyticsOutline, checkmarkCircleOutline, homeOutline, notificationsOutline, timeOutline } from "ionicons/icons"
import WelcomeText from '../../components/WelcomeText';

const DashboardContent: React.FC = () => {

    return (
        <div className="p-4 md:p-6 min-h-full mb-8">
          {/* header / welcome */}
          <div className="flex flex-wrap items-center justify-between mb-0">
            <div>
              <h2 className="text-2xl font-bold text-[#4b2571] flex items-center gap-2">
                <span className="bg-indigo-100 text-[#4b2571] p-2 rounded-xl inline-flex">
                  <IonIcon icon={homeOutline} className="text-xl"></IonIcon>
                </span>
                <span>Dashboard</span>
              </h2>
              <WelcomeText />
            </div>
          </div>

          {/* stats cards */}
          <IonGrid className="p-0">
            <IonRow className="gap-4 md:gap-0">
              {[
                { label: 'Total Revenue', value: '$24,560', icon: '💰', change: '+12%', bg: 'bg-emerald-50' },
                { label: 'New Users', value: '1,284', icon: '👤', change: '+8%', bg: 'bg-blue-50' },
                { label: 'Active Sessions', value: '432', icon: '🔄', change: '+3%', bg: 'bg-amber-50' },
                { label: 'Bounce Rate', value: '23.5%', icon: '📊', change: '-2%', bg: 'bg-rose-50' },
              ].map((stat, idx) => (
                <IonCol size="12" sizeMd="3" key={idx}>
                  <IonCard className={`shadow-sm border border-slate-200/60 rounded-2xl p-0 h-full ${stat.bg}`}>
                    <div className={`p-5 rounded-2xl ${stat.bg}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                          <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                        </div>
                        <span className="text-3xl">{stat.icon}</span>
                      </div>
                      <div className="mt-3 flex items-center text-sm">
                        <span className={`font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {stat.change}
                        </span>
                        <span className="text-slate-400 ml-2">vs last month</span>
                      </div>
                    </div>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          {/* recent activity & chart placeholder */}
          <IonGrid className="p-0 mt-4">
            <IonRow className="gap-4 md:gap-0">
              <IonCol size="12" sizeMd="7">
                <IonCard className="shadow-sm border border-slate-200/60 rounded-2xl p-2">
                  <IonCardHeader className="pb-0">
                    <IonCardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <span className="bg-indigo-100 p-1.5 rounded-lg">
                        <IonIcon icon={analyticsOutline}></IonIcon>
                      </span>
                      Weekly activity
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="h-36 flex items-end justify-between gap-2 mt-2">
                      {[65, 40, 80, 55, 95, 70, 50].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full max-w-[30px] bg-indigo-500 rounded-lg transition-all hover:bg-indigo-600" 
                            style={{ height: `${h}%` }}
                          ></div>
                          <span className="text-[10px] text-slate-400">Day{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="12" sizeMd="5">
                <IonCard className="shadow-sm border border-slate-200/60 rounded-2xl p-2">
                  <IonCardHeader className="pb-0">
                    <IonCardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <span className="bg-emerald-100 p-1.5 rounded-lg">
                        <IonIcon icon={checkmarkCircleOutline}></IonIcon>
                      </span>
                      Recent tasks
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <ul className="space-y-2 text-sm">
                      {['Design review', 'Deploy v2.0', 'Client meeting', 'Update docs'].map((task, i) => (
                        <li key={i} className="flex items-center justify-between border-b border-slate-100 pb-1.5 last:border-0">
                          <span className="text-slate-700 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                            {task}
                          </span>
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <IonIcon icon={timeOutline}></IonIcon> 2h ago
                          </span>
                        </li>
                      ))}
                    </ul>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
    )
}

export default DashboardContent