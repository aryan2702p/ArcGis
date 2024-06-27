async function register_user(data) {
    console.log("saveLayerData function called");
    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            console.log("User logged in successfully.");
            // Redirect to the index page
            window.location.href = '/';
          } else {
            console.error('Login failed:', await response.json());
          }
        // const response_data = await response.json();
        // console.log('user_saved:', response_data);
        // const userId = response_data.id; // Adjust according to your server response

        // // Redirect to index.html with userId as a query parameter
        // window.location.href = `index.html?userId=${userId}`;

    } catch (error) {
        console.error('Error saving layer data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');


    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Collect user input
        const email = emailInput.value;
        const password = passwordInput.value;

        // Example URL where your server API endpoint might be
        //const url = 'https://example.com/login';

        // Example data format assuming your server expects JSON
        const data = {
            email: email,
            password: password
        };
        register_user(data);
        
        // Example fetch request to send data to server

    });
});
