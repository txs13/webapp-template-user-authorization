<h1>Backend webapp template description</h1>
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