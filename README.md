# Moodle

## Overview
Mood-based food review application that allows users to save their current mood, choose restauraunts from an interactive map, write reviews directly on map, and look back at past reviews.

## Demo
[Watch Demo](https://drive.google.com/file/d/19ZSuLSe2diOJeVcEWRaRqp5F8fJc6z4a/view?usp=sharing)

<img width="250" alt="Login_Screen" src="https://github.com/user-attachments/assets/1c9c552f-a144-4d78-a53b-b34b3133a04e" />
<img width="250" alt="Profile_Screen" src="https://github.com/user-attachments/assets/66d9b4a6-b6fe-4840-9007-9fbc04f0d8ec" />
<img width="250" alt="Map_Screen" src="https://github.com/user-attachments/assets/9dc9203e-c269-46bb-96fc-56c84ef8b44f" />
<img width="250" alt="Review_Writing_Modal" src="https://github.com/user-attachments/assets/27d5b56b-c433-4d78-bdbb-d2c1c3ce3f52" />
<img width="250" alt="Reviews_Screen" src="https://github.com/user-attachments/assets/6a58ca66-9544-4c47-beb6-8cbdddaea205" />
<img width="250" alt="Review_Screen_Modal" src="https://github.com/user-attachments/assets/f48bee09-f14f-42ce-8a0e-8b0f728ec232" />

## Features

### Account
- Login and sign-up screen
- User authentication using Supabase

### Profile Screen 
- Text fields for first and last name
- Emoji grid where user can select current mood from 9 options
- User data saved into Supabase table

### Map Screen
- Interactive map with real locations using Overpass API
- Passes user's actual location (Default location used for demo)
- User's current mood determines which locations map displays
- Map filtering system connecting user mood to locations from Overpass (via cuisine/type)
- Review writing modal displays location name, address (hyperlinked), and average rating (default 3.5)
- Average rating can change based on actual user reviews
- "Reviews" dropdown displays reviews from other users 
- Star rating, user mood, and text box provided for review writing
- Pin switching from red to green indicates review submitted

### Review Screen
- Displays leaderboard ranking number of reviews per user
- Shows reviews written by user
- Clicking review displays all review details
- User can delete review

## Technologies Used
- React Native
- Expo Go
- TypeScript
- Supabase
- Overpass API

## What I Learned
- Implementing Overpass API queries to create an interactive map
- Working with user location features
- Using Supabase for user authentication, database management, and RLS
- Using Supabase to utilize data from multiple users across screens
- Supabase foreign key relationship to connect multiple tables



