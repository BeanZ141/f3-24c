if (typeof window.SUPABASE_URL === 'undefined') {
    window.SUPABASE_URL = 'https://bbmtcjjhcnjpfglltqyl.supabase.co';
}
if (typeof window.SUPABASE_ANON_KEY === 'undefined') {
    window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibXRjampoY25qcGZnbGx0cXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDE1ODQsImV4cCI6MjA5MDc3NzU4NH0.XCSUS89zOQuEI3-fvo9BGja3-AYMHU1VaXV6xrMqvaU';
}

// Initialize Supabase client
function initializeSupabaseClient() {
    // If AuthService already has a client, use it
    if (window.AuthService && window.AuthService.supabase) {
        window.supabaseClient = window.AuthService.supabase;
        return;
    }

    if (window.supabase && !window.supabaseClient) {
        try {
            window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
            console.log('Supabase client initialized successfully');
        } catch (error) {
            console.error('Failed to create Supabase client:', error);
        }
    }
}

// Initial load check
if (document.readyState === 'loading') {
    window.addEventListener('load', initializeSupabaseClient);
} else {
    initializeSupabaseClient();
}


const DatabaseService = {
    // Wait for Supabase to be ready
    async waitForSupabase() {
        if (window.supabaseClient) return;
        
        let attempts = 0;
        while (!window.supabaseClient && attempts < 100) {
            if (window.supabase && !window.supabaseClient) {
                initializeSupabaseClient();
            }
            if (window.supabaseClient) break;
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
        if (!window.supabaseClient) {
            console.error('Supabase failed to initialize. Retrying once...');
            initializeSupabaseClient();
        }
    },

    async getFlights(filters = {}) {
        try {
            console.log('getFlights called with filters:', filters);
            await this.waitForSupabase();
            
            if (!window.supabaseClient) throw new Error("Supabase client not ready");

            let query = window.supabaseClient
                .from('flights')
                .select('*');

            if (filters.from) {
                query = query.ilike('boarding_airport', `%${filters.from}%`);
            }
            if (filters.to) {
                query = query.ilike('landing_airport', `%${filters.to}%`);
            }
            if (filters.airline && filters.airline.length > 0) {
                query = query.in('company', filters.airline);
            }
            if (filters.stops && filters.stops.length > 0) {
                query = query.in('stop', filters.stops);
            }
            
            // Note: Price filtering is disabled temporarily because the 'cost' column 
            // contains strings like "₹14995", which breaks numeric comparison (gte/lte).
            /*
            if (filters.minPrice) {
                query = query.gte('cost', filters.minPrice);
            }
            if (filters.maxPrice) {
                query = query.lte('cost', filters.maxPrice);
            }
            */

            console.log('Executing filtered flights query...');
            const { data, error } = await query;
            
            if (error) {
                console.error('Error fetching flights:', error);
                throw error;
            }
            
            console.log(`Returning ${data ? data.length : 0} flights`);
            return data || [];
        } catch (error) {
            console.error('Database error in getFlights:', error);
            return [];
        }
    },

    async getFlightById(id) {
        try {
            await this.waitForSupabase();
            const { data, error } = await window.supabaseClient
                .from('flights')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching flight:', error);
            return null;
        }
    },

    // Hotel related queries
    async getHotels(filters = {}) {
        try {
            console.log('getHotels called with filters:', filters);
            await this.waitForSupabase();
            if (!window.supabaseClient) throw new Error("Supabase client not ready");

            let query = window.supabaseClient
                .from('hotels')
                .select('*');

            if (filters.location) {
                query = query.ilike('location', `%${filters.location}%`);
            }
            if (filters.rating) {
                query = query.gte('rating', parseFloat(filters.rating));
            }
            
            if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== '') {
                query = query.gte('price', parseFloat(filters.minPrice));
            }
            if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== '') {
                query = query.lte('price', parseFloat(filters.maxPrice));
            }

            const { data, error } = await query;
            
            if (error) {
                console.error('Error fetching hotels:', error);
                throw error;
            }
            
            console.log(`Returning ${data ? data.length : 0} hotels`);
            return data || [];
        } catch (error) {
            console.error('Database error in getHotels:', error);
            return [];
        }
    },

    async getHotelById(id) {
        try {
            await this.waitForSupabase();
            const { data, error } = await window.supabaseClient
                .from('hotels')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching hotel:', error);
            return null;
        }
    },

    // Train related queries
    async getTrains(filters = {}) {
        try {
            console.log('getTrains called with filters:', filters);
            await this.waitForSupabase();
            
            if (!window.supabaseClient) throw new Error("Supabase client not ready");

            let query = window.supabaseClient
                .from('trains')
                .select('*');

            // Apply filters
            if (filters.from) {
                query = query.ilike('boarding_station', `%${filters.from}%`);
            }
            if (filters.to) {
                query = query.ilike('arrival_station', `%${filters.to}%`);
            }
            if (filters.company && filters.company.length > 0) {
                query = query.in('company', filters.company);
            }
            if (filters.stops && filters.stops.length > 0) {
                query = query.in('stops', filters.stops);
            }
            // Add other filters as needed

            console.log('Executing filtered trains query...');
            const { data, error } = await query;
            
            if (error) {
                console.error('Error fetching trains:', error);
                throw error;
            }
            
            console.log(`Returning ${data ? data.length : 0} trains`);
            return data || [];
        } catch (error) {
            console.error('Database error in getTrains:', error);
            return [];
        }
    },

    async getTrainById(id) {
        try {
            await this.waitForSupabase();
            const { data, error } = await window.supabaseClient
                .from('trains')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching train:', error);
            return null;
        }
    },

    // Event related queries
    async getEvents(filters = {}) {
        try {
            await this.waitForSupabase();
            let query = window.supabaseClient
                .from('events')
                .select('*');

            if (filters.location) { query = query.eq('location', filters.location); }
            if (filters.category && filters.category.length > 0) { query = query.in('category', filters.category); }
            if (filters.date) { query = query.eq('date', filters.date); }
            if (filters.minPrice) { query = query.gte('price', filters.minPrice); }
            if (filters.maxPrice) { query = query.lte('price', filters.maxPrice); }

            const { data, error } = await query;
            
            if (error) {
                console.error('Error fetching events:', error);
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('Database error:', error);
            return [];
        }
    },

    async getEventById(id) {
        try {
            await this.waitForSupabase();
            const { data, error } = await window.supabaseClient
                .from('events')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching event:', error);
            return null;
        }
    },

    // Utility functions
    parsePrice(priceString) {
        // Remove currency symbols and convert to number
        if (!priceString) return 0;
        return parseInt(priceString.toString().replace(/[^0-9]/g, '')) || 0;
    },

    getDurationInMinutes(duration) {
        if (!duration) return 0;
        const [hours, minutes] = duration.split('h').map(part => 
            parseInt(part.replace('m', '').trim()) || 0
        );
        return (hours * 60) + minutes;
    },

    getTimeInMinutes(time) {
        if (!time) return 0;
        const [hours, minutes] = time.split(':').map(part => parseInt(part) || 0);
        return (hours * 60) + minutes;
    },

    // Search functionality
    async searchFlights(searchTerm) {
        try {
            await this.waitForSupabase();
            const { data, error } = await window.supabaseClient
                .from('flights')
                .select('*')
                .or(`company.ilike.%${searchTerm}%,flight_number.ilike.%${searchTerm}%,boarding_airport.ilike.%${searchTerm}%,landing_airport.ilike.%${searchTerm}%`);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching flights:', error);
            return [];
        }
    },

    async searchHotels(searchTerm) {
        try {
            await this.waitForSupabase();
            const { data, error } = await window.supabaseClient
                .from('hotels')
                .select('*')
                .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching hotels:', error);
            return [];
        }
    },

    async searchTrains(searchTerm) {
        try {
            await this.waitForSupabase();
            const { data, error } = await window.supabaseClient
                .from('trains')
                .select('*')
                .or(`train_name.ilike.%${searchTerm}%,train_number.ilike.%${searchTerm}%,boarding_station.ilike.%${searchTerm}%,arrival_station.ilike.%${searchTerm}%`);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching trains:', error);
            return [];
        }
    },

    async searchEvents(searchTerm) {
        try {
            await this.waitForSupabase();
            const { data, error } = await window.supabaseClient
                .from('events')
                .select('*')
                .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching events:', error);
            return [];
        }
    }
};

// Make it globally available
window.DatabaseService = DatabaseService;

// Test function to check database connection and tables
window.testDatabase = async function() {
    try {
        console.log('Testing database connection...');
        await DatabaseService.waitForSupabase();
        
        // Test if flights table exists and get ALL data
        const { data: allFlights, error: allFlightsError } = await window.supabaseClient
            .from('flights')
            .select('*');
        
        console.log('ALL flights in database:', { allFlights, allFlightsError });
        console.log('Total flights found:', allFlights ? allFlights.length : 0);
        
        // Check column names
        if (allFlights && allFlights.length > 0) {
            console.log('First flight columns:', Object.keys(allFlights[0]));
            console.log('Sample flight data:', allFlights[0]);
        }
        
        // Test specific filter
        const { data: mumbaiGoa, error: mumbaiGoaError } = await window.supabaseClient
            .from('flights')
            .select('*')
            .eq('boarding_airport', 'BOM')
            .eq('landing_airport', 'GOI');
        
        console.log('Mumbai to Goa flights:', { mumbaiGoa, mumbaiGoaError });
        
    } catch (error) {
        console.error('Database test failed:', error);
    }
};
