# ReachInBox Frontend

This project is built using [Next.js](https://nextjs.org) with [Tailwind CSS](https://tailwindcss.com). The task is to develop a fully functional web app using the provided designs and APIs, following the guidelines outlined below.

## Project Requirements

1. **Login Page**: 
   - Implement the login page using the provided design.
   
2. **Google Login**: 
   - Upon successful login, the user should be redirected to the onebox screen located at `/google-login`.
   
3. **Onebox Data Fetching**:
   - Use the following API endpoints to fetch and manage data within the onebox:
     - `GET /onebox/list` – Retrieve the list of onebox threads.
     - `GET /onebox/:thread_id` – Fetch data for a specific thread.
     - `DELETE /onebox/:thread_id` – Delete a thread by its ID.
   
4. **Keyboard Shortcuts in Onebox**: 
   - Implement keyboard shortcuts for a better user experience:
     - Press **D** to delete a thread.
     - Press **R** to open the reply box.
   
5. **Custom Text Editor**: 
   - Customize the text editor by adding buttons like “SAVE” and “Variables” for additional functionality.
   
6. **Reply Functionality**: 
   - Implement the reply feature. When the user clicks "send," the reply should be posted using the following API:
     - `POST /reply/:thread_id`
     - Example request body:
       ```json
       {
         "from": "email",
         "to": "email",
         "subject": "",
         "body": "<html></html>"
       }
       ```
   
7. **Light and Dark Mode**: 
   - Implement support for both light and dark mode themes, allowing users to toggle between them.

## How to Run the Project

To set up and run the project locally, follow these steps:

1. **Install Dependencies**:
   First, install the required dependencies by running one of the following commands:

   ```bash
   npm install
   ```

2. **Start the Development Server**:
   Once the dependencies are installed, start the development server with:

   ```bash
   npm run dev
   ```

3. **View the App in the Browser**:
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

4. **Edit and Auto-Reload**:
   You can begin making changes to the project by editing the `app/page.tsx` file. The page will auto-update as you make edits.

## Additional Resources

- **[Next.js Documentation](https://nextjs.org/docs)** – Explore Next.js features and API.
- **[Learn Next.js](https://nextjs.org/learn)** – An interactive tutorial to deepen your understanding of Next.js.

---
