/**
 * Supabase Configuration & Universal Database Service
 */

const SUPABASE_CONFIG = {
    url: 'https://egrepsiyopylqjoxocly.supabase.co',
    anonKey: 'sb_publishable_KHQe-ID4GcXJWLBOKquzOg_0nvMuoj8'
};

let supabaseClient = null;
if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && SUPABASE_CONFIG.anonKey !== 'AQUI_VA_TU_ANON_KEY') {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
}

const DB_SERVICE = {
    // --- Helpers Internos ---
    async _useMock(method, ...args) {
        if (typeof DB_MOCK !== 'undefined' && DB_MOCK[method]) {
            return await DB_MOCK[method](...args);
        }
        console.error(`Mock method ${method} not found`);
        return null;
    },

    // --- Banner ---
    async getBanner() {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from('banner').select('*').single();
            if (!error && data) return data;
        }
        return await this._useMock('getBanner');
    },
    async updateBanner(data) {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('banner').upsert(data);
            if (!error) return true;
        }
        return await this._useMock('updateBanner', data);
    },

    // --- Projects ---
    async getProjects() {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from('projects').select('*');
            if (!error && data) return data;
        }
        return await this._useMock('getProjects');
    },
    async addProject(project) {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('projects').insert(project);
            if (!error) return true;
        }
        return await this._useMock('addProject', project);
    },

    // --- Courses ---
    async getCourses() {
        if (supabaseClient) {
            const { data, error } = await supabaseClient.from('courses').select('*');
            if (!error && data) return data;
        }
        return await this._useMock('getCourses');
    },
    async addCourse(course) {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('courses').insert(course);
            if (!error) return true;
        }
        return await this._useMock('addCourse', course);
    },
    async updateCoursePlaylist(courseId, playlist) {
        if (supabaseClient) {
            const { error } = await supabaseClient.from('courses').update({ playlist }).eq('id', courseId);
            if (!error) return true;
        }
        return await this._useMock('updateCoursePlaylist', courseId, playlist);
    },

    // --- Users & Auth ---
    async getUsers() {
        // Siempre usar mock para usuarios
        return await this._useMock('getUsers');
    },
    async authenticate(username, password) {
        // Siempre usar mock para autenticación
        const users = await this.getUsers();
        return users.find(u => u.username === username && u.password === password);
    }
};

if (typeof DB_MOCK !== 'undefined' && DB_MOCK.init) {
    DB_MOCK.init();
}