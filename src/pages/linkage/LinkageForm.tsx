import React, { useCallback, useEffect, useState } from "react"
import { ClientIdProps, Formfields } from "../../types/auth.types";
import { get_formfields, link_client_ids, update_client_ids } from "../../apis/log_apis";
import { IonAlert, IonButton, IonCheckbox, IonCol, IonDatetime, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonRadio, IonRadioGroup, IonRange, IonRow, IonSelect, IonSelectOption, IonSpinner, IonText, IonTextarea, IonToggle } from "@ionic/react";
import { alertCircleOutline, createOutline, pencil, pencilOutline, pencilSharp } from "ionicons/icons";
import SearchFilter from "./SearchFilter";

interface SetShowModalProps {
    setShowModal: (value: boolean) => void;
    setIsUpdated: (value: number) => void;
    isEditing: ClientIdProps | null;
}

const LinkageForm: React.FC<SetShowModalProps> = ({setShowModal, setIsUpdated, isEditing }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formfields, setFormfields] = useState<Formfields[]>([]);
    const token = localStorage.getItem('authToken');
    const form_id = 'cidlink'
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [facility, setFacility] = useState(isEditing ? isEditing?.facility : '');
    const [submitting, setSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [field_id, setField_id] = useState('');

    console.log(isEditing);

    const handleInputChange = (fieldName: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));

        // Clear error for this field
        if (errors[fieldName]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const validateField = (field: Formfields, value: any): string | null => {
        if (field.required === 'required' && !value) {
            return `${field.display_name} is required`;
        }
        return null;
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        formfields.forEach((field) => {
            const value = formData[field.field_name];
            const error = validateField(field, value);
            if (error) {
                newErrors[field.field_name] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(Object.keys(formData).length === 0){
            return 'One of the IDs must be entered!';
        }

        if (validateForm()) {
            const data = {
                facility,
                formData
            }
            
            setSubmitting(true);
            
            // Simulate API call
            try {
                // Replace with actual Register logic
                const response = isEditing ?
                    await update_client_ids(token, isEditing?.id, facility, formData) :
                    await link_client_ids(token, facility, formData);
        
                if(response){
                    setIsUpdated(Date.now());
                    setResponseMessage('Client ID successfully linked!')
                    setShowAlert(true)
                    setTimeout(() => setShowModal(false), 1000)
                    //refresh();
                }
                //console.log('Register successful', data);
                // Navigate to dashboard
            } catch (err) {
                setResponseMessage('Could not link Clinet ID!');
                setShowAlert(true)
            } finally {
                setShowAlert(false);
                setSubmitting(false);
            }
            console.log(data);
        }
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

    useEffect(() => {
        if (isEditing) {
            setFormData(JSON.parse(isEditing.formdata));
        }
    }, [isEditing]);

    console.log(facility)


    const renderField = (field: Formfields) => {
        const value = formData[field.field_name] || '';
        const error = errors[field.field_name];
        const isRequired = field.required === 'required';
        const fieldId = `field-${field.id}`;

        switch (field.input_type) {
            case 'text':
                return (
                    <IonItem key={field.id} className={`${error ? 'ion-invalid' : ''} field`}>
                        <IonLabel position="stacked">
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <div className="!w-full flex items-center justify-between">
                            <IonInput
                                id={fieldId}
                                value={formData[field.field_name] || ''}
                                placeholder={`Enter ${field.display_name.toLowerCase()}`}
                                onIonChange={(e) => {   
                                        field_id === fieldId && handleInputChange(field.field_name, e.detail.value)
                                    }
                                }
                                readonly={field_id !== fieldId}
                                required={isRequired}
                                aria-describedby={`${fieldId}-error`}
                                className="w-full !h-8"
                            />
                            <div className="flex justify-end">
                                <IonIcon 
                                    icon={pencilOutline} 
                                    className={`${field_id !== fieldId && "text-gray-600"}`} 
                                    onClick={() => setField_id(fieldId)}
                                />
                            </div>
                        </div>
                        {error && (
                            <IonNote color="danger" id={`${fieldId}-error`}>
                                <IonIcon icon={alertCircleOutline} />
                                {error}
                            </IonNote>
                        )}
                    </IonItem>
                );

            case 'email':
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonInput
                            id={fieldId}
                            type="email"
                            value={value}
                            placeholder={`Enter ${field.display_name.toLowerCase()}`}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.value)
                            }
                            required={isRequired}
                        />
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );

            case 'password':
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonInput
                            id={fieldId}
                            type="password"
                            value={value}
                            placeholder={`Enter ${field.display_name.toLowerCase()}`}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.value)
                            }
                            required={isRequired}
                        />
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );

            case 'number':
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonInput
                            id={fieldId}
                            type="number"
                            value={value}
                            placeholder={`Enter ${field.display_name.toLowerCase()}`}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.value)
                            }
                            required={isRequired}
                        />
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );

            case 'textarea':
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonTextarea
                            id={fieldId}
                            value={value}
                            placeholder={`Enter ${field.display_name.toLowerCase()}`}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.value)
                            }
                            rows={4}
                            required={isRequired}
                        />
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );

            case 'select':{
                const options = field.options ? JSON.parse(field.options) : [];
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonSelect
                            id={fieldId}
                            value={value}
                            placeholder={`Select ${field.display_name.toLowerCase()}`}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.value)
                            }
                            //{/**required={isRequired}*/}
                        >
                            {options.map((option: string, index: number) => (
                                <IonSelectOption key={index} value={option}>
                                    {option}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );}

            case 'checkbox':
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonCheckbox
                            id={fieldId}
                            checked={!!value}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.checked)
                            }
                        />
                        <IonLabel>
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );

            case 'radio':{
                const radioOptions = field.options ? JSON.parse(field.options) : [];
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel>
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonRadioGroup
                            value={value}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.value)
                            }
                        >
                            {radioOptions.map((option: string, index: number) => (
                                <IonRadio key={index} value={option}>
                                    {option}
                                </IonRadio>
                            ))}
                        </IonRadioGroup>
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );}

            case 'date':
            case 'datetime':
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonDatetime
                            id={fieldId}
                            value={value}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.value)
                            }
                            presentation={field.input_type === 'date' ? 'date' : 'date-time'}
                        />
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );

            case 'toggle':
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel>
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonToggle
                            id={fieldId}
                            checked={!!value}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.checked)
                            }
                        />
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );

            case 'range':
                {const rangeOptions = field.options ? JSON.parse(field.options) : {};
                return (
                    <IonItem key={field.id} className={error ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">
                            {field.display_name}
                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </IonLabel>
                        <IonRange
                            id={fieldId}
                            value={value || rangeOptions.min || 0}
                            min={rangeOptions.min || 0}
                            max={rangeOptions.max || 100}
                            step={rangeOptions.step || 1}
                            onIonChange={(e) =>
                                handleInputChange(field.field_name, e.detail.value)
                            }
                            pin={true}
                        />
                        {error && <IonNote color="danger">{error}</IonNote>}
                    </IonItem>
                );}

            default:
                return (
                    <IonItem key={field.id}>
                        <IonLabel>
                            {field.display_name}
                            <IonNote color="medium"> (Unsupported field type: {field.input_type})</IonNote>
                        </IonLabel>
                    </IonItem>
                );
        }
    };

    return (
        <div>
        {
            loading && (
                <div className="flex flex-col items-center justify-center h-64">
                <IonSpinner name="crescent" className="text-primary-600" />
                <p className="mt-4 text-gray-600">Loading form...</p>
                </div>
            )
        }
        {
            !loading &&
            <form onSubmit={handleSubmit} className="dynamic-form">
                <IonGrid>
                    <IonRow>
                        <IonCol size="12">
                            {formfields.map((field) => renderField(field))}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <SearchFilter 
                                facility={facility}
                                setFacility={setFacility}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <IonButton
                                type="submit"
                                expand="block"
                                disabled={submitting}
                                className="btn-primary ion-margin-top"
                            >
                                {submitting ? <IonSpinner name="crescent" className="text-white" /> : 'Submit'}
                            </IonButton>
                            {Object.keys(errors).length > 0 && (
                                <IonText color="danger" className="ion-padding-top">
                                    <p className="flex items-center gap-2">
                                        <IonIcon icon={alertCircleOutline} />
                                        Please fix all errors before submitting.
                                    </p>
                                </IonText>
                            )}
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </form>
        }
        <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={"Alert"}
            message={responseMessage}
            buttons={['OK']}
        />
        </div>
    )
}

export default LinkageForm