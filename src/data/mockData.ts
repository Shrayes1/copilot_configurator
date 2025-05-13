import { User, Organization } from '../types';

export const mockOrganizations: Organization[] = [
  {
    id: 'org1',
    name: 'Copilot Services',
    type: 'service_provider',
    serviceProviderId: 'org1', // Added to fix error
    plan: 'growth',
    logoUrl: 'https://images.pexels.com/photos/5702341/pexels-photo-5702341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    adminContact: {
      name: 'John Smith',
      email: 'john@copilotservices.com',
      phone: '+1 (555) 123-4567',
    },
    licenses: {
      total: 50,
      used: 5,
      modules: {
        'meeting-assistant': { total: 50, used: 5 },
        'email-assistant': { total: 50, used: 3 },
        'document-assistant': { total: 50, used: 2 },
      },
    },
    settings: {
      autoRecordMeetings: true,
      emailTemplates: true,
      agendaTemplates: true,
    },
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'org2',
    name: 'Acme Corp',
    type: 'customer',
    serviceProviderId: 'org1',
    plan: 'professional',
    logoUrl: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    adminContact: {
      name: 'Michael Johnson',
      email: 'michael@acme.com',
      phone: '+1 (555) 234-5678',
    },
    licenses: {
      total: 25,
      used: 18,
      modules: {
        'meeting-assistant': { total: 25, used: 18 },
        'email-assistant': { total: 15, used: 10 },
        'document-assistant': { total: 10, used: 5 },
      },
    },
    settings: {
      autoRecordMeetings: true,
      emailTemplates: true,
      agendaTemplates: false,
    },
    createdAt: '2023-02-15T00:00:00Z',
  },
  {
    id: 'org3',
    name: 'Initech',
    type: 'customer',
    serviceProviderId: 'org1',
    plan: 'basic',
    logoUrl: 'https://images.pexels.com/photos/5473302/pexels-photo-5473302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    adminContact: {
      name: 'Emily Davis',
      email: 'emily@initech.com',
      phone: '+1 (555) 345-6789',
    },
    licenses: {
      total: 10,
      used: 8,
      modules: {
        'meeting-assistant': { total: 10, used: 8 },
        'email-assistant': { total: 5, used: 4 },
        'document-assistant': { total: 0, used: 0 },
      },
    },
    settings: {
      autoRecordMeetings: false,
      emailTemplates: false,
      agendaTemplates: false,
    },
    createdAt: '2023-03-20T00:00:00Z',
  },
  {
    id: 'org4',
    name: 'Globex Corporation',
    type: 'customer',
    serviceProviderId: 'org1',
    plan: 'growth',
    logoUrl: 'https://images.pexels.com/photos/5816288/pexels-photo-5816288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    adminContact: {
      name: 'Robert Wilson',
      email: 'robert@globex.com',
      phone: '+1 (555) 456-7890',
    },
    licenses: {
      total: 100,
      used: 72,
      modules: {
        'meeting-assistant': { total: 100, used: 72 },
        'email-assistant': { total: 75, used: 50 },
        'document-assistant': { total: 40, used: 25 },
      },
    },
    settings: {
      autoRecordMeetings: true,
      emailTemplates: true,
      agendaTemplates: true,
    },
    createdAt: '2023-04-10T00:00:00Z',
  },
];

export const mockUsers: User[] = [
  // Service Provider Users
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john@copilotservices.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    organizationId: 'org1',
    lastActive: new Date().toISOString(),
    modules: ['meeting-assistant', 'email-assistant', 'document-assistant'],
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah@copilotservices.com',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    organizationId: 'org1',
    lastActive: new Date().toISOString(),
    modules: ['meeting-assistant', 'email-assistant'],
  },
  // Acme Corp Users
  {
    id: 'user3',
    name: 'Michael Johnson',
    email: 'michael@acme.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    organizationId: 'org2',
    lastActive: new Date().toISOString(),
    modules: ['meeting-assistant', 'email-assistant', 'document-assistant'],
  },
  {
    id: 'user4',
    name: 'Jessica Williams',
    email: 'jessica@acme.com',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    organizationId: 'org2',
    lastActive: new Date().toISOString(),
    modules: ['meeting-assistant'],
  },
  // Initech Users
  {
    id: 'user5',
    name: 'Emily Davis',
    email: 'emily@initech.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    organizationId: 'org3',
    lastActive: new Date().toISOString(),
    modules: ['meeting-assistant', 'email-assistant'],
  },
  {
    id: 'user6',
    name: 'David Miller',
    email: 'david@initech.com',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    organizationId: 'org3',
    lastActive: new Date().toISOString(),
    modules: ['meeting-assistant'],
  },
  // Globex Corporation Users
  {
    id: 'user7',
    name: 'Robert Wilson',
    email: 'robert@globex.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    organizationId: 'org4',
    lastActive: new Date().toISOString(),
    modules: ['meeting-assistant', 'email-assistant', 'document-assistant'],
  },
  {
    id: 'user8',
    name: 'Jennifer Brown',
    email: 'jennifer@globex.com',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    organizationId: 'org4',
    lastActive: new Date().toISOString(),
    modules: ['meeting-assistant', 'document-assistant'],
  },
];

export type { Organization };
