import axios, { AxiosInstance, AxiosError } from 'axios';

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
    token: string;
    user?: User;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    booksRead: number;
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
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        // Request interceptor to add token to all requests
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response.data,
            (error: AxiosError<any>) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid, clear it
                    this.removeToken();
                }
                const message = error.response?.data?.error || error.message;
                throw new Error(message);
            }
        );
    }

    // Auth methods
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await this.api.post('/auth/register', data) as AuthResponse;
        return response;
    }

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await this.api.post('/auth/login', data) as AuthResponse;
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    loginWithGoogle(): void {
        window.location.href = `${API_BASE_URL}/auth/google`;
    }

    // Handle Google OAuth callback token from URL
    handleGoogleCallback(): boolean {
        if (typeof window === 'undefined') return false;

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            this.setToken(token);
            // Clean up URL by removing token parameter
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        }
        return false;
    }

    logout(): void {
        this.removeToken();
    }

    // Token management (with SSR safety)
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Book methods
    async getBooks(): Promise<Book[]> {
        const response = await this.api.get('/books');
        return this.extractBooks(response);
    }

    async getFeaturedBooks(): Promise<Book[]> {
        const response = await this.api.get('/books', {
            params: { isFeatured: true }
        });
        return this.extractBooks(response);
    }

    async getBooksByCategory(category: string): Promise<Book[]> {
        const response = await this.api.get('/books', {
            params: { category }
        });
        return this.extractBooks(response);
    }

    async getBookById(id: string): Promise<Book | null> {
        try {
            const response = await this.api.get(`/book/${id}`) as any;

            // Handle different response formats
            if (response?.success && response?.data) {
                return response.data as Book;
            }
            if (response?.id) {
                return response as Book;
            }
            if (response?.book?.id) {
                return response.book as Book;
            }

            return null;
        } catch (error) {
            console.error('Error fetching book:', error);
            return null;
        }
    }

    // Helper to extract books array from various response formats
    private extractBooks(response: any): Book[] {
        if (Array.isArray(response)) {
            return response;
        }
        if (response?.data && Array.isArray(response.data)) {
            return response.data;
        }
        if (response?.books && Array.isArray(response.books)) {
            return response.books;
        }
        return [];
    }
}

export const apiService = new ApiService();