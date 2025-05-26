**TheDailyLens Frontend Documentation**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Component Overview](#component-overview)
5. [Installation & Setup](#installation--setup)
6. [Running the App](#running-the-app)
7. [Styling & Theming](#styling--theming)
8. [State Management](#state-management)
9. [Routing](#routing)
10. [Contribution Guidelines](#contribution-guidelines)
11. [License](#license)

---

## Introduction

**TheDailyLens** is a modern, responsive news web application built using React. It aggregates news articles from various sources and presents them in a user-friendly interface. This documentation covers only the frontend aspects of the project.

---

## Features

* Fetch and display latest news by category (e.g., World, Business, Technology, Sports)
* Search functionality for articles
* Article detail pages with full content
* Sending emails for subscribed users
* Infinite scroll or pagination for article lists

---

## Tech Stack

* **Framework:** React
* **Package Manager:** npm 
* **Build Tool:** Create React App (CRA)
* **State Management:** React Context API
* **Routing:** React Router
* **Styling:** CSS Modules 


---

## Component Overview

Below is a high-level overview of key components:

* **Header:** Contains logo, navigation links, and a search bar.
* **Footer:** Site footer with links and credits.
* **Comment:** Displays a brief preview of an comment (image, title, content).
* **ShowComments:** Renders a grid or list of `Comment` components with pagination.
* **BlogDetails:** Shows full article content with author, date, content, title,  and related links.
* **SearchComponent:** List of users and blogs, when searched.

---

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/TheDailyLens-frontend.git
   cd TheDailyLens-frontend
   ```
2. **Install dependencies**:

   ```bash
   npm install
   ```

---

## Running the App

* **Development mode**:

  ```bash
  npm start
  ```

  Opens at `http://localhost:5173` by default.
* **Production build**:

  ```bash
  npm run build
  ```

  Output to the `build/` directory.

---

## Styling & Theming

* Global styles are in `public/css`.
* All are imported from all.css.

---

## State Management

* `src/contexts/AuthContent.jsx`: Manages getting the user from the backend.
---

## Routing

* Defined in `src/App.tsx` using React Router:

  ```jsx
         <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/error/:code/:message" element={<ErrorPage />}/>
          <Route path="*" element={<Navigate to="/error/404/Page%20Not%20Found" />} />
          <Route path="/blog/:id" element={<BlogDetail  />}/>
          <Route path="/results" element={<SearchComponent  />}/>

          <Route  element={<RouteGuard />}>
            <Route path="/profile/:username" element={<ProfilePageComponent />}/>
            <Route path="/:username/postedComments" element={<PostedComments /> } />
            <Route path="/profile/edit" element={<EditProfile />}/>
            <Route path="/createBlog" element={<CreateBlog />}/>
            <Route path="/blog/:id/comments" element={<ShowComments />}/>
            <Route path="/:username/postedBlogs" element={<PostedBlogs /> }/>
            <Route path="/blog/:id/edit" element={<EditBlog />}/>
            <Route path="/:username/likedBlogs" element={<LikedBlogs />} />
          </Route>
 
          <Route element={<GuestGuard />}>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
          </Route>

        </Routes>
  ```

---


## Contribution Guidelines

1. Fork the repo and create a feature branch (`git checkout -b feature/YourFeature`).
2. Commit changes (`git commit -m "feat: add your feature"`).
3. Push to the branch (`git push origin feature/YourFeature`).
4. Open a Pull Request and describe changes.

---

## License

This project is licensed under the [MIT License](LICENSE).




