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

export interface userProfileResponse {
    scuccess: boolean;
    user: User;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    booksRead: number;
    readBooks: Book[];
    continueReading?: ContinueReadingBook[];
    readingStreak?: number;
}

export interface Book {
    id: string;
    title: string;
    slug: string;
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

export interface ReadingProgress {
    id: string;
    userId: string;
    bookId: string;
    currentPage: number;
    totalPages: number;
    progressPercent: number;
    lastReadAt: string;
    isCompleted: boolean;
    completedAt?: string;
    book?: Book;
}

export interface ContinueReadingBook extends Book {
    currentPage: number;
    totalPages: number;
    progressPercent: number;
    lastReadAt: string;
}

export interface ReadingStreak {
    currentStreak: number;
    totalPagesRead: number;
    lastReadDate: string | null;
}

export interface HeatmapData {
    date: string;
    pagesRead: number;
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

        this.api.interceptors.response.use(
            (response) => response.data,
            (error: AxiosError<ApiError>) => {
                if (error.response?.status === 401 && error.config?.url !== '/auth/me') {
                    this.removeToken();
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

        return response;
    }

    loginWithGoogle(): void {
        if (typeof window !== 'undefined') {
            window.location.href = `${API_BASE_URL}/auth/google`;
        }
    }

    // Handle Google OAuth callback token from URL
    async handleGoogleCallback(): Promise<User | null> {
        if (typeof window === 'undefined') return null;
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            this.setToken(token);
            window.history.replaceState({}, document.title, window.location.pathname);
            const user = await this.getCurrentUser();
            return user;
        }
        return null;
    }

    async getCurrentUser(): Promise<User | null> {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await this.api.get('/auth/me') as userProfileResponse;
            if (response.user) {
                return response.user;
            }
            return null;
        } catch (error) {
            console.error('Error fetching current user:', error);
            this.removeToken();
            return null;
        }
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

    async getBookBySlug(slug: string): Promise<Book | null> {
        try {
            const response = await this.api.get(`/book/${slug}`) as BookByIdResponse;

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

    async getManifest(slug: string): Promise<{ pages: Array<{ page: number; image: string }> } | null> {
        try {
            const res = await this.api.get(`/book/${slug}/manifest`) as { manifestUrl?: string };
            if (!res?.manifestUrl) return null;

            const manifestResponse = await fetch(res.manifestUrl);
            return manifestResponse.json();
        } catch (error) {
            console.error("Error fetching manifest:", error);
            return null;
        }
    }

    async updateProgress(userId: string, slug: string, currentPage: number, totalPages: number) {
        try {
            return await this.api.put(`/book/progress`, {
                userId,
                slug,
                currentPage,
                totalPages
            });
        } catch (error) {
            console.error("Error updating progress:", error);
            return null;
        }
    }

    // Reading Progress Methods
    async getReadingProgress(): Promise<ReadingProgress[]> {
        try {
            const response = await this.api.get('/reading/progress') as { data?: ReadingProgress[] };
            return response.data || [];
        } catch (error) {
            console.error("Error fetching reading progress:", error);
            return [];
        }
    }

    async getBookProgress(bookId: string): Promise<ReadingProgress | null> {
        try {
            const response = await this.api.get(`/reading/progress/${bookId}`) as { data?: ReadingProgress };
            return response.data || null;
        } catch (error) {
            console.error("Error fetching book progress:", error);
            return null;
        }
    }

    async getContinueReading(limit: number = 5): Promise<ContinueReadingBook[]> {
        try {
            const response = await this.api.get('/reading/continue', {
                params: { limit }
            }) as { data?: ContinueReadingBook[] };

            return response.data || [];
        } catch (error) {
            console.error("Error fetching continue reading:", error);
            return [];
        }
    }


    async getCompletedBooks(): Promise<Book[]> {
        try {
            const response = await this.api.get('/reading/completed') as { data?: Book[] };
            return response.data || [];
        } catch (error) {
            console.error("Error fetching completed books:", error);
            return [];
        }
    }

    async getReadingStreak(): Promise<ReadingStreak> {
        try {
            const response = await this.api.get('/reading/streak') as { data?: ReadingStreak };
            return response.data || { currentStreak: 0, totalPagesRead: 0, lastReadDate: null };
        } catch (error) {
            console.error("Error fetching reading streak:", error);
            return { currentStreak: 0, totalPagesRead: 0, lastReadDate: null };
        }
    }

    async getReadingHeatmap(year: number = new Date().getFullYear()): Promise<HeatmapData[]> {
        try {
            const response = await this.api.get(`/reading/heatmap/${year}`) as { data?: HeatmapData[] };
            return response.data || [];
        } catch (error) {
            console.error("Error fetching reading heatmap:", error);
            return [];
        }
    }

    async trackBookOpen(userId: string, bookId: string) {
        try {
            return await this.api.post('/reading/track-open', {
                userId,
                bookId
            });
        } catch (error) {
            console.error("Error tracking book open:", error);
            return null;
        }
    }
}

export const apiService = new ApiService();