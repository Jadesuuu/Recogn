**Recogn:** <br />
React Native Expo Mobile Application for Image Classification with Flask Backend <br />

This project demonstrates a mobile application built with React Native Expo that captures images, sends them for processing to a Flask server, and displays the preprocessed image along with predicted confidence scores.

**Table of Contents**<br />
• Project Overview: #project-overview<br />
• Technologies Used: #technologies-used<br />
• Setup Instructions: #setup-instructions<br />
• Running the App: #running-the-app<br />
• Flask Server Setup (Optional): #flask-server-setup<br />

**Project Overview**<br />

This application allows users to capture images using their mobile device camera. The captured image is then sent to a Flask server for preprocessing and classification. The server returns the preprocessed image and predicted confidence scores for different categories. Finally, the app displays the processed image and confidence scores on the screen.<br />

**Technologies Used** <br />
• React Native: https://reactnative.dev/ (TypeScript framework for mobile apps)<br />
• Expo: https://expo.dev/ (Development platform for React Native apps)<br />
• Flask (Optional): https://flask.palletsprojects.com/ (Python web framework for backend server)<br />

**Setup Instructions**<br />
1. Prerequisites<br />
   • Node.js and npm installed: https://nodejs.org/en/download<br />
   • Expo CLI installed globally: `npm install -g expo-cli`<br />
2. Clone repository git clone https://github.com/Jadesuuu/Recogn.git<br />
3. Install dependencies: npm: `npm install` yarn: `yarn add`<br />
4. (Optional) Set Up Flask Server<br />
   Refer to the instructions in the `flask_server` folder for setting up the Flask server and configuring the API endpoint.<br />

**Running the App**<br />
1. Start the development server `npx expo start`<br />
2. Open the expo app in your ios or android<br />
3. Scan the qr code using the expo app generated in your terminal
