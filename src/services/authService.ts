import { api, API_BASE_URL } from '@/config/api';
import { EmployerData } from '@/types/employer';

// Types for authentication
export interface LoginCredentials {
  userName: string;
  password: string;
  orgId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  [key: string]: any;
}

export interface EmployerLoginResponse {
  profile: UserProfile;
  tenant?: Tenant[];
  accessToken: string;
  refreshToken: string;
}

export interface EmployeeLoginResponse {
  profile: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface Tenant {
  id: string;
  name: string;
  [key: string]: any;
}

export interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: 'employer' | 'employee';
  selectedEmployer?: EmployerData;
  [key: string]: any;
}

export interface LoginResult {
  success: boolean;
  userData?: UserData;
  employers?: EmployerData[];
  requiresEmployerSelection?: boolean;
  redirectPath?: string;
}

// Storage utility functions
export const storageUtils = {
  setTokens: (tokens: AuthTokens): void => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  setUser: (userData: UserData): void => {
    localStorage.setItem('user', JSON.stringify(userData));
  },

  setEmployers: (employers: EmployerData[]): void => {
    localStorage.setItem('employers', JSON.stringify(employers));
  },

  getReturnPath: (): string | null => {
    const returnToJob = localStorage.getItem('returnToJob');
    const returnToCVBuilder = localStorage.getItem('returnToCVBuilder');

    if (returnToJob) {
      localStorage.removeItem('returnToJob');
      return `/find-job/${returnToJob}?apply=true`;
    }

    if (returnToCVBuilder) {
      localStorage.removeItem('returnToCVBuilder');
      return returnToCVBuilder;
    }

    return null;
  },

  clearAuthData: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('employers');
  },
};

class AuthService {
  /**
   * Validates login credentials
   */
  private validateCredentials(credentials: LoginCredentials): void {
    if (!credentials.userName?.trim()) {
      throw new Error('Email or phone number is required');
    }
    if (!credentials.password?.trim()) {
      throw new Error('Password is required');
    }
  }

  /**
   * Attempts employer login
   */
  private async attemptEmployerLogin(
    credentials: LoginCredentials,
  ): Promise<EmployerLoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/backOffice-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Employer login failed: ${response.status}`,
      );
    }

    return response.json();
  }

  /**
   * Attempts employee login
   */
  private async attemptEmployeeLogin(
    credentials: LoginCredentials,
  ): Promise<EmployeeLoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/portal-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Employee login failed: ${response.status}`,
      );
    }

    return response.json();
  }

  /**
   * Processes employer login response
   */
  private processEmployerLoginResponse(
    data: EmployerLoginResponse,
  ): LoginResult {
    const isArray = Array.isArray(data);

    if (isArray) {
      // Multiple employers - requires selection
      return {
        success: true,
        employers: data as unknown as EmployerData[],
        requiresEmployerSelection: true,
      };
    }

    // Single employer response
    const tokens: AuthTokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };

    storageUtils.setTokens(tokens);

    if (data.tenant && data.tenant.length > 0) {
      // Has tenant data - direct login
      const userData: UserData = {
        ...data.profile,
        role: 'employer',
        selectedEmployer: data.tenant[0] as unknown as EmployerData,
      };

      storageUtils.setUser(userData);

      return {
        success: true,
        userData,
        redirectPath: '/dashboard',
      };
    } else {
      // No tenant data - requires employer selection
      return {
        success: true,
        requiresEmployerSelection: true,
      };
    }
  }

  /**
   * Processes employee login response
   */
  private processEmployeeLoginResponse(
    data: EmployeeLoginResponse,
  ): LoginResult {
    const tokens: AuthTokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };

    storageUtils.setTokens(tokens);

    const userData: UserData = {
      ...data.profile,
      role: 'employee',
    };

    storageUtils.setUser(userData);

    const returnPath = storageUtils.getReturnPath();
    const redirectPath = returnPath || '/find-job';

    return {
      success: true,
      userData,
      redirectPath,
    };
  }

  /**
   * Main login method that tries both employer and employee login
   */
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    this.validateCredentials(credentials);

    try {
      // First try employer login
      try {
        const employerData = await this.attemptEmployerLogin(credentials);
        const result = this.processEmployerLoginResponse(employerData);

        if (result.employers) {
          storageUtils.setEmployers(result.employers);
        }

        return result;
      } catch (employerError) {
        // If employer login fails, try employee login
        const employeeData = await this.attemptEmployeeLogin(credentials);
        return this.processEmployeeLoginResponse(employeeData);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        'Invalid credentials. Please check your email and password.',
      );
    }
  }

  /**
   * Login with specific employer selection
   */
  async loginWithEmployer(
    credentials: LoginCredentials,
    employer: EmployerData,
  ): Promise<LoginResult> {
    this.validateCredentials(credentials);

    if (!employer?.tenant?.id) {
      throw new Error('Invalid employer selection');
    }

    try {
      const credentialsWithOrg = {
        ...credentials,
        orgId: employer.tenant.id,
      };

      const data = await this.attemptEmployerLogin(credentialsWithOrg);

      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      storageUtils.setTokens(tokens);

      const userData: UserData = {
        ...data.profile,
        role: 'employer',
        selectedEmployer: employer,
      };

      storageUtils.setUser(userData);

      return {
        success: true,
        userData,
        redirectPath: '/dashboard',
      };
    } catch (error) {
      console.error('Employer login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        'Failed to login with selected employer. Please try again.',
      );
    }
  }

  /**
   * Logout user and clear all auth data
   */
  logout(): void {
    storageUtils.clearAuthData();
  }
}

export const authService = new AuthService();
