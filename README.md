# 🧾 Game Blog – Angular Application

## 📌 Application Purpose

The purpose of the application is to allow users to create, explore, and manage game-related blog posts.
Users can browse posts, read details, and—after authentication—create, edit, and delete their own content.

---

## 👤 User Roles

### Guest (Not Authenticated User)

* Can view the Home page
* Can view the Catalog (all posts)
* Can open the Details page of a post
* Can register or login

### Authenticated User

* Can create new posts
* Can edit their own posts
* Can delete their own posts
* Can access personal Dashboard (their posts)

---

## 🌐 Public Features

* Home page
* Catalog page (all posts)
* Details page for each post
* Login page
* Register page

---

## 🔐 Authenticated User Features

* Create new post
* Edit own post
* Delete own post
* View personal dashboard with own posts

---

## 🔄 Main Application Flow

1. User opens the Home page
2. Navigates to the Catalog page
3. Opens a post in the Details page
4. Registers or logs in
5. Authenticated user creates a post
6. The post appears in the Catalog
7. User can edit or delete their own post
8. User can view all their posts in Dashboard

---

## 🗄️ Data Structure

### Post Object

* id
* title
* category
* imageUrl
* summary
* content
* authorId
* authorUsername
* authorEmail
* createdAt (Firestore Timestamp)
* updatedAt (Firestore Timestamp, optional)

### User Object

* uid
* email
* username
* profileImageUrl
* createdAt
* posts (array of post IDs)

---

## 🏗️ Project Architecture

```text
src/app/

core/
  services/
    auth.service.ts
    posts.service.ts
    user.service.ts
  guards/
    auth.guard.ts
    guest.guard.ts

features/
  auth/
    login/
    register/
  posts/
    catalog/
    details/
    create/
    edit/
    dashboard/

shared/
  models/
  pipes/
  post-form/
```

---

## ⚙️ Technologies Used

* Angular
* TypeScript
* RxJS
* Firebase Authentication
* Cloud Firestore
* Firebase Hosting
* AngularFire
* CSS

---

## 🧩 Additional Functionality / Bonus Features

* **Custom Pipe** – the project includes a custom `truncate` pipe used to shorten long text in post previews
* **Online Deployment** – the application is deployed online with Firebase Hosting
* **Improved UX** – loading states, empty states, validation messages, and error handling are implemented

---

## ▶️ How to Run the Project

1. Clone the repository

```bash
git clone <https://github.com/stanislavgospodinov/Game-Blog.git>
```

2. Navigate to project folder

```bash
cd game-blog
```

3. Install dependencies

```bash
npm install
```

4. Start the application

```bash
ng serve
```

5. Open in browser

```text
http://localhost:4200
```

---

## 🔐 Firebase Setup

Make sure Firebase is configured in the project and:

* Firestore Database is created
* Authentication provider (Email/Password) is enabled
* Firebase Hosting is initialized for deployment

---

## 🌍 Live Demo

The project is deployed online and can be accessed here:

```text
https://game-blog-62355.web.app
```

---

## 📄 Additional Notes

* Only authenticated users can create, edit, and delete posts
* Users can modify only their own posts
* Firestore rules are used to enforce data security
* Reactive Forms are used for validation
* RxJS is used for handling async operations

---

## ⚠️ Important Notes (Before Submission)

* The repository must be **public**
* The project must have **at least 5 meaningful commits**
* Commits should be made in **at least 3 different days**
* The application must run successfully

---

## 🔐 Firestore Rules (Example)

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create, read, update: if request.auth != null && request.auth.uid == userId;
    }

    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.authorId;
    }
  }
}
```

---

## 🎯 Final State

The application includes:

* Authentication (Login/Register)
* Route Guards
* Full CRUD functionality
* Catalog and Details pages
* Dashboard for user posts
* Form validation
* Firebase integration
* Custom pipe
* Online deployment
* Proper project structure
