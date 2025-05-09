# Workout Tracker Application

A full-stack web application for tracking and managing workout routines, exercises, and fitness plans.

## Overview

This application allows users to browse exercises organized by muscle groups, create customized workout plans, and track their fitness journey. The system features a RESTful API backend with a SQLite database and a responsive frontend built with HTML, CSS, and vanilla JavaScript.

## Features

- **Exercise Library**: Browse and search exercises categorized by muscle groups
- **Custom Workout Plans**: Create personalized workout plans with specific exercises, sets, and reps
- **Exercise Management**: Add new exercises to the system with detailed steps
- **Plan Management**: Update workout plans by adding, editing, or removing exercises

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: RESTful architecture

## Application Structure

The application follows a classic client-server architecture:

### Backend

- **RESTful API** with the following main endpoints:
  - `/muscle-groups` - Manage muscle group categories
  - `/exercises` - Handle exercise data and details
  - `/exercises/{id}/steps` - Manage exercise instructions
  - `/workout-plans` - Create and manage workout plans
  - `/workout-plans/{id}/exercises` - Add and configure exercises in plans

### Frontend

- **Pages**:
  - Home Page: Welcome screen with app introduction
  - Exercises Page: Browse and search exercises
  - Customize Your Plan: Create new workout plans
  - Plans For You: View and manage existing workout plans


## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/workout-tracker.git
   cd workout-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open the application:
   ```
   Open http://localhost:3000 in your browser
   ```


## Usage Examples

### Creating a Workout Plan

1. Navigate to "Customize Your Plan"
2. Enter a name for your plan
3. Add exercises using the "Add Exercise" button
4. Select exercises from the dropdown menu
5. Specify sets and reps for each exercise
6. Click "Save Plan" to create your workout plan

### Browsing Exercises

1. Navigate to "Exercises" page
2. Use the search bar to find specific exercises
3. Filter by muscle group using the dropdown
4. Click on an exercise to view details and instructions





## Acknowledgments

- Icons and design inspiration from various fitness applications
- the personal photos used are mine, and is not allowed to be used without my permission
- Built as a project for web basics course
