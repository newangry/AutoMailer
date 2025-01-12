export interface HomeInitialState {
    colorScheme: 'light' | 'dark';
    lightMode: 'light' | 'dark';
    user_data: boolean | UserState,
    min_sidebar: boolean,
    deleted_source_id: string,
    deleted_brand_id: string,
    page: string,
    is_progress: boolean
}

export const initialState: HomeInitialState = {
    colorScheme: 'light',
    lightMode: 'light',
    user_data: false,
    min_sidebar: false,
    deleted_source_id: '',
    deleted_brand_id:'',
    page: 'task_management',
    is_progress: false
};

interface UserState {
    id: string,
    email: string,
    full_name: string,
    avatar_url: string,
    fb_long_lived_access_token: string | null,
}