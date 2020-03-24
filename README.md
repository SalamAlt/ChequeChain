# cryptochainProject

## Production Code for Heroku

Version --> productionCode is the code that is used on Heroku, the only time we push to this branch is when code that works locally is _**ready to be pushed to production; make sure that you do a pull request!!**_ 

The package.json file and .gitignore **cannot be changed** otherwise the push to heroku wont work. Essentially trying to deploy code to be built by Heroku on run time causes all sorts of errors so to mitigate you have to manually run npm i (local directory) and build the dist folder (by running npm run build-client) and push those folders manually. To push manually you have to adjust the .gitignore - I had to remove all instances of dist and node_modules which will allow a succesful push to Heroku.

package.json 
index.js 
.gitignore  
pubsub 
