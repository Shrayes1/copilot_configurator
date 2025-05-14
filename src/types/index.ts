export interface User {
  id: string; // Required for mockUsers and UserRow comparison
  name: string;
  email: string;
  role: string; // Can be "cognicor_admin", "org_admin", or others
  organizationId: string;
  avatar?: string;
  lastActive?: string;
  modules?: string[];
}

export interface Organization {
  id: string;
  name: string;
  type?: 'service_provider' | 'customer';
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