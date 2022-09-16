## 依赖包作用
commander：命令行接口的完整解决方案，设置一些node命令，如help、usage、version、parse输入的参数。
download-git-repo：git代码下载库，存到本地。
chalk: node终端样式库，可以修改console的输出颜色。
inquirer: 用户与命令行之间的交互问答工具。
ora：终端旋转器，
loading小圈圈。
rimraf：删除文件。


```js
const { program } = require('commander');

const handleCreate = (params, options) => {
  console.log(params, options);
};

program
  .command('create <name> [destination]')
  .description('create a project')
  .action((name, destination) => {
    handleCreate({ name, destination }, program.opts());
  });

program.option('-ig,--initgit', 'init git');

program.parse(process.argv);
```
.command()用于配置命令及参数，其中<>表示参数是必须的，[]表示参数是可选的;

.description()添加命令描述

.action()用于添加操作函数，入参就是配置命令时候的参数

program.parse(process.argv);处理命令行参数

