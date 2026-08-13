// types/report.types.ts - Single source of truth
export interface ReportData {
    state?: string;
    lga?: string;
    facility?: string;
    form_report_id?: string;  // Make it consistently string
    Section?: string;
    SectionCount?: string;
    TrackingNumber?: string;
    Typeofwaste?: string;
    DateofPickUp?: string;
    NameofRider?: string;
    PhonenumberofRider?: string;
    Destination?: string;
    Status?: string;
}

export interface TrackingData {
    state?: string;
    lga?: string;
    facility?: string;
    form_report_id?: string;
    Section?: string;
    SectionCount?: string;
    TrackingNumber?: string;
    PickUpPoint?: string;
    TotalVolumeWeight?: string;
    Typeofwaste?: string;
    DateofPickUp?: string;
    NameofRider?: string;
    PhonenumberofRider?: string;
    Destination?: string;
    NameofRecipient?: string;
    PhonenumberofRecipient?: string;
    IncinerationDate?: string;
}

export interface FormField {
    forms_title: string;
    forms_text: string;
    forms_text_id: string;
    forms_type: string;
    forms_type_options: string;
}

export interface RequestObject {
    state: string | null;
    lga: string | null;
    facility: string | null;
    email: string | null;
    data_value: string | null;
    forms_title: string | null;
    forms_text: string | null;
    forms_text_id: string | null;
    form_report_id: number | null;
    form_module_id: number | null;
}
  
export interface FormData {
    [key: string]: string | number | Date | null;
}

/*export interface ApiResponse {
    id: string;
    success: boolean;
    message: string;
}*/

/**export interface UseDynamicFormProps {
  formType?: string;
  initialData?: FormData;
  onSubmitSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseDynamicFormReturn {
  fields: FormField[];
  formData: FormData;
  errors: FormData;
  touched: FormData;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  handleInputChange: (fieldName: string, value: string | number | Date | null) => void;
  validateForm: () => boolean;
  validateField: (field: FormField, value: any) => string;
  handleSubmit: () => Promise<void>;
  handleReset: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  progress: number;
}*/