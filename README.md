## Overview

This is a pet personal project. I enjoy doing the occasional crossword puzzle, but I've often thought that it would be fun to be able to solve them collaboratively with friends.

This project is the result of that idea. Check it out at (crosswordstogether.com)[https://crosswordstogether.com]

## Technology

This is a **progressive web app** (PWA) that supports **push notifications** and **offline caching** and can be added to the home screen of a phone or tablet like a native app. It's **fully cross-platform compatible**: one code base for web and mobile, iOS and Android.

The application is completely serverless. It uses Googles **Firebase** application platform for authentication, push messaging, static file hosting. It uses **Firestore** as the primary data store.

It's a **React** application bootstrapped with **create-react-app**. The application state system is **mobx-state-tree**. The UI design system is **Material UI**.
