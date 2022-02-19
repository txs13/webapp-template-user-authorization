<h1>Webapp template with user authorization</h1>
<p>The purpose of this repository is to have a tested MERN template with user authorization system implemented, which could be used as a starting code set for further app developments.</p>
<h1></h1>
<p>Functionally wise, app template includes the user registration form, login form, navigation bar, empty pages for app description, user profile, main app page, settings.</p>
<p>Registration form has the following features:</p>
<ul>
<li>App checks that email, password, name are entered correctly and match standard patterns.</li>
<li>Email address is supposed to be unique, so app checks whether entered email is already registered</li>
<li>The information entered is sufficient for the registration process.</li>
</ul>
<p>Login form functionality is pretty standard and allows user to login and to remember username so this not to be entered the next time visiting the app. Email input does the same email patterns check in order to prevent typos.</p>
<p>Navigation bar provides pretty standard functionality - before login it provides the possibility to navigate to the app description, register and login pages. After login, it has the following destinations: user profile, app settings, log out, app itself. Currently all the destinations except login and registration forms are simply empty pages.</p>
<p>The app is dockerized. Please pay attention to the related explanations regarding environmental variable in backend chapter.</p>
<p>Please find below the list of components used in the projects and some remarks about software structure, features.</p>
<h1></h1>
<h2>Backend</h2>
<p>This is pretty standard Express app with the following additional packages:</p>
<ul>
<li>Express itself. Currently only 2 routes are partially implemented - users and user roles. There is a script in the folder "config" which is called every system startup, which checks / automatically creates admin user, user roles. Do not forget to modify or delete it when you do not need it. Admin role, as well as Developer and Recruiter roles are just names. The only difference is that admin user can get all the roles including admin role, others cannot.</li>
<li>Passport, JWT strategy. The is a separate file in the folder keys which is not called from the main program - it can be used to generate new pair of keys. So far there is no special reason to use asyncronous cyphering with private and public keys, but I decided to have it for future options not to refactor the code later.</li>
<li>Mongoose, MongoDB, dotenv. Please find below the list of environmental variables as well as please check database initialization config file which is called every time app starts. The idea behind is to get right URI string to the MongoDB depending on the way app is started. Therefore there are several options in the package.json file, which start the app with different environmental variables.</li>
<li>Jest, Supertest npm packages for API tests.</li>
<li>Jest-puppetier, Puppeteer npm packages for e2e tests.</li>
</ul>
<h3>What is tested</h3>
<p>The following components are tested in the app:
<ul>
<li>All the API calls, which follow the logic of the app - registering the new user with right / wrong / existing data, login with right / wrong credentials, getting "admin" resourses with admin / normal user.</li>
<li>Full cycle of user actions including: navigation, registration of a new user, login, logout.</li>
</ul>
<h1></h1>
<h2>Frontend</h2>
<p>This is pretty standard React app with the following additional packages:</p>
<ul>
<li>Axios - all the API requests are organized using this npm package. In order to be more flexible in maintaining changes in API, hosting of the app, I decided to put networking and API settings, addresses to a separate folder and file. Even API routes are split and assembled into a final string gradually as it is needed in the app.</li>
<li>React-Redux - currently there are two main slices in the template: user data and app state. The idea is to have central storage for the current user data and to be able to get it from any part of the app. App state is used to organize navigation in the app. Standard React Router looked not convenient for the app strategy I decided to take and I places the name of the currently rendered component in Redux store. Now navigating to the other part of the app is very simple - it is necesary just to dispatch the name of the component to be navigated to.</li>
<li>MUI CSS styles, components and icons - I like their flexibility and integration with React. </li>
<li>React-cookie - so far only the following information is stored in the cookies website: whether user has confirmed that he knows taht this site uses cookies, user email (in case user chooses the option) to avoid entering it every time user visits site, JWT token after successful login</li>
<li>Axios mock adapter npm package - convenient package for mocking API calls.</li>
<li>Redux mock store npm package - to mock Redux store calls.</li>
</ul>
<h3>What is tested</h3>
<p>The testing is coded using native react testing library and small additional packages mentioned above. The following components are tested in the app:
<ul>
<li>Functions to check the correctness of the email, password, user family name</li>
<li>Navbar - test checks the availability of all the options on the screen and the correctness of the dispatch calls for the navigation purposes.</li>
<li>Login, Register components - test checks the availability of elements within component, the correctness of helper text depending on user input, the correctness of API calls and dispatch calls.</li>
</ul>

<h1></h1>
<p>The following features are under development right now:</p>
<ul>
    <li>Currently JWT tocken has a predefined lifetime and can be received / renewed only during login procedure. The intention is to update it automatically as long as browser window is opened. Another option is to renew it with any action user takes on a website. Necessary API is already implemented, frontend is yet to be updated.</li>
    <li>User profile component with the possibility to edit own data, delete own profile</li>
    <li>Admin panel admin to be able to see the list of al users, to delete users, to assign admin rights to other users.</li>
</ul>
<h1></h1>
<p>Here are some screenshots of the app:</p>
<img src="./screenshot1.png" width="300px"/>
<img src="./screenshot2.png" width="161px"/>