// types/auth.ts

export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    groupname: string;
    role: UserRole;
    lga_id: number;
    facility_id: number;
    state_id: number;
    created_by: number | null;
    status: UserStatus;
    created_at: string;
    updated_at: string;
    state_name: string;
    lga_name: string;
    facility_name: string;
  }

  export interface Formfields {
        id: number;
        form_id: string;
        field_name: string;
        display_name: string;
        input_type: UserRole;
        options: string;
        required: string;
        status: string;
        created_by: string;
        created_at: string;
        updated_at: string;
  }

export interface SearchFilterProps {
    facility: string;
    setFacility: (value: string) => void;
}

export interface FormDataProps {
    [key: string]: string | null; // Index signature
}
  
  export type UserRole = 'admin' | 'user' | 'super_admin' | 'manager' | string;
  export type UserStatus = 0 | 1;
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface RegisterCredentials {
    name: string,
    email: string;
    password: string;
    confirm_password: string;
  }

  export interface ClientIdProps {
    id: number;
    uid: string;
    facility: string;
    formdata: string;
    status: number;
    created_by: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
  }
  
  export interface DecodedToken {
    iss: string;
    iat: number;
    exp: number;
    nbf: number;
    jti: string;
    sub: string;
    prv: string;
  }