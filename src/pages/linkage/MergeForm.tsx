import React, { useState } from "react"
import { IonButton, IonCol, IonGrid, IonRow, IonSpinner } from "@ionic/react"
import { ClientIdProps } from "../../types/auth.types"
import { merge_client_ids } from "../../apis/log_apis";
import { FormData } from "../../types/logreports.types";

interface setMergeModalProps {
    setMergeModal: (value: boolean) => void;
    setIsUpdated: (value: number) => void;
    mergeItems: ClientIdProps[];
    setMergeItems: (value: ClientIdProps[]) => void;
}

const MergeForm: React.FC<setMergeModalProps> = ({ mergeItems, setMergeModal, setIsUpdated, setMergeItems }) => {

    const [submitting, setSubmitting] = useState(false);
    const token = localStorage.getItem('authToken');

    function mergeFormData(data: ClientIdProps[], id1: number, id2: number): FormData {
        // Find the two objects by id
        const obj1 = data.find((item: ClientIdProps) => item.id === id1);
        const obj2 = data.find((item: ClientIdProps) => item.id === id2);
        
        if (!obj1 || !obj2) {
          throw new Error('One or both objects not found');
        }
        
        // Parse formdata from both objects
        const formdata1: FormData = JSON.parse(obj1.formdata);
        const formdata2: FormData = JSON.parse(obj2.formdata);
        
        // Determine which is older based on created_at
        const date1 = new Date(obj1.created_at);
        const date2 = new Date(obj2.created_at);
        
        // Older data will be merged into newer data
        const [older, newer] = date1 < date2 ? [formdata1, formdata2] : [formdata2, formdata1];
        
        // Merge: newer takes precedence, older fills missing keys
        const merged: FormData = { ...older, ...newer };
        
        return merged;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(window.confirm('Are you sure you want to merge?')){
            const id1 = Math.max(...mergeItems.map(item => item.id));
            const id2 = Math.min(...mergeItems.map(item => item.id));
            const updated = mergeFormData(mergeItems, id1, id2);

            setSubmitting(true);
                        
            // Simulate API call
            try {
                const response = await merge_client_ids(token, id1, id2, updated);
        
                if(response){
                    setIsUpdated(Date.now());
                    setMergeItems([]);
                    setMergeModal(false);
                    //refresh();
                }
                //console.log('Register successful', data);
                // Navigate to dashboard
            } catch (err) {
                alert('Could not merge Clinet information!');
            } finally {
                setSubmitting(false);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="dynamic-form !p-4 mt-6">
            <IonGrid class="!grid !gap-4">
                {mergeItems.map(mit => (
                        <IonRow key={mit.id}>
                            <span className="!w-full !border !p-3 !rounded-md !border-white/20" key={mit.id}>
                                {mit.uid}
                            </span>
                        </IonRow>
                ))}
                <IonRow>
                    <IonButton
                        type="submit"
                        expand="block"
                        disabled={submitting}
                        className="!w-full btn-primary ion-margin-top"
                    >
                        {submitting ? <IonSpinner name="crescent" className="text-white" /> : 'Merge'}
                    </IonButton>
                </IonRow>
            </IonGrid>
        </form>
    )
}

export default MergeForm