import { IonAvatar, IonChip, IonIcon, IonLabel } from "@ionic/react";
import { settingsOutline } from "ionicons/icons";
import React from "react";
import WelcomeText from "../../components/WelcomeText";

const SettingsContent: React.FC = () => {

    return (
        <div className="p-4 md:p-6 min-h-full mb-8">
            {/* header / welcome */}
            <div className="grid mb-0">
                <div>
                    <h2 className="text-2xl font-bold text-[#4b2571] flex items-center gap-2">
                    <span className="bg-indigo-100 text-[#4b2571] p-2 rounded-xl inline-flex">
                        <IonIcon icon={settingsOutline} className="text-xl"></IonIcon>
                    </span>
                    <span>Settings</span>
                    </h2>
                    <WelcomeText />
                </div>
            </div>
        </div>
    )
}

export default SettingsContent