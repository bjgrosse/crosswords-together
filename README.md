## Overview

This is a pet personal project. I enjoy solving the occasional crossword puzzle, but I've often thought that it would be even more fun to solve them collaboratively with friends.

This project is the result of that idea. Check it out at [crosswordstogether.com](https://crosswordstogether.com)

## Technology

This is a **progressive web app** (PWA) that supports **push notifications** and **offline caching** and can be added to the home screen of a phone or tablet like a native app. Push notifications are multi-device supported so if a user connects from multiple devices push notifications will be delivered to each.

The application is **fully cross-platform compatible**: one code base for web and mobile, iOS and Android.

A serverless, single-page-application, it uses Google's **Firebase** application platform for authentication, push messaging, and static file hosting. **Firestore** is the primary data store.

It's a **React** application bootstrapped with **create-react-app**. The state management system is **mobx-state-tree**. The UI design system is **Material UI** with **styled-components**.
