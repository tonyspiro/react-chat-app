##React Chat App
![Screencast](https://github.com/tonyspiro/react-chat-app/blob/master/screencast.gif)

This is an example of a basic real time chat app using React, Socket.io and Cosmic JS.  This example consists of the following:

1. [React](https://facebook.github.io/react/) for UI
2. [Babel](https://babeljs.io/) for ES6 and JSX transformation
3. [Webpack](https://webpack.github.io/) for bundling
4. [Socket.io](http://socket.io/) for real-time communication
5. [Cosmic JS](https://cosmicjs.com) for saving and returning messages from a cloud-hosted API

The following dev tools are used:

1. [ESLint](http://eslint.org/) to make sure our code is consistent
2. [React Hot Loader](https://github.com/gaearon/react-hot-loader) for instant updates on save

###Install
Run the following commands to install the app:
```
git clone https://github.com/tonyspiro/react-chat-app
cd react-chat-app
npm install
```
####Run in production
Run the following command to run the app in production:
```
npm start
```
View the app running in production at [http://localhost:3000](http://localhost:3000)

####Run in development
Run the following commands to run the app in development with hot reloading:
```
npm start server
```
and in another terminal tab run:
```
npm run development
```
View the app running in development at [http://localhost:8080](http://localhost:8080)

###Configure your own chat app
1. Set up a bucket in [Cosmic JS](https://cosmicjs.com) with an object type of `messages`.
2. Edit config.js:
```javascript
// config.js
export default {
  bucket: {
    slug: 'your-bucket-slug',
    type_slug: 'messages'
  },
  server: {
    host: process.env.APP_URL || 'http://localhost:3000'
  }
}
```
