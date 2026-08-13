import { IonAlert, IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCheckbox, IonChip, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonNote, IonSelect, IonSelectOption, IonSpinner, IonTextarea, IonTitle, IonToast, IonToolbar, useIonRouter } from "@ionic/react";
import { addCircleOutline, arrowBackOutline, cartOutline, closeCircleOutline, closeOutline, eyeOutline, notificationsOutline, saveOutline } from "ionicons/icons";
import React, { useCallback, useEffect, useState } from "react";
import WelcomeText from "../../components/WelcomeText";
import { FormData, FormField, RequestObject } from "../../types/logreports.types";
import { fetch_form_fields, submit_form } from "../../apis/log_apis";
import { format } from 'date-fns/format';
import { useHistory, useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Define the type for the URL parameters
type DispatchParams = {
    form_report_id: string;
};

const DispatchContent: React.FC = () => {

    const { form_report_id } = useParams<DispatchParams>();
    const { user } = useAuth();
    const history = useHistory();
    const router = useIonRouter();
    const [formfields, setFormfields] = useState<FormField[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState();
    const [fielderrors, setFielderrors] = useState();
    const formType = 'WasteLogic-Dispatch';
    const [formdata, setFormdata] = useState<FormData>();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedField, setSelectedField] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const navigate = (url: string) => {
        router.push(url, 'forward', 'replace');
        window.location.reload();
    }

    const report_id = Number(form_report_id);

    const fetchFormFields = useCallback(async () => {
        setLoading(true);
        //setError();

        try {
            const data = await fetch_form_fields(formType);
            if (data && Array.isArray(data)) {
                setFormfields(data);
            } else {
                setFormfields([]);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load form';
            //setErrors();
            setFormfields([]);
        } finally {
            setLoading(false);
            }
    }, []);

    const selectDatepicker = (fieldname: string) => {
        setShowDatePicker(true);
        setSelectedField(fieldname);
    }

    // Initial load
    useEffect(() => {
        fetchFormFields();
    }, [fetchFormFields]);

    const processRequestData = () => {
        const destructured = Object.entries(formdata || {});
        console.log(destructured);
        const final_request: RequestObject[] = [];
    
        destructured.forEach(([key, value]) => {
            if (formfields) {
                const matchedField = formfields.find(fld => fld.forms_text === key);
                
                const req_obj: RequestObject = {
                    state: user && user.state || null,
                    lga: user && user.lga || null,
                    facility: user && user.facility || null,
                    email: user && user.email || null,
                    data_value: value as string || null,
                    forms_title: formType || null,
                    forms_text: key,
                    forms_text_id: matchedField?.forms_text_id || null,
                    form_report_id: report_id,
                    form_module_id: Date.now()
                };
                
                final_request.push(req_obj);
            }
        });
        
        return final_request;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if(window.confirm('Are you confirming your entries?')){
            setSubmitting(true);

            try {
                const requestdata = processRequestData();
                
                // Wait for all submissions to complete
                const results = await Promise.all(requestdata.map(item => submit_form(item)));

                // Check if any submission failed
                const failed = results.filter(result => 
                    result !== 'success' && result !== undefined
                );
                
                if (failed.length > 0) {
                    // Some submissions failed
                    const errorMessages = failed.join(', ');
                    setSubmitError(`Failed: ${errorMessages}`);
                    setSubmitting(false);
                    toast.error(`Submission failed: ${errorMessages}`);
                } else {
                    // All successful
                    setSubmitSuccess(true);
                    setSubmitting(false);
                    toast.success('Form submitted successfully!');
                    
                    // Redirect to log page after short delay
                    setTimeout(() => {
                        history.replace('/log'); // or your log page route
                        window.location.reload();
                    }, 1500);
                }
                // All submissions successful
                setSubmitting(false);
                // Optionally show success message
            } catch (error) {
                console.error('Submission failed:', error);
                setSubmitting(false);
                // Optionally show error message
            }
        }
        //console.log(processRequestData());
    };

    const shouldRenderField = (field: FormField, formdata: Record<string, any>): boolean => {
        // Always render by default
        return true;
    };

    const onInputChange = (field: FormField, fieldName: string, value: any) => {

        if (value === null || value === undefined) {
            value = ''; // or keep as null depending on your needs
        }

        console.log(`Field "${fieldName}" changed to:`, value);
    
        // 1. Update the form data
        setFormdata(prev => ({
          ...prev,
          [fieldName]: value
        }));
    
        // 2. Mark field as touched
        //setTouchedFields(prev => new Set(prev).add(fieldName));
    
        // 3. Validate the field
        //const error = validateField(field, value);
        
        // 4. Update errors
        /*setFielderrors(prev => {
          const newErrors = { ...prev };
          if (error) {
            newErrors[fieldName] = error;
          } else {
            delete newErrors[fieldName];
          }
          return newErrors;
        });*/
    };

    const renderField = (field: FormField) => {
        //const currentValue = formdata[field.forms_text] || '';
        //const hasError = !!fielderrors[field.forms_text];
    
        switch (field.forms_type) {
          case 'textarea':
            return (
              <IonItem className="ion-margin-bottom">
                <IonTextarea
                  label={field.forms_text}
                  labelPlacement="floating"
                  placeholder={`Enter ${field.forms_text}`}
                  onIonChange={(e) => onInputChange(field, field.forms_text, e.detail.value)}
                  autoGrow={true}
                  className="w-full"
                />
              </IonItem>
            );
    
          case 'select':
            return (
              <IonItem className="ion-margin-bottom rounded-2xl ion-bg-transparent border border-gray-300">
                <IonSelect
                  label={field.forms_text}
                  labelPlacement="floating"
                  placeholder={`Select ${field.forms_text}`}
                  onIonChange={(e) => onInputChange(field, field.forms_text, e.detail.value)}
                  className="w-full uppercase text-gray-500 font-extralight text-xs ml-2"
                  interface="popover"
                >
                  {field.forms_type_options?.split(',').map((opt, index) => (
                    <IonSelectOption key={index} value={opt.trim()}>
                      {opt.trim()}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            );
    
          case 'checkbox':
            return (
              <IonItem className="ion-margin-bottom">
                <IonCheckbox
                  onIonChange={(e) => onInputChange(field, field.forms_text, e.detail.checked)}
                  className="mr-3"
                />
                <IonLabel>
                  {field.forms_text}
                </IonLabel>
              </IonItem>
            );
    
          case 'timestamp':
            return (
                <IonItem className="ion-margin-bottomion-margin-bottom rounded-2xl ion-bg-transparent border border-gray-300">
                    {/* Display field as a button that opens the modal */}
                    <IonButton 
                        fill="clear" 
                        expand="full" 
                        className="ion-text-left text-gray-500"
                        onClick={() => selectDatepicker(field.forms_text)}
                    >
                        {formdata && formdata[field.forms_text] ? 
                            format(new Date(formdata[field.forms_text] as string), 'PPP') : 
                            `Select ${field.forms_text}`
                        }
                    </IonButton>
                    {/* Modal with date picker */}
                    <IonModal 
                        isOpen={showDatePicker} 
                        onDidDismiss={() => setShowDatePicker(false)}
                    >
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>{selectedField}</IonTitle>
                                <IonButtons slot="end">
                                <IonButton onClick={() => setShowDatePicker(false)}>Close</IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding">
                        <IonDatetime
                            value={''}
                            onIonChange={(e) => {
                                onInputChange(field, selectedField, e.detail.value);
                                setShowDatePicker(false); // Close modal after selection
                            }}
                            presentation="date"
                            max={String(new Date().getFullYear() + 30)}
                            min={String(1900)}
                            className="w-full"
                        />
                        </IonContent>
                    </IonModal>
                </IonItem>
            );
    
          default:
            return (
              <IonItem className="ion-margin-bottom rounded-2xl ion-bg-transparent border border-gray-300">
                <IonInput
                  label={field.forms_text}
                  labelPlacement="floating"
                  placeholder={ `Enter ${field.forms_text}`}
                  type={field.forms_type_options === 'number' || field.forms_type_options === 'decimal' ? 'number' : 'text'}
                  onIonChange={(e) => onInputChange(field, field.forms_text, e.detail.value)}
                  className="w-full uppercase text-gray-500 font-extralight text-xs ml-2"
                  inputMode={field.forms_type_options === 'number' || field.forms_type_options === 'decimal' ? 'numeric' : 'text'}
                />
              </IonItem>
            );
        }
    };

    if (loading || !formfields) {
        return (
          <IonContent className="ion-padding">
            <div className="flex justify-center items-center h-64">
              <IonSpinner name="crescent" />
            </div>
          </IonContent>
        );
    }

    return (
        <div className="p-4 md:p-6 min-h-full mb-8">
            <div className="grid mb-0">
                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-[#4b2571] flex items-center gap-2">
                            <span className="bg-indigo-100 text-[#4b2571] p-2 rounded-xl inline-flex">
                                <IonIcon icon={cartOutline} className="text-xl"></IonIcon>
                            </span>
                            <span>Dispatch</span>
                        </h2>
                        <IonIcon 
                            icon={closeCircleOutline} 
                            className="text-2xl text-red-600" 
                            onClick={() => navigate('/log')}
                        />
                    </div>
                    <WelcomeText />
                </div>
                <form onSubmit={handleSubmit} className="w-full mt-8">
                {formfields.map((field) => {
                    //if (!shouldRenderField(field, formdata)) return null;
                    return (
                    <div key={field.forms_text_id} className={`ion-margin-bottom`}>
                        {renderField(field)}
                    </div>
                    );
                })}
                    
                    {/* Login Button */}
                    <IonButton
                        type="submit"
                        expand="block"
                        style={{
                        '--background': 'linear-gradient(135deg, #ffc107 0%, #b6940e 100%)',
                        '--color': '#ffffff',
                        '--border-radius': '0.85rem',
                        '--padding-top': '1rem',
                        '--padding-bottom': '1rem',
                        } as React.CSSProperties}
                        className='!mt-6'
                        disabled={submitting || loading}
                    >
                        {submitting ? (
                        <IonSpinner name="crescent" className="text-white" />
                        ) : (
                        'Save'
                        )}
                    </IonButton>
                </form>
                {/* Preview Modal */}
                <IonModal isOpen={showPreview} onDidDismiss={() => setShowPreview(false)}>
                <IonHeader>
                    <IonToolbar>
                    <IonTitle>Form Preview</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowPreview(false)}>Close</IonButton>
                    </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonCard>
                    <IonCardContent>
                        <div className="space-y-2">
                        {Object.entries(formdata || {}).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                            <span className="font-medium">{key}:</span>
                            <span className="text-gray-600">
                                {value !== null && value !== undefined ? value.toString() : '-'}
                            </span>
                            </div>
                        ))}
                        </div>
                    </IonCardContent>
                    </IonCard>
                </IonContent>
                </IonModal>

                {/* Alert Dialog for Preview */}
                <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="Preview"
                message="This is a preview of your form data"
                buttons={[
                    {
                    text: 'Cancel',
                    role: 'cancel',
                    },
                    {
                    text: 'View',
                    handler: () => {
                        setShowAlert(false);
                        setShowPreview(true);
                    },
                    },
                ]}
                />
            </div>
        </div>
    )
}

export default DispatchContent