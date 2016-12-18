## Scripts

- Docker build - Ran during the Acceptance stage. Builds docker image with latest git commit hash as tag.

- Docker compose - Used whenever docker-compose up is ran. Settings file for which images to run. Tells the images what ports to listen to and othet settings.

- buildscript.sh - Ran during commit stage. Cleans up old files no longer needed. Runs npm install for client/server, builds the program, runs unit tests and copies required files to the build directory.

- copytoaws.sh - copies neccessary files from jenkins to aws ec2-instance, docker-compose.yaml and .env, needed for the git hash

- Dockerfile - settings for docker such as workdir inside container, npm install and the port used.

## Testing & logic

Outline what tests you created.

- UnitTests, server logic TDD -Yes, see git commit history dec 14-15

- API Acceptance test - fluent API - Yes

- Load test loop - Yes

- UI TDD - No

- Is the game playable? - No


## Data migration

Did you create a data migration. - Yes

- Migration up and down - Yes


## Jenkins

Do you have the following Jobs and what happens in each Job:

- Commit Stage - Yes, buildscript ran. Necessary files copied to build folder, unit tests ran.

- Acceptance Stage - Triggered by commit stage, docker-compose up on jenkins instance, apitests ran.

- CapacityStage - Triggered by AcceptanceStage, run loadtests and stop docker-compose after.

- Deployment stage - Triggered by CapacityStage, files copied to aws ec2-instance and program deployed


Did you use any of the following features in Jenkins?

- Schedule or commit hooks - Yes,Commit hooks.

- Pipeline -- No

- Jenkins file - No

- Test reports - Yes, unit test results published post commit stage. Viewable inside jenkins manager.

## Monitoring

Did you do any monitoring?

I set up datadog with very little customization, can see data from my jenkins instance as well as some metrics on my personal virtual machine.

## Other

Anything else you did to improve you deployment pipeline of the project itself?
