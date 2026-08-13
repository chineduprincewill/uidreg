import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonChip,
    IonIcon,
} from '@ionic/react';
import SearchableSelectModal from './SearchableSelectModal';

const AdvancedSelectPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<string | string[]>([]);
    const [singleSelected, setSingleSelected] = useState('');

    const options = [
        { value: 'hiv', label: 'HIV Program', group: 'Health Programs' },
        { value: 'tb', label: 'TB Program', group: 'Health Programs' },
        { value: 'malaria', label: 'Malaria Program', group: 'Health Programs' },
        { value: 'mnch', label: 'MNCH Program', group: 'Health Programs' },
        { value: 'pepfar', label: 'PEPFAR Initiative', group: 'Funding Sources' },
        { value: 'globalfund', label: 'Global Fund', group: 'Funding Sources' },
        { value: 'nigerian', label: 'Nigerian Government', group: 'Funding Sources' },
        { value: 'lagos', label: 'Lagos State', group: 'Location', metadata: { region: 'South West', population: 'High' } },
        { value: 'kano', label: 'Kano State', group: 'Location', metadata: { region: 'North West', population: 'High' } },
        { value: 'abuja', label: 'Federal Capital Territory', group: 'Location', metadata: { region: 'North Central', population: 'Medium' } },
    ];

    const handleSelect = (value: string | string[]) => {
        setSelected(value);
    };

    const handleSingleSelect = (value: string | string[]) => {
        if (typeof value === 'string') {
            setSingleSelected(value);
        }
    };

    // Advanced custom filter function
    const customFilter = (option: any, searchTerm: string): boolean => {
        const search = searchTerm.toLowerCase().trim();
        const words = search.split(' ');

        // Search in label, value, group, and metadata
        const searchableText = [
            option.label,
            option.value,
            option.group || '',
            option.metadata ? JSON.stringify(option.metadata) : '',
        ].join(' ').toLowerCase();

        // Check if all words match
        return words.every(word => searchableText.includes(word));
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Advanced Filtering</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Single Select */}
                <IonItem button onClick={() => setShowModal(true)}>
                    <IonLabel>
                        <h3>Single Select</h3>
                        <p>{singleSelected || 'Select an option...'}</p>
                    </IonLabel>
                </IonItem>

                {/* Multiple Select */}
                {/*<IonItem button onClick={() => setShowModal(true)}>
                    <IonLabel>
                        <h3>Multiple Select</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                            {Array.isArray(selected) && selected.map((val) => {
                                const option = options.find((o) => o.value === val);
                                return option ? (
                                    <IonChip key={val} color="primary">
                                        <IonLabel>{option.label}</IonLabel>
                                    </IonChip>
                                ) : null;
                            })}
                            {Array.isArray(selected) && selected.length === 0 && (
                                <span className="text-gray-400">No options selected</span>
                            )}
                        </div>
                    </IonLabel>
                </IonItem>*/}

                {/* Trigger Modal */}
                <IonButton expand="block" onClick={() => setShowModal(true)}>
                    Open Advanced Select
                </IonButton>

                {/* Modal */}
                <SearchableSelectModal
                    isOpen={showModal}
                    onDismiss={() => setShowModal(false)}
                    onSelect={handleSelect}
                    options={options}
                    multiple={true}
                    selectedValue={selected}
                    title="Select Programs & Initiatives"
                    searchPlaceholder="Search programs, funding sources, locations..."
                    groupBy="group"
                    allowCustom={true}
                    filterFunction={customFilter}
                />
            </IonContent>
        </IonPage>
    );
};

export default AdvancedSelectPage;