## Scripts

Outline what script files you created and the purpose of each file. Each file should be commented. This could be

- Docker build - Ran during the Acceptance stage. Builds docker image with latest git commit hash as tag.

- Docker compose - Used whenever docker-compose up is ran. Settings file for which images to run. Tells the images what ports to listen to and othet settings.

- buildscript.sh - Ran during commit satge. Cleans up old files no longer needed. Runs npm install for client/server, builds the program, runs unit tests and copies required files to the build directory.


## Testing & logic

Outline what tests you created.

- UnitTests, server logic TDD (Git commit log)

- API Acceptance test - fluent API

- Load test loop

- UI TDD

- Is the game playable?


## Data migration

Did you create a data migration.

- Migration up and down


## Jenkins

Do you have the following Jobs and what happens in each Job:

- Commit Stage

- Acceptance Stage

- Capacity Stage

- Other


Did you use any of the following features in Jenkins?

- Schedule or commit hooks

- Pipeline

- Jenkins file

- Test reports

- Other


## Monitoring

Did you do any monitoring?

- URL to monitoring tool. Must be open or include username and pass.


## Other

Anything else you did to improve you deployment pipeline of the project itself?
