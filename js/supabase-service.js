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
            try {
                const { data, error } = await supabaseClient.from('banner').select('*').limit(1);
                if (!error && data && data.length > 0) return data[0];
                console.error('Error banner Supabase:', error);
            } catch (err) {
                console.error('Exception banner:', err);
            }
        }
        return await this._useMock('getBanner');
    },
    async updateBanner(data) {
        if (supabaseClient) {
            try {
                // Primero verificar si existe un banner
                const { data: existing } = await supabaseClient.from('banner').select('id').limit(1);
                if (existing && existing.length > 0) {
                    // Actualizar el existente
                    const { error } = await supabaseClient.from('banner').update(data).eq('id', existing[0].id);
                    if (!error) return true;
                } else {
                    // Insertar nuevo
                    const { error } = await supabaseClient.from('banner').insert(data);
                    if (!error) return true;
                }
            } catch (err) {
                console.error('Exception update banner:', err);
            }
        }
        return await this._useMock('updateBanner', data);
    },

    // --- Projects ---
    async getProjects() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('projects').select('*');
                if (!error && data) return data;
                console.error('Error projects Supabase:', error);
            } catch (err) {
                console.error('Exception projects:', err);
            }
        }
        return await this._useMock('getProjects');
    },
    async addProject(project) {
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from('projects').insert(project);
                if (!error) return true;
            } catch (err) {
                console.error('Exception add project:', err);
            }
        }
        return await this._useMock('addProject', project);
    },

    // --- Courses ---
    async getCourses() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('courses').select('*');
                if (!error && data) return data;
                console.error('Error courses Supabase:', error);
            } catch (err) {
                console.error('Exception courses:', err);
            }
        }
        return await this._useMock('getCourses');
    },
    async addCourse(course) {
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from('courses').insert(course);
                if (!error) return true;
            } catch (err) {
                console.error('Exception add course:', err);
            }
        }
        return await this._useMock('addCourse', course);
    },
    async updateCoursePlaylist(courseId, playlist) {
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.from('courses').update({ playlist }).eq('id', courseId);
                if (!error) return true;
            } catch (err) {
                console.error('Exception update playlist:', err);
            }
        }
        return await this._useMock('updateCoursePlaylist', courseId, playlist);
    },

    // --- Users & Auth ---
    async getUsers() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.from('users').select('*');
                if (!error && data) return data;
            } catch (err) {
                console.error('Exception users:', err);
            }
        }
        return await this._useMock('getUsers');
    },
    async authenticate(username, password) {
        // Primero intentar con mock local (más rápido para desarrollo)
        const users = await this.getUsers();
        const mockUser = users.find(u => u.username === username && u.password === password);
        if (mockUser) return mockUser;
        
        // Si no funciona con mock, intentar con Supabase Auth
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: username,
                    password: password,
                });
                if (!error) return data.user;
            } catch (err) {
                console.error('Exception auth:', err);
            }
        }
        return null;
    }
};

if (typeof DB_MOCK !== 'undefined' && DB_MOCK.init) {
    DB_MOCK.init();
}