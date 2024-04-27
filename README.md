# Choco Logging
Provides a way to store and customize globally errors and loggs from different projects/apps via REST http api.
# The Goal
This project was created for pure fun and with one purpose -> learning. Nothing too serious, nothing too complex...

## Langs/Tech being used: 
- Typescript, SQL, Javascript, HTML, CSS
- EJS (implementation mimicking a SPA almost), Faker JS (for dev only)

## How to run the project
   * Core Dependencies -> mysqlDb( you could re-write the quries for your own db), Node js, Typescript, ts-node(atm im not running anything thats comiplied js)
   * Make sure you have the above installed on your machine, then run/import the file inside the @/src/database/migrations/choco-logging.sql which holds the db model/tables.
   * Do not forget to run npm install and fill up the ENVs in the provided .env.example.
   * Logging service "npm run logger" -> this will start an express REST http server on port 8812 (edit @/src/logger.ts if you want a different port)
   * Admin UI "npm run dashboard" -> starts the UI admin-dashboard on port 8811 (edit @/src/server.ts if you want a different port)
   * Create an user using an Insert statement providing an username/password. (Atm I don't care about not hashing the passwords you can do it yourself if you want to). I might add, in the near future, a default user to be inserted when you run the migration sql.
   * Theres a faker script that generates loggs so you can review them in the admin dashboard before hooking up any real app to it "generate-faker-errors" -> this would require you to have at least one project/app already created and editing the @/src/utils/faker-errs.ts file with the db ID of it.

# TO DO LIST:
1. [X] - Simple JWT Logging/auth for the ui and logger(requires api keys that are loaded durring logger service startup).

2. [ ] - UI/DESIGN:
    * [X] - Basic Admin UI for crud ops on the projects/loggs/errors with really simple styling + Light/dark mode.
    * [X] - Usage of EJS templates.
    * [ ] - Pagination, filtering, searching for the Errors/loggs.
    * [ ] - Improve UI styling and design since its pure sh*t at the moment.
    
3. [ ] - Documentation:
    * [X] - Pin point and create a readme md for github.
    * [ ] - Create integration docs of the logger and oveall app usage inside the Admin UI.

4. [ ] - Statistics:
    * [ ] - Implement logger/server logic for gathering project/app metrics.
