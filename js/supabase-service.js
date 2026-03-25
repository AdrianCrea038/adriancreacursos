/**
 * Supabase Configuration & Universal Database Service
 * Si configuras Supabase, se usará; de lo contrario, fallback a DB_MOCK.
 */

// Cargar la librería de Supabase (ya está en el HTML)
// const supabase = window.supabase;

const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_PROJECT_URL', // Ej: https://xyz.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

let supabaseClient = null;
if (SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_PROJECT_URL') {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
}

const DB_SERVICE = {
    // Helper para obtener datos de Supabase o mock
    async _fetchData(table, mockMethod, ...args) {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from(table).select('*');
            if (!error && data) return data;
        }
        return await DB_MOCK[mockMethod](...args);
    },

    async getBanner() {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from('banner').select('*').single();
            if (!error) return data;
        }
        return await DB_MOCK.getBanner();
    },

    async updateBanner(data) {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('banner').upsert(data);
            if (!error) return true;
        }
        return await DB_MOCK.updateBanner(data);
    },

    async getProjects() {
        return await this._fetchData('projects', 'getProjects');
    },

    async addProject(project) {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('projects').insert(project);
            if (!error) return true;
        }
        return await DB_MOCK.addProject(project);
    },

    async getCourses() {
        return await this._fetchData('courses', 'getCourses');
    },

    async addCourse(course) {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('courses').insert(course);
            if (!error) return true;
        }
        return await DB_MOCK.addCourse(course);
    },

    async getUsers() {
        return await this._fetchData('users', 'getUsers');
    },

    async authenticate(username, password) {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: username,
                password: password,
            });
            if (!error) return data.user;
        }
        const users = await DB_MOCK.getUsers();
        return users.find(u => u.username === username && u.password === password);
    }
};