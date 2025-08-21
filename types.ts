
export interface Lead {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  dob?: string;
  ssn?: string;
  address?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  salesperson: string;
  dateEntered: string;
  stage: 'Initial Inquiry' | 'Follow-up' | 'Negotiation';
}

export interface Client {
  id: string;
  name:string;
  email: string;
  mobile: string;
  dob: string;
  ssn: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending';
  agent: string;
  createdDate: string;
  lastUpdate: string;
  profileCompletion: number;
}

export interface Dispute {
  id: string;
  creditor: string;
  type: 'Inaccuracy' | 'Fraud' | 'Duplicate';
  reason: string;
  status: 'Draft' | 'Submitted' | 'Investigating' | 'Positive' | 'Negative';
  dateAdded: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'Active' | 'Inactive';
  role: 'Admin' | 'Manager' | 'Agent';
  imageUrl: string;
  commission: number;
}

export interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'ID' | 'Proof of Address' | 'Utility Bill' | 'Other';
  dateUploaded: string;
  size: string;
}

export interface Task {
  id: string;
  description: string;
  dueDate: string;
  assignee: string;
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface CompanyProfile {
  logoUrl: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  ein: string;
}

export interface OwnerProfile {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  address: string;
  ssn: string;
}

export interface Compliance {
  croa: boolean;
  eSignature: boolean;
  stateLicensing: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'participant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  channel: 'email' | 'sms';
  messages: Message[];
  unreadCount?: number;
}

export interface LetterTemplate {
  id: string;
  title: string;
  category: 'Dispute' | 'HIPAA' | 'Debt Validation' | 'Goodwill' | 'Follow-up' | 'Custom';
  description: string;
  content: string;
}

// --- SUPERADMIN TYPES ---
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // per month
  features: string[];
  clientLimit: number;
  userLimit: number;
}

export interface Business {
  id: string;
  name: string;
  ownerEmail: string;
  planId: string;
  status: 'Active' | 'Inactive' | 'Trial';
  createdDate: string;
  userCount: number;
}
