const SUPABASE_URL = 'https://okbotrgwafkgxehsspng.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6SZuxGeBbnXLJxYsHhq_4g_hb06s6T5';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Particles Load
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

// Auth Toggle Logic
async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        document.getElementById('logged-out-ui').style.display = 'none';
        document.getElementById('logged-in-ui').style.display = 'block';
        document.getElementById('user-greeting').innerText = `Welcome, ${user.user_metadata.full_name}`;
    }
}

document.getElementById('login-btn').addEventListener('click', async () => {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'discord',
    });
});

checkUser();