
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7777';

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        booksRead: number;
    };
}

export interface ApiError {
    error: string;
}

class ApiService {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
            mode: 'cors',
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async login(data: LoginData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Google OAuth login: redirect user to backend Google auth route
    async loginWithGoogle(): Promise<void> {
        // Simply redirect to backend /auth/google route
        window.location.href = `${this.baseURL}/auth/google`;
    }

    // Helper methods for token management
    setToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    removeToken(): void {
        localStorage.removeItem('authToken');
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }
}

export const apiService = new ApiService();