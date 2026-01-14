# Customer Feedback And Survey Form
## Overview
This project implements a client side form with real time validation of input fields and prevents form submission without selecting necessary fields.

## Features
- Real time validation using "blur", "click" and "change" events.
- Display clear error messages
- Scrolls to required features automatically on invalid submit
- Interactive Star rating design

## Tech Stack
- HTML
- CSS
- Javascript

## Utils Folder Overview
- conditional.js: Contains conditional validation logic for Support Section.
- formManagement.js: Responsible for form state management including populating form fields during Edit mode, resetting the form after Submit/Update and switching between Submit and Update modes.
- formValidation.js: Handles full form validation on Submit and responsible for displaying error message across fields.
- modalHandling.js: Manages all modal behaviour such as Success Modal, Delete Modal, Ratings View Modal
- ratings.js: Handles star styling logic such as onClick, hover animation and resetting values on form submit. 
- stepperNavigation.js: Handles validation in each Step of Section Slider and displays error messages on invalid input.
- storage.js: Saves the form data in local storage and retrieves data on requirement to avoid data loss during page reload.
- tableActions.js: Handles table actions like Edit, View and Delete
- tableRendering.js: Handles the table rendering by using appropriate DOM manipulation logic.
- validation.js: Contains all the validation logic to be performed on submit.
## How to run the project locally
1. Clone the repository
2. Install Live Server Extension
3. CLick Go Live at bottom right corner

## Deployment Url
https://customer-feedback-and-survey-form.vercel.app/

