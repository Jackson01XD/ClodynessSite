const SUPABASE_URL = 'https://okbotrgwafkgxehsspng.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6SZuxGeBbnXLJxYsHhq_4g_hb06s6T5';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Particles Load (Kept your original style)
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 60 },
        "color": { "value": "#9d50bb" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5 },
        "size": { "value": 3 },
        "line_linked": { "enable": true, "distance": 150, "color": "#6e48aa", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2 }
    }
});

// --- NEW CLOUD SYNC LOGIC ---

// This replaces Discord Auth with a Username-based Cloud Sync
async function syncProfile() {
    const username = document.getElementById('username-input').value; // Make sure you have this ID in your HTML
    
    if (!username) {
        alert("Please enter a username to sync!");
        return;
    }

    // 1. Check if the profile exists in the 'public.profiles' table
    let { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (error && error.code === 'PGRST116') {
        // 2. If not found, create a new Cloud Profile
        const { data: newProfile, error: createError } = await supabaseClient
            .from('profiles')
            .insert([{ username: username, coins: 0 }])
            .select();

        if (createError) {
            console.error("Error creating profile:", createError);
        } else {
            alert(`Welcome to Clodyness, ${username}! Your cloud profile is ready.`);
            updateUI(username, 0);
        }
    } else {
        // 3. If found, "Log them in"
        alert(`Welcome back, ${username}! Syncing your coins and skins...`);
        updateUI(profile.username, profile.coins);
    }
}

function updateUI(name, coins) {
    document.getElementById('logged-out-ui').style.display = 'none';
    document.getElementById('logged-in-ui').style.display = 'block';
    document.getElementById('user-greeting').innerText = `Logged in as: ${name}`;
    // If you add a coin display:
    // document.getElementById('coin-count').innerText = `${coins} Coins`;
}

// Add the listener to your button
document.getElementById('login-btn').addEventListener('click', syncProfile);

// Check if they were already "logged in" via LocalStorage
const savedUser = localStorage.getItem('clod_user');
if (savedUser) {
    updateUI(savedUser, 0);
}
