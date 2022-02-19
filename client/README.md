<h1>Frontend webapp template description</h1>
<p>This is pretty standard React app with the following additional packages:</p>
<ul>
<li>Axios - all the API requests are organized using this npm package. In order to be more flexible in maintaining changes in API, hosting of the app, I decided to put networking and API settings, addresses to a separate folder and file. Even API routes are split and assembled into a final string gradually as it is needed in the app.</li>
<li>React-Redux - currently there are two main slices in the template: user data and app state. The idea is to have central storage for the current user data and to be able to get it from any part of the app. App state is used to organize navigation in the app. Standard React Router looked not convenient for the app strategy I decided to take and I places the name of the currently rendered component in Redux store. Now navigating to the other part of the app is very simple - it is necesary just to dispatch the name of the component to be navigated to.</li>
<li>MUI CSS styles, components and icons - I like their flexibility and integration with React. </li>
<li>React-cookie - so far only the following information is stored in the cookies website: whether user has confirmed that he knows taht this site uses cookies, user email (in case user chooses the option) to avoid entering it every time user visits site, JWT token after successful login</li>
<li>Axios mock adapter npm package - convenient package for mocking API calls.</li>
<li>Redux mock store npm package - to mock Redux store calls.</li>
</ul>
<h1></h1>
<h3>What is tested</h3>
<p>The testing is coded using native react testing library and small additional packages mentioned above. The following components are tested in the app:
<ul>
<li>Functions to check the correctness of the email, password, user family name</li>
<li>Navbar - test checks the availability of all the options on the screen and the correctness of the dispatch calls for the navigation purposes.</li>
<li>Login, Register components - test checks the availability of elements within component, the correctness of helper text depending on user input, the correctness of API calls and dispatch calls.</li>
</ul>