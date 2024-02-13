# Continuous Feedback Application

This application is built with Node.js, Express, and React. It's designed to facilitate real-time feedback in an educational setting, with distinct roles and functionalities for students and professors.

## Features

### Professor Role
- Create a new account or log in to the application.
- View a list of activities.
- Add or delete activities.
- Click on an activity to view a real-time graph of student feedback.

### Student Role
- Create a new account or log in to the application.
- Enter an access key for a course to provide feedback.
- Your feedback will be transmitted in real time.

## Prerequisites

To run this application, you need to have Node.js installed on your computer. If you don't have Node.js installed, you can download and install it from the official Node.js website.

## Setup

The application contains two directories: `client` and `node`.

1. To set up the application, you need to run `npm i` in both directories.
2. Make a copy of the `.env.example` file in the `node` directory and rename it to `.env`.
3. Open the terminal and run `node`.
4. Then run `require('crypto').randomBytes(64).toString('hex')`. This will generate a random hexadecimal string of 128 characters in length.
5. Replace `<your-random-generated-string>` in the `.env` file with the string generated in the previous step.


## Running the Application

To run the application, you need to open two terminals:

1. In the `client` directory, run `npm start`.
2. In the `node` directory, run `node index.js`.

## Authentication

Authentication is based on JWT tokens.

Enjoy using the application and we look forward to your valuable feedback!

## License
This project is licensed under the terms of the MIT license.