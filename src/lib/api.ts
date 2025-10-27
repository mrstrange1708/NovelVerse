
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:7777';

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

export interface Book {
    id: string;
    title: string;
    author: string;
    description?: string;
    category: string;
    coverImage?: string;
    pdfUrl?: string;
    fileSize?: number;
    publishedAt?: string;
    isFeatured: boolean;
    pageCount?: number;
    language: string;
    readers: any[];
    createdAt: string;
    updatedAt: string;
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

    async getBooks(): Promise<Book[]> {
        const response = await this.request<any>('/books', {
            method: 'GET',
        });
        // Handle different response formats
        if (Array.isArray(response)) {
            return response;
        } else if (response.data && Array.isArray(response.data)) {
            return response.data;
        } else if (response.books && Array.isArray(response.books)) {
            return response.books;
        }
        return [];
    }

    async getFeaturedBooks(): Promise<Book[]> {
        const response = await this.request<any>('/books?isFeatured=true', {
            method: 'GET',
        });
        // Handle different response formats
        if (Array.isArray(response)) {
            return response;
        } else if (response.data && Array.isArray(response.data)) {
            return response.data;
        } else if (response.books && Array.isArray(response.books)) {
            return response.books;
        }
        return [];
    }

    async getBooksByCategory(category: string): Promise<Book[]> {
        const response = await this.request<any>(`/books?category=${encodeURIComponent(category)}`, {
            method: 'GET',
        });
        // Handle different response formats
        if (Array.isArray(response)) {
            return response;
        } else if (response.data && Array.isArray(response.data)) {
            return response.data;
        } else if (response.books && Array.isArray(response.books)) {
            return response.books;
        }
        return [];
    }

    async getBookById(id: string): Promise<Book | null> {
        try {
            const response = await this.request<any>(`/book/${id}`, {
                method: 'GET',
            });
            console.log("Raw API response:", response);

            // Handle nested response format { success: true, data: { ... } }
            if (response.success && response.data) {
                console.log("Extracted book data:", response.data);
                return response.data;
            } else if (response && typeof response === 'object' && response.id) {
                return response;
            } else if (response.data && typeof response.data === 'object' && response.data.id) {
                return response.data;
            } else if (response.book && typeof response.book === 'object' && response.book.id) {
                return response.book;
            }
            console.warn("No book data found in response:", response);
            return null;
        } catch (error) {
            console.error('Error fetching book:', error);
            return null;
        }
    }
}

export const apiService = new ApiService();