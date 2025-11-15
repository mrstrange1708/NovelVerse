import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    readBooks: Book[];
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
    readers: unknown[];
    createdAt: string;
    updatedAt: string;
}

interface ApiError {
    error?: string;
    message?: string;
}

type BooksResponse = Book[] | { data?: Book[] } | { books?: Book[] };

type BookByIdResponse = Book | { success?: boolean; data?: Book; book?: Book };

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });

        // Attach Authorization header when token exists
        this.api.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = this.getToken();
                if (token && config.headers) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Normalize API errors and auto-logout on 401
        this.api.interceptors.response.use(
            (response) => response.data,
            (error: AxiosError<ApiError>) => {
                if (error.response?.status === 401) {
                    this.removeToken();
                    this.removeUser();
                }
                const message = error.response?.data?.error || error.message;
                return Promise.reject(new Error(message));
            }
        );
    }

    // Auth methods
    async register(data: RegisterData): Promise<AuthResponse> {
        return this.api.post('/auth/register', data) as Promise<AuthResponse>;
    }

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await this.api.post('/auth/login', data) as AuthResponse;
        console.log(response);
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        if (response.user) {
            this.setUser(response.user);
        }
        
        return response;
    }

    loginWithGoogle(): void {
        if (typeof window !== 'undefined') {
            window.location.href = `${API_BASE_URL}/auth/google`;
        }
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
        this.removeUser();
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


    setUser(user: User): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    getUser(): User | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    return JSON.parse(userStr) as User;
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    this.removeUser();
                    return null;
                }
            }
        }
        return null;
    }

    removeUser(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Book methods
    async getBooks(): Promise<Book[]> {
        const response = await this.api.get('/books') as BooksResponse;
        return this.extractBooks(response);
    }

    async getFeaturedBooks(): Promise<Book[]> {
        const response = await this.api.get('/books', {
            params: { isFeatured: true },
        }) as BooksResponse;
        return this.extractBooks(response);
    }

    async getBooksByCategory(category: string): Promise<Book[]> {
        const response = await this.api.get('/books', {
            params: { category },
        }) as BooksResponse;
        return this.extractBooks(response);
    }

    async getBookById(id: string): Promise<Book | null> {
        try {
            const response = await this.api.get(`/book/${id}`) as BookByIdResponse;

            if (typeof response === 'object' && response !== null) {
                if ('success' in response && response.success && 'data' in response && response.data) {
                    return response.data;
                }
                if ('id' in response) {
                    return response as Book;
                }
                if ('book' in response && response.book) {
                    return response.book;
                }
            }
            return null;
        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Error fetching book:', error);
            }
            return null;
        }
    }

    // Helper to extract books array from various response formats
    private extractBooks(response: BooksResponse): Book[] {
        if (Array.isArray(response)) return response;
        if ('data' in response && Array.isArray(response.data)) return response.data;
        if ('books' in response && Array.isArray(response.books)) return response.books;
        return [];
    }
}

export const apiService = new ApiService();