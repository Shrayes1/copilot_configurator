export interface User {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  role: 'admin' | 'user';
  avatar: string;
  lastActive?: string; // Optional
  modules?: string[]; // Optional
}

export interface Organization {
  id: string;
  name: string;
  type: 'service_provider' | 'customer';
  serviceProviderId: string;
  plan: 'basic' | 'professional' | 'growth';
  licenses: {
    total: number;
    used: number;
    modules: {
      [key: string]: {
        total: number;
        used: number;
      };
    };
  };
  adminContact: {
    name: string;
    email: string;
    phone: string;
  };
  settings: {
    autoRecordMeetings: boolean;
    emailTemplates: boolean;
    agendaTemplates: boolean;
  };
  logoUrl?: string;
  createdAt: string;
}



export interface OrganizationSettings {
  autoRecordMeetings: boolean;
  emailTemplates: boolean;
  agendaTemplates: boolean;
}

export interface License {
  id: string;
  organizationId: string;
  plan: 'basic' | 'professional' | 'growth';
  purchasedAt: string;
  expiresAt: string;
  active: boolean;
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}