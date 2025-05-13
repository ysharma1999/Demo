import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';


interface Article {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    reactions: number;
    views?: number;
}


interface NewsResponse {
    posts: Article[];
    total: number;
    skip: number;
    limit: number;
}


interface NewsState {
    articles: Article[];
    searchResults: Article[];
    singleArticle: Article | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NewsState = {
    articles: [],
    searchResults: [],
    singleArticle: null,
    status: 'idle',
    searchStatus: 'idle',
    error: null,
};


export const fetchNews = createAsyncThunk<Article[]>('news/fetchNews', async () => {
    const response = await fetch('https://dummyjson.com/posts');
    const data: NewsResponse = await response.json();
    return data.posts.slice(0, 10);
});

export const fetchArticleById = createAsyncThunk<Article, number>(
    'news/fetchArticleById',
    async (id) => {
        const response = await fetch(`https://dummyjson.com/posts/${id}`);
        const data = await response.json();
        return data;
    }
);

export const searchNews = createAsyncThunk<Article[], string>(
    'news/searchNews',
    async (query) => {
    const response = await fetch(`https://dummyjson.com/posts/search?q=${query}`);
    const data: NewsResponse = await response.json();
    return data.posts;
}
);

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchNews.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchNews.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.status = 'succeeded';
                state.articles = action.payload;
                state.error = null;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch articles';
            })
            .addCase(fetchArticleById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
                state.status = 'succeeded';
                state.singleArticle = action.payload;
            })
            .addCase(fetchArticleById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch article';
            })
            .addCase(searchNews.pending, (state) => {
                state.searchStatus = 'loading';
                state.error = null;
            })
            .addCase(searchNews.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.searchStatus = 'succeeded';
                state.searchResults = action.payload;
            })
            .addCase(searchNews.rejected, (state, action) => {
                state.searchStatus = 'failed';
                state.error = action.error.message || 'Search failed';
            });
    },
});

export default newsSlice.reducer;
