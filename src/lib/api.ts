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

export interface Favorite {
    favoriteId: string;
    addedAt: string;
    id: string;
    title: string;
    slug: string;
    author: string;
    coverImage?: string;
    category: string;
    pageCount?: number;
    description?: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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
    async getBooks(params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        isFeatured?: boolean;
    }): Promise<{ books: Book[]; pagination?: Pagination }> {
        try {
            const queryParams: Record<string, string> = {};

            if (params?.page) queryParams.page = params.page.toString();
            if (params?.limit) queryParams.limit = params.limit.toString();
            if (params?.category && params.category !== 'All') queryParams.category = params.category;
            if (params?.search) queryParams.search = params.search;
            if (params?.sortBy) queryParams.sortBy = params.sortBy;
            if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
            if (params?.isFeatured !== undefined) queryParams.isFeatured = params.isFeatured.toString();

            const response = await this.api.get('/books', { params: queryParams }) as { success?: boolean; books?: Book[]; pagination?: Pagination };
            return {
                books: response.books || (Array.isArray(response) ? response : []),
                pagination: response.pagination
            };
        } catch (error) {
            console.error("Error fetching books:", error);
            return { books: [] };
        }
    }

    async getFeaturedBooks(): Promise<Book[]> {
        const response = await this.getBooks({ isFeatured: true, limit: 50 });
        return response.books;
    }

    async getBooksByCategory(category: string, params?: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{ books: Book[]; pagination?: Pagination }> {
        return this.getBooks({ ...params, category });
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

    // Favorites API
    async getFavorites(page = 1, limit = 20, category?: string): Promise<{ favorites: Favorite[]; pagination: Pagination }> {
        try {
            const params: Record<string, string> = {
                page: page.toString(),
                limit: limit.toString()
            };
            if (category) params.category = category;

            const response = await this.api.get('/favorites', { params }) as { success: boolean; favorites: Favorite[]; pagination: Pagination };
            return { favorites: response.favorites || [], pagination: response.pagination };
        } catch (error) {
            console.error("Error fetching favorites:", error);
            return { favorites: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } };
        }
    }

    async addToFavorites(bookId: string): Promise<{ success: boolean; message: string }> {
        try {
            return await this.api.post('/favorites', { bookId }) as { success: boolean; message: string };
        } catch (error) {
            console.error("Error adding to favorites:", error);
            throw error;
        }
    }

    async removeFromFavorites(bookId: string): Promise<{ success: boolean; message: string }> {
        try {
            return await this.api.delete(`/favorites/${bookId}`) as { success: boolean; message: string };
        } catch (error) {
            console.error("Error removing from favorites:", error);
            throw error;
        }
    }

    async toggleFavorite(bookId: string): Promise<{ success: boolean; isFavorite: boolean; message: string }> {
        try {
            return await this.api.post('/favorites/toggle', { bookId }) as { success: boolean; isFavorite: boolean; message: string };
        } catch (error) {
            console.error("Error toggling favorite:", error);
            throw error;
        }
    }

    async checkIsFavorite(bookId: string): Promise<boolean> {
        try {
            const response = await this.api.get(`/favorites/check/${bookId}`) as { success: boolean; isFavorite: boolean };
            return response.isFavorite || false;
        } catch (error) {
            console.error("Error checking favorite status:", error);
            return false;
        }
    }

    async getFavoritesCount(): Promise<number> {
        try {
            const response = await this.api.get('/favorites/count') as { success: boolean; count: number };
            return response.count || 0;
        } catch (error) {
            console.error("Error getting favorites count:", error);
            return 0;
        }
    }
}

export const apiService = new ApiService();