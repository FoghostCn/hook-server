# hook server

### how to use

* 1、deploy the project
* 2、`npm run start` start server
* 3、write the code hook will run, for example `hook.sh`: `git pull; pm2 restart app etc.`
* 4、add a webhook service in you project repo, like http://ip:9748/example
* 5、if you want to run hook with a specific branch, write the branch name in path, for example :http://ip:9478/master/example

when hook fired the bash file `example.sh` will run
