const apiKey = 'XYaqoGlVwuhDrbEG0Ndv1p6P16HA1KqnvR24aBKs'; 
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.hero__search-form');
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        const startDateInput = document.querySelector('.hero__search-input').value;
        
        // Calculate end date as the next day
        const startDate = new Date(startDateInput);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        // Format dates to YYYY-MM-DD
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        await fetchAsteroids(formattedStartDate, formattedEndDate);
    });
});
async function fetchAsteroids(startDate, endDate) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
    try {
        const response = await axios.get(url);
        console.log('Response Data:', response.data); 
        // Check if near_earth_objects exists and has data
        if (response.data.near_earth_objects) {
            createAsteroidCards(response.data);
        } else {
            console.error('No near-Earth objects found for the specified dates.');
        }
    } catch (error) {
        console.error('Error fetching asteroid data:', error);
    }
}

function createAsteroidCards(data) {
    const asteroidContainer = document.getElementById("asteroidGrid");
    asteroidContainer.innerHTML = ""; 

    // Create an array to hold all asteroids with their details
    const allAsteroids = [];

    // Loop through the asteroid data
    Object.values(data.near_earth_objects).forEach((asteroidsForDate) => {
        asteroidsForDate.forEach((asteroid) => {
            // Extract relevant data
            const closestApproachDate = asteroid.close_approach_data[0].close_approach_date;
            const distance = asteroid.close_approach_data[0].miss_distance.kilometers;
            const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
            const velocity = asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour;

            // Push asteroid data into the array
            allAsteroids.push({
                name: asteroid.name,
                closestApproachDate: new Date(closestApproachDate), // Convert to Date object for sorting
                distance,
                diameter,
                velocity,
            });
        });
    });

    // Sort the array by estimated diameter in descending order
    allAsteroids.sort((a, b) => b.diameter - a.diameter);

    // Create and append the sorted cards
    allAsteroids.forEach((asteroid) => {
        const asteroidCard = document.createElement("div");
        asteroidCard.classList.add("asteroid-card"); 
        // Append asteroid details to the card
        asteroidCard.innerHTML = `
            <h3>${asteroid.name}</h3>
            <p>Closest Approach Date: ${asteroid.closestApproachDate.toISOString().split('T')[0]}</p>
            <p>Distance from Earth: ${asteroid.distance} km</p>
            <p>Estimated Diameter: ${asteroid.diameter.toFixed(2)} km</p>
            <p>Velocity: ${asteroid.velocity} km/h</p>
        `;
        // Append the card to the container
        asteroidContainer.appendChild(asteroidCard);
    });
}
