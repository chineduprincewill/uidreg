import { IonRouterLink } from "@ionic/react";
import React from "react";

export default function Brand() {
    return (
      <div className="flex justify-center">
        {/*<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="50" r="10" fill="skyblue" stroke="black"/>
            <circle cx="100" cy="25" r="10" fill="lightgreen" stroke="black"/>
            <circle cx="100" cy="75" r="10" fill="lightcoral" stroke="black"/>
            <circle cx="170" cy="50" r="10" fill="gold" stroke="black"/>

            <line x1="40" y1="50" x2="90" y2="25" stroke="white" strokeWidth="1.5"/>
            <line x1="40" y1="50" x2="90" y2="75" stroke="white" strokeWidth="1.5"/>
            <line x1="110" y1="25" x2="160" y2="50" stroke="white" strokeWidth="1.5"/>
            <line x1="110" y1="75" x2="160" y2="50" stroke="white" strokeWidth="1.5"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                <circle cx="30" cy="30" r="10" fill="#3498db"/>
                <circle cx="70" cy="30" r="10" fill="#2ecc71"/>
                <circle cx="50" cy="70" r="10" fill="#e74c3c"/>
                
                <line x1="30" y1="30" x2="50" y2="70" stroke="#8e44ad" strokeWidth="3"/>
                <line x1="70" y1="30" x2="50" y2="70" stroke="#8e44ad" strokeWidth="3"/>
                <line x1="30" y1="30" x2="70" y2="30" stroke="#8e44ad" strokeWidth="3"/>
                
                <circle cx="50" cy="45" r="8" fill="#8e44ad" stroke="white" strokeWidth="2"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
                <rect x="25" y="25" width="30" height="30" rx="4" fill="#f8f9fa" stroke="#3498db" strokeWidth="3"/>
                <line x1="35" y1="35" x2="45" y2="35" stroke="#3498db" strokeWidth="2"/>
                <line x1="35" y1="42" x2="45" y2="42" stroke="#3498db" strokeWidth="2"/>
                <line x1="35" y1="49" x2="45" y2="49" stroke="#3498db" strokeWidth="2"/>
                
                <path d="M55 40 L65 35 M65 35 C70 30, 70 20, 65 15 L60 10" fill="none" stroke="#8e44ad" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="60" cy="8" r="4" fill="#8e44ad"/>
            </svg>*/}
            <IonRouterLink
              routerLink="/home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
                  <circle cx="40" cy="30" r="18" fill="none" stroke="#3498db" strokeWidth="4"/>
                  <circle cx="25" cy="55" r="18" fill="none" stroke="#2ecc71" strokeWidth="4"/>
                  <circle cx="55" cy="55" r="18" fill="none" stroke="#e74c3c" strokeWidth="4"/>
                  
                  <circle cx="40" cy="50" r="6" fill="#ffffff"/>
              </svg>
            </IonRouterLink>
      </div>
    );
  }
  