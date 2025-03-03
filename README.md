Follow these steps to set up and run the project:

# Install dependencies:
Run the following command to install all required packages :  "npm install"

# Start the development server:
Use this command to start the project : "npm start"


Code Structure
The project is organized into the following main screens:

1 Home Screen:

 * Acts as the landing page of the app.
 * Provides navigation options to access different features like timer management and history
   
2 Timer Screen:

 * Allows users to create, start, pause, and reset timers.
 * Includes options to categorize timers (Workout, Study, Break, Other).
 * Supports bulk actions for starting, pausing, or resetting all timers within a category
 
 3 Timer List Screen:

* Displays all active timers grouped by their categories.
* Each category section is expandable/collapsible.
* Real-time countdown and progress visualization with a progress bar

4 History Screen:

* Shows a record of completed timers.
* Users can review past timers, categorized by completion time.
* Offers an Export to JSON feature to download the history data in JSON format for backup or external use  


Technology Stack
  * Framework: React Native
  * Programming Language: TypeScript
  * Data Persistence: AsyncStorage for local storage
  * Navigation: React Navigation for screen transitions
  * State Management: React hooks (useState, useEffect)
