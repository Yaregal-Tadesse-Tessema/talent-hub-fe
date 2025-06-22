export interface Address {
  city: string;
  region: string;
  street: string;
  country: string;
  postalCode: string;
}

export interface Logo {
  path: string;
  size: number;
  filename: string;
  mimetype: string;
  bucketName: string;
  [key: string]: any;
}

export interface Tenant {
  id: string;
  tenantId?: string | null;
  name: string;
  tradeName: string;
  email: string;
  phoneNumber: string;
  prefix: string;
  type: string;
  organizationType: string;
  industry: string;
  companySize: string;
  code: string;
  tin: string;
  registrationNumber?: string | null;
  licenseNumber?: string | null;
  isActive: boolean;
  isVerified: boolean;
  status: 'Active' | 'Inactive';
  subscriptionType: string;
  schemaName: string;
  selectedCalender: 'Gregorian' | string;
  address: Address;
  logo: Logo;
  cover: Logo;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export interface EmployerData {
  id: string;
  jobTitle: string;
  lookupId: string;
  startDate?: string | null;
  status: 'Active' | 'Inactive';
  tenantId?: string | null;
  tenant_Id: string;
  tenantName?: string;
  tenant: Tenant;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
}
