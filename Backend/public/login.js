// document.addEventListener('DOMContentLoaded', function() {
//     const form = document.getElementById('form');

//     form.addEventListener('submit', function(event) {
//         event.preventDefault(); // Prevent the default form submission

//         // Redirect to index.html
//         window.location.href = 'index.html';
//     });
// });


async function login_user(data) {
    console.log("saveLayerData function called");
    try {
        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const response_data = await response.json();
        console.log('Layer saved:', response_data);
        const userId = response_data.id; // Adjust according to your server response

        // Redirect to index.html with userId as a query parameter
        window.location.href = `index.html?userId=${userId}`;

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
        login_user(data);
        
        // Example fetch request to send data to server

    });
});

// function login_user() {
//     console.log("login api called")
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//    // const messageElement = document.getElementById('message');

//     const data = {
//         email: email,
//         password: password
//     };

//     fetch('http://localhost:5000/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         const userId = data.id; // Adjust according to your server response

//         // Redirect to index.html with userId as a query parameter
//         // window.location.href = `index.html?userId=${userId}`;
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

