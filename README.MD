# hook server

### 用法

* 1、部署该项目到服务器
* 2、`npm run start`启动项目
* 3、在系统目录`/path/to/shell/directory/`目录下写hook需要run的bash代码,例`example.sh`
* 4、在需要hook服务的项目git仓库中配置hook server,地址为该服务器http://ip:9748/example
* 5、如果需要校验分支的话可以把分支写到path中,例:http://ip:9478/master/example

每次触发hook时会跑example.sh,具体的更新代码,重启逻辑写在example.sh中
