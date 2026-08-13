import { ClientIdProps, FormDataProps, Formfields, RegisterCredentials, User } from "../types/auth.types";
import { FormData, FormField, ReportData, RequestObject, TrackingData } from "../types/logreports.types";

const baseUrl = 'https://admintools.apin.org.ng/dctms/backend/public';
  
/*interface ApiResponse {
    data: ReportData[];
}*/

type ApiResponse = 'success' | 'Report Not Created' | 'Report Exists' | string;

export const get_log_reports = async (
    token: string | null, 
    facility: string | null
  ): Promise<ReportData[] | undefined> => {
    try {
      if (token) {
        const response = await fetch(
          `${baseUrl}/api/download_reports_for_logs.php?user=${token}&userFacility=${facility}`,
          {
            headers: { 
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
            // If API returns array directly
            const responseData: ReportData[] = await response.json();
            //console.log(responseData);
            return responseData; // Return array directly
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error loading report!');
        }
      }
      
      // Return undefined or throw error if no token
      return undefined;
      
    } catch (error) {
      console.error('Report loading failed:', error);
      // Optionally re-throw or return undefined
      throw error; // or return undefined;
    }
};

export const get_tracking_reports = async (
    token: string | null, 
    facility: string | null
  ): Promise<TrackingData[] | undefined> => {
    try {
      if (token) {
        const response = await fetch(
          `${baseUrl}/api/download_reports_for_tracking.php?user=${token}&userFacility=${facility}`,
          {
            headers: { 
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
            // If API returns array directly
            const responseData: ReportData[] = await response.json();
            //console.log(responseData);
            return responseData; // Return array directly
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error loading report!');
        }
      }
      
      // Return undefined or throw error if no token
      return undefined;
      
    } catch (error) {
      console.error('Report loading failed:', error);
      // Optionally re-throw or return undefined
      throw error; // or return undefined;
    }
};

export const get_cidlink_users = async (
  token: string | null
): Promise<User[] | undefined> => {
  try {
    if (token) {
      const response = await fetch(
        `${baseUrl}/api/cidlink-users`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
          // If API returns array directly
          const responseData: User[] = await response.json();
          //console.log(responseData);
          return responseData; // Return array directly
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error loading report!');
      }
    }
    
    // Return undefined or throw error if no token
    return undefined;
    
  } catch (error) {
    console.error('Report loading failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};

export const register_users = async (
  data: RegisterCredentials | null
): Promise<User[] | undefined> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/register`,
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }
    );
    
    if (response.ok) {
        // If API returns array directly
        const responseData: User[] = await response.json();
        //console.log(responseData);
        return responseData; // Return array directly
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error loading report!');
    }
    // Return undefined or throw error if no token
    //return undefined; 
  } catch (error) {
    console.error('Report loading failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};

export const activate_user = async (
  token: string | null,
  id: number | null
): Promise<User[] | undefined> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/cidlink-user-activation`,
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({id})
      }
    );
    
    if (response.ok) {
        // If API returns array directly
        const responseData: User[] = await response.json();
        //console.log(responseData);
        return responseData; // Return array directly
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error loading report!');
    }
    // Return undefined or throw error if no token
    //return undefined; 
  } catch (error) {
    console.error('Report loading failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};

export const get_formfields = async (
  token: string | null,
  form_id: string | null
): Promise<Formfields[] | undefined> => {
  try {
    const response = await fetch(
      `${baseUrl}/api/cidlink-formfields`,
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({form_id})
      }
    );
    
    if (response.ok) {
        // If API returns array directly
        const responseData: Formfields[] = await response.json();
        //console.log(responseData);
        return responseData; // Return array directly
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error loading form!');
    }
    // Return undefined or throw error if no token
    //return undefined; 
  } catch (error) {
    console.error('Form loading failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};

export const fetch_form_fields = async (
  forms_title: string | null
): Promise<FormField[] | undefined> => {
  try {
    if (forms_title) {
      const response = await fetch(
        `${baseUrl}/api/cidlink-formfields`,
        {
          headers: { 
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
          // If API returns array directly
          const responseData: FormField[] = await response.json();
          //console.log(responseData);
          return responseData; // Return array directly
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error loading report!');
      }
    }
    
    // Return undefined or throw error if no token
    return undefined;
    
  } catch (error) {
    console.error('Report loading failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};


export const link_client_ids = async (
  token: string | null,
  facility: string | null,
  formData: FormDataProps
): Promise<ClientIdProps | undefined> => {
  try {
    if (token) {
      const response = await fetch(
        `${baseUrl}/api/link-clientid`,
        {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({facility, formData})
        }
      );
      
      if (response.ok) {
          // If API returns array directly
          const responseData: ClientIdProps = await response.json();
          //console.log(responseData);
          return responseData; // Return array directly
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error loading report!');
      }
    }
    
    // Return undefined or throw error if no token
    return undefined;
    
  } catch (error) {
    console.error('Report loading failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};

export const update_client_ids = async (
  token: string | null,
  id: number | null,
  facility: string | null,
  formData: FormDataProps
): Promise<ClientIdProps | undefined> => {
  try {
    if (token) {
      const response = await fetch(
        `${baseUrl}/api/update-clientid`,
        {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({id, facility, formData})
        }
      );
      
      if (response.ok) {
          // If API returns array directly
          const responseData: ClientIdProps = await response.json();
          //console.log(responseData);
          return responseData; // Return array directly
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error loading report!');
      }
    }
    
    // Return undefined or throw error if no token
    return undefined;
    
  } catch (error) {
    console.error('Report loading failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};

export const get_client_ids = async (
  token: string | null): Promise<ClientIdProps[] | undefined> => {
  try {
    if (token) {
      const response = await fetch(
        `${baseUrl}/api/clientids`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
          // If API returns array directly
          const responseData: ClientIdProps[] = await response.json();
          //console.log(responseData);
          return responseData; // Return array directly
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error loading report!');
      }
    }
    
    // Return undefined or throw error if no token
    return undefined;
    
  } catch (error) {
    console.error('Report loading failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};

export const submit_form = async (
  requestdata: RequestObject | null
): Promise<ApiResponse> => {
  console.log(requestdata);
  try {
      const response = await fetch(
        `${baseUrl}/api/submit_reports.php`,
        {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'responseType': 'text'
          },
          body: JSON.stringify(requestdata)
        }
      );
      
      if (response.ok) {
          // If API returns array directly
          const responseData: ApiResponse = await response.json();
          //console.log(responseData);
          return responseData; // Return array directly
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error submitting report!');
      }
    
    // Return undefined or throw error if no token
    //return undefined;
    
  } catch (error) {
    console.error('Form submitting failed:', error);
    // Optionally re-throw or return undefined
    throw error; // or return undefined;
  }
};