const SUPABASE_URL = 'https://vxqpierpnqsmyckkusfp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cXBpZXJwbnFzbXlja2t1c2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDA3NjEsImV4cCI6MjA3MDY3Njc2MX0.lBm2eXleMQZrPdjZiLk1gatF7m7blHrx-GMeLDo8TQg';

// Initialize Supabase client
let supabase;

// Wait for Supabase to be available
function initializeSupabase() {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully');
    } else {
        console.log('Supabase not available yet, retrying...');
        setTimeout(initializeSupabase, 100);
    }
}

initializeSupabase();

const DatabaseService = {
    // Wait for Supabase to be ready
    async waitForSupabase() {
        while (!supabase) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    },

    async getFlights(filters = {}) {
        try {
            console.log('getFlights called with filters:', filters);
            await this.waitForSupabase();
            console.log('Supabase is ready, creating query...');
            let query = supabase
                .from('flights')
                .select('*');

            if (filters.from) {
                query = query.eq('boarding_airport', filters.from);
            }
            if (filters.to) {
                query = query.eq('landing_airport', filters.to);
            }
            if (filters.airline && filters.airline.length > 0) {
                query = query.in('company', filters.airline);
            }
            if (filters.stops && filters.stops.length > 0) {
                query = query.in('stop', filters.stops);
            }
            if (filters.minPrice) {
                query = query.gte('cost', filters.minPrice);
            }
            if (filters.maxPrice) {
                query = query.lte('cost', filters.maxPrice);
            }

            console.log('Executing query...');
            const { data, error } = await query;
            console.log('Query result:', { data, error });
            
            if (error) {
                console.error('Error fetching flights:', error);
                throw error;
            }
            
            console.log('Returning flight data:', data);
            return data;
        } catch (error) {
            console.error('Database error:', error);
            return [];
        }
    },

    async getFlightById(id) {
        try {
            const { data, error } = await supabase
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
            let query = supabase
                .from('hotels')
                .select('*');

            // Apply filters
            if (filters.location) {
                query = query.eq('location', filters.location);
            }
            if (filters.rating) {
                query = query.eq('rating', filters.rating);
            }
            if (filters.minPrice) {
                query = query.gte('price', filters.minPrice);
            }
            if (filters.maxPrice) {
                query = query.lte('price', filters.maxPrice);
            }
            if (filters.amenities && filters.amenities.length > 0) {
                // Assuming amenities is stored as an array or JSON
                query = query.overlaps('amenities', filters.amenities);
            }

            const { data, error } = await query;
            
            if (error) {
                console.error('Error fetching hotels:', error);
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('Database error:', error);
            return [];
        }
    },

    async getHotelById(id) {
        try {
            const { data, error } = await supabase
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
            let query = supabase
                .from('trains')
                .select('*');

            // Apply filters
            if (filters.from) {
                query = query.eq('from_station', filters.from);
            }
            if (filters.to) {
                query = query.eq('to_station', filters.to);
            }
            if (filters.trainType && filters.trainType.length > 0) {
                query = query.in('train_type', filters.trainType);
            }
            if (filters.minPrice) {
                query = query.gte('price', filters.minPrice);
            }
            if (filters.maxPrice) {
                query = query.lte('price', filters.maxPrice);
            }

            const { data, error } = await query;
            
            if (error) {
                console.error('Error fetching trains:', error);
                throw error;
            }
            
            return data;
        } catch (error) {
            console.error('Database error:', error);
            return [];
        }
    },

    async getTrainById(id) {
        try {
            const { data, error } = await supabase
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
            let query = supabase
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
            const { data, error } = await supabase
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
        return parseInt(priceString.replace(/[^0-9]/g, ''));
    },

    getDurationInMinutes(duration) {
        const [hours, minutes] = duration.split('h').map(part => 
            parseInt(part.replace('m', '').trim()) || 0
        );
        return (hours * 60) + minutes;
    },

    getTimeInMinutes(time) {
        const [hours, minutes] = time.split(':').map(part => parseInt(part));
        return (hours * 60) + minutes;
    },

    // Search functionality
    async searchFlights(searchTerm) {
        try {
            const { data, error } = await supabase
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
            const { data, error } = await supabase
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
            const { data, error } = await supabase
                .from('trains')
                .select('*')
                .or(`train_name.ilike.%${searchTerm}%,train_number.ilike.%${searchTerm}%,from_station.ilike.%${searchTerm}%,to_station.ilike.%${searchTerm}%`);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching trains:', error);
            return [];
        }
    },

    async searchEvents(searchTerm) {
        try {
            const { data, error } = await supabase
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
        const { data: allFlights, error: allFlightsError } = await supabase
            .from('flights')
            .select('*');
        
        console.log('ALL flights in database:', { allFlights, allFlightsError });
        console.log('Total flights found:', allFlights ? allFlights.length : 0);
        
        // Check column names
        if (allFlights && allFlights.length > 0) {
            console.log('First flight columns:', Object.keys(allFlights[0]));
            console.log('Sample flight data:', allFlights[0]);
        }
        
        // Test specific filter that's failing
        const { data: mumbaiGoa, error: mumbaiGoaError } = await supabase
            .from('flights')
            .select('*')
            .eq('boarding_airport', 'BOM')
            .eq('landing_airport', 'GOI');
        
        console.log('Mumbai to Goa flights:', { mumbaiGoa, mumbaiGoaError });
        
    } catch (error) {
        console.error('Database test failed:', error);
    }
};
