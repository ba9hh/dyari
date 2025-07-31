const { createClient } = require('@supabase/supabase-js');

// Replace these with your Supabase project details
const supabaseUrl = 'https://obhlpgxxiotewfhcvdaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaGxwZ3h4aW90ZXdmaGN2ZGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1OTQzMTUsImV4cCI6MjA1MTE3MDMxNX0.oUpWVXoC7KPGo2u1IyM16KYXJ1WNeGRXOSh7JAuE4J8'; // Use the Service Role Key for server-side operations
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;