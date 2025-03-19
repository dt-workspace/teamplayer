# **Statement of Work (SOW)**

## **Project: Team Player Mobile Application**

**Date:** March 08, 2025

---

## **Project Overview**

**Team Player** is a mobile application designed for project managers to efficiently manage teams, projects, and personal tasks in a fully offline environment. The app includes team coordination, project assignment, group categorization, availability tracking, personal task management, and local multi-account authentication. It targets iOS and Android platforms, providing a seamless experience for multiple users on a single device.

**Objective:**

To deliver an offline-first mobile app that allows project managers to create local accounts, manage teams and projects, track availability, and handle personal tasks privately, all within a secure and intuitive interface.

**Scope:**

* Develop a cross-platform mobile app with offline functionality.  
* Include six core modules: Authentication, Team Management, Project Management, Group Management, Availability Tracker, and Personal Task Management.  
* Use React Native and @op-engineering/op-sqlite for development.

---

## **Modules**

### **1\. Authentication Module**

**Description:** This module enables local user account creation and management on the device, allowing multiple project managers to use the app independently with their own data. Authentication is handled offline with secure local storage.

**Feature List:**

* **Account Creation:**  
  * Register a new user with a username and PIN (4-6 digits).  
  * Optional: Add a user profile (name, role title, e.g., "Senior PM").  
  * Store credentials locally with encryption.  
* **Login:**  
  * Select username from a dropdown list of local accounts.  
  * Enter PIN to access the account.  
  * Option to log out and switch accounts.  
* **Account Management:**  
  * Delete an account (with confirmation prompt).  
  * Reset PIN (via a recovery question, e.g., “What’s your favorite project?”).  
* **Data Isolation:**  
  * Each account has its own isolated dataset (teams, projects, tasks).  
  * No data sharing between accounts.  
* **Offline Security:**  
  * Encrypt user credentials and data using SQLite encryption.  
  * No internet required for authentication or account switching.

---

### **2\. Team Management Module**

**Description:** Allows the project manager to view, manage, and contact team members (junior managers and developers) in a centralized dashboard, with detailed profiles and communication options.

**Feature List:**

* **Team Dashboard:**  
  * Display team members in a sortable list or grid (sort by name, role, status).  
  * Show details: name, role, status (Free/Occupied), group, last updated timestamp.  
  * Search by name or role with real-time filtering.  
  * Swipe to edit/delete a team member.  
* **Contact Details:**  
  * Store phone number, email, and optional secondary contact (e.g., WhatsApp).  
  * Tap-to-call: Initiates a call via native dialer.  
  * Tap-to-email: Opens email client with pre-filled recipient.  
* **Profile Management:**  
  * Add/edit team member: Input name, role, contact info, group assignment.  
  * Bulk import option (e.g., paste a CSV-style list).  
* **Offline Access:**  
  * Cache all team data locally for instant retrieval and editing.

---

### **3\. Project Management Module**

**Description:** Enables the creation, assignment, and tracking of projects, with detailed metadata and team member roles, all managed offline.

**Feature List:**

* **Project Creation:**  
  * Input fields: name, description (up to 500 characters), start date, deadline, priority (High/Medium/Low).  
  * Assign team members with specific roles (e.g., Lead Manager, Developer).  
  * Add optional project tags (e.g., “Urgent,” “Client”).  
* **Project View:**  
  * List projects with sorting options (by deadline, name, priority).  
  * Show assigned team members, status (e.g., Active, Completed), and progress (manual percentage input).  
  * Tap to view full details or edit.  
* **Assignment Management:**  
  * Reassign or remove team members from projects.  
  * Drag-and-drop interface for quick assignment changes.  
* **Offline Sync:**  
  * Store and edit project data locally with conflict-free updates.

---

### **4\. Group Management Module**

**Description:** Facilitates categorization of team members and projects into custom groups for organization and quick filtering, stored locally.

**Feature List:**

* **Team Grouping:**  
  * Create custom groups (e.g., “A-Level Developers,” “B-Level Managers”).  
  * Assign team members to multiple groups if needed.  
  * Edit/delete groups with drag-and-drop reordering.  
  * Filter team dashboard by single or multiple groups.  
* **Project Grouping:**  
  * Create project categories (e.g., “Demo Projects,” “In-House Projects”).  
  * Assign projects to one or more groups with color-coded tags (e.g., Red for RUD Projects).  
  * Bulk assign existing projects to a new group.  
* **Group Insights:**  
  * Show group stats (e.g., “A-Level Developers: 5 members, 3 occupied”).  
* **Offline Support:**  
  * Store group assignments locally for instant access and modification.

---

### **5\. Availability Tracker Module**

**Description:** Provides a detailed calendar view to manually manage and track team availability, with daily and weekly insights.

**Feature List:**

* **Calendar View:**  
  * Display team availability by day, week, or month.  
  * Toggle status per member: Free, Occupied, Partial (with time slots, e.g., “Free 9-12 PM”).  
  * Color-coded statuses (e.g., Green \= Free, Red \= Occupied).  
* **Bulk Updates:**  
  * Mark multiple team members’ status for a date range (e.g., “Alice and Bob free March 10-12”).  
* **Filters:**  
  * View by individual, group, or role (e.g., “Show only Developers”).  
  * Highlight conflicts (e.g., member assigned to two projects on same day).  
* **Offline Functionality:**  
  * Store and update availability locally with no latency.

---

### **6\. Personal Task Management Module**

**Description:** A private, detailed task manager for the project manager, integrated with the calendar but isolated from team data.

**Feature List:**

* **Task Creation:**  
  * Add tasks with name, due date/time, priority, category (e.g., “Admin,” “Meetings”), and notes (up to 1000 characters).  
  * Subtasks option (e.g., “Call client” under “Prepare Q1 Report”).  
  * Quick-add via voice or text (e.g., “Meeting at 3 PM tomorrow”).  
* **Task Status:**  
  * Toggle between To Do, In Progress, Completed, or On Hold.  
  * Manual progress bar (e.g., slide to 75% complete).  
* **Reminders:**  
  * Set multiple reminders per task (e.g., 1 day before, 1 hour before).  
  * Local push notifications with custom sounds.  
* **Daily Integration:**  
  * Display tasks in calendar view with private icons (e.g., lock symbol).  
  * Filter calendar to show only personal tasks.  
* **Task History:**  
  * Archive completed tasks with search functionality.  
* **Offline Access:**  
  * Full task management stored locally with instant updates.

---

## **Technical Stack**

### **Frontend:**

* **React Native**  
  * Cross-platform framework for iOS and Android.  
  * Offline-first design with local state management using Redux or Context API.  
  * UI components: FlatList for lists, Modal for forms, CalendarPicker for dates.

### **Database:**

* **@op-engineering/op-sqlite**  
  * Local SQLite database with key features:  
    * **SQLCipher:** Encrypts data for multi-account security.  
    * **FTS5:** Enables fast text search (e.g., team names).  
    * **Reactive Queries:** Updates UI on data changes.  
    * **JSONB:** Stores structured data (e.g., assignments, subtasks).  
  * Schema:  
    * Users (id, username, pin\_hash, profile\_name, recovery\_answer).  
    * TeamMembers (id, user\_id, name, role, phone, email, status, group\_ids).  
    * Projects (id, user\_id, name, description, start\_date, deadline, priority, assigned\_members, group\_ids).  
    * Availability (id, user\_id, member\_id, date, status, time\_slots).  
    * PersonalTasks (id, user\_id, name, due\_date, priority, category, status, notes, subtasks).  

### **Additional Libraries:**

* **@reduxjs/toolkit:** Simplifies state management with Redux.  
* **react-native-offline:** Manage offline state and queue updates.  
* **react-native-call:** Enable tap-to-call functionality.  
* **react-native-push-notification:** Offline task reminders.  
* **crypto-js:** Encrypt PINs and sensitive data locally.  
* **react-native-voice:** Voice input for quick task creation.  
* **react-navigation:** Handle navigation and routing within the app.  
* **react-native-paper:** UI components for consistent design.  
* **react-native-vector-icons:** Custom icons for UI elements.

### **Offline Functionality:**

* All features operate without internet connectivity.  
* Data is stored locally in SQLite with no server dependency.  
* Local notifications and actions (e.g., calls) use device capabilities.

### **Development Tools:**

* **IDE:** Visual Studio Code.  
* **Testing:** Jest (unit tests), Detox (E2E tests).  
* **Build Tools:** Xcode (iOS), Android Studio (Android).

---

## **Deliverables**

1. Fully functional **Team Player** app (iOS and Android).  
2. Source code with inline comments and documentation.  
3. Offline database schema and setup guide.  
4. User manual covering account creation, navigation, and feature usage.

## **Assumptions**

* App supports up to 10 local accounts per device.  
* Team size per account is capped at 100 members for performance.  
* No cloud sync or external integrations required.

