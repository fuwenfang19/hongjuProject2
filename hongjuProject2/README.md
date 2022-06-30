0.0 项目运行 
```

0.检出项目 基础环境 nodejs6~7,npm
1.使用yarn包管理工具 安装： $ npm install yarn -g
2.初次安装所有依赖： $ yarn
3.安装新包： $ yarn add pakagename --save
antd 版本有问题 所以再执行以下 yarn add antd#2.9.3
如果依然存在问题 那么执行npm install antd

4.运行开发环境 $ yarn start 
财务web是 yarn start_fin
5.打包： $ yarn build
财务web是 yarn build_fin
打包之后，将生成的web文件夹替换到管理端（manage）的static下的web，然后提交,push代码，更新测试环境静态文件即可；
！！！！注意：提交代码的时候只提交static目录下，不要提交setting文件以及其他的文件，避免对后台造成影响！
！！！！不要使用"git add ." 要指定文件夹！
更新测试环境静态文件：
ssh super@192.168.100.153
密码 ufsoft*123
进入后，执行
sudo su
再次输入密码
然后进入到更新静态文件脚本目录
cd /srv/scripts/update_static_files
如果管理端分支是dev 那么执行
./test_manage_static.sh
执行
./newwebtest_manage_static.sh
等待运行完成即可


-所有项目平时按理来说都在dev分支开发，时刻注意不要随意push代码到master
-开发工具中，pull的时候，update type 设置成 merge
```


0.1 目录结构说明
```
build        -打包后目录 提交到生成环境的文件
config       -webpack配置
node_modules -npm包
public       -静态目录 目前只放了index.html和icon
scripts      -node运行脚本
src
    actions       -redux actions
    components    -容器和组件 common下index为入口
    constants     -常量定义
    global        -全局设置 包括共享样式，工具类
    images        -图片
    reducers      -redux reducers
    store         -redux store
    templates     -模板界面
    index.js      -react应用入口
    index.scss    -样式入口
    RootRouter.js -react router

```
0.2 调试工具 谷歌插件
```
- React
- Redux

```
 

```
前后端分离方案要点
1.components/App.js componentDidMount方法里this.doLonin()
2.修改代理
已经实现自动化切换
自动化说明：
目前区分了环境，如果是dev环境，则执行登录操作；
增加了是否是前后端分离的参数：
config/local_or_remote.js中
如果是true 那么访问的是测试环境（https://test.wecaiwu.com）
如果是false 访问本地环境 本地需要搭建sso和管理端后台(管理端端口需要启动成8000，sso随意，交易端暂时不需要)
本地环境的管理端分支是  2017_newweb  执行本地登录后，可正常使用yarn start的web项目
```

1.待完善：
- 生成环境进行js,css抽离（webpack CommonsChunkPlugin）
- actions目录是否应该存在？将actions写在reducer里是否更容易编码


2.编码规范
- 文件头写好注释，包括author，以及该文件的作用
- 方法头写好注释，写明方法实现的主要功能
- actions下index为统一入口
- components下common中index为统一入口，公共组件引入到index中，其他模块可import {c1,c2} from 'components/common' 引入
- scss文件和组件同目录，在样式入口文件index.scss中引入其他所有模块scss文件，在组件中无需引入
- 常量定义写在constants下，比如标识字段，跟后台对应的常量定义等
- 图片，icon放到images下，可根据业务模块创建对应目录
- reducers全部使用immutable写法，index为统一入口
- 类名（组件）和文件名完全一致,类名大写
- js,html,css的tab和缩进设置成2（webstorm配置）
- 编写c3时不必追加前缀，webpack中autoprefixer会自动追加
- 全局的设置，样式，工具写在global下
- fetch请求统一使用global/utils/network.js，接口写在global/utils/api.js中

3.参考
- 关于项目中引入immutable.js
https://segmentfault.com/a/1190000003910357
- immutable.js docs
http://facebook.github.io/immutable-js/docs
- 使用redux-immutablejs提供store的immutable支持
https://github.com/indexiatech/redux-immutablejs
- 引入immutable的变化（全局store都是immutable的）
a. reducer中使用immutable语法
b. 容器(组件)中map到props的时候，也就是connect的参数，需要使用immutable语法


4.组件库antd  https://ant.design/docs/react/introduce-cn
已经实现的公共组件
- 档案树
- 提示框
- 确认框
- 档案选择控件
- 下拉菜单
- 无信息导入

5.已经实现的公共样式
- 公共菜单
- content的左右结构（左侧固定，右侧自适应）
- content自适应
- 右侧头部（名称 + 按钮 左右布局）
- 按钮样式

6.特别注意
-复制粘贴代码的时候，特别要注意actionCreator的名字 是不能重复的，需要重新命名。
 也就是 xxxActions.js  文件里的function的名字
 
```
样式规则：在_share.scss中声明的样式
1.页面根节点 className 要有page  然后可以再来个业务名字-page
2.左右布局的话写法如下
<div className="page project-page">
				<div className="content-left">	</div>
				<div className="content-right">	</div>
</div>
只有1个区域的话 去掉content-left即可
<div className="page project-page">				
	<div className="content-right">	</div>
</div>

参见 template下的page.js

实现的是 左侧固定宽度 右侧自适应宽度
并且高度撑满屏幕 滚动条自动

3.按钮  @include hongju-btn('success') 参数是按钮类型

```

```
每个界面要有自己的样式根节点
但是根节点下不要嵌套太深  用名字的深度来替代scss的嵌套深度
不然要修改样式的时候很难修改
```


```
附录1
npm vs yarn
NPM	                        YARN	                说明
npm init	                yarn init	            初始化某个项目
npm install/link	        yarn install/link	    默认的安装依赖操作
npm install taco —save	    yarn add taco	        安装某个依赖，并且默认保存到package.
npm uninstall taco —save	yarn remove taco	    移除某个依赖项目
npm install taco —save-dev	yarn add taco —dev	    安装某个开发时依赖项目
npm update taco —save	    yarn upgrade taco	    更新某个依赖项目
npm install taco --global	yarn global add taco	安装某个全局依赖项目
npm publish/login/logout	yarn publish/login/logout	发布/登录/登出，一系列NPM Registry操作
npm run/test	            yarn run/test	        运行某个命令

```

```
附录2
Immutable.js 常见API
Nested Structures
The collections in immutable are intended to be nested, allowing for deep trees of data, similar to JSON.
var nested = Immutable.fromJS({a:{b:{c:[3,4,5]}}});
// Map { a: Map { b: Map { c: List [ 3, 4, 5 ] } } }
A few power-tools allow for reading and operating on nested data. The most useful are mergeDeep, getIn, setIn, and updateIn, found on List, Map and OrderedMap.

var nested2 = nested.mergeDeep({a:{b:{d:6}}});
// Map { a: Map { b: Map { c: List [ 3, 4, 5 ], d: 6 } } }

nested2.getIn(['a', 'b', 'd']); // 6

var nested3 = nested2.updateIn(['a', 'b', 'd'], value => value + 1);
// Map { a: Map { b: Map { c: List [ 3, 4, 5 ], d: 7 } } }

var nested4 = nested3.updateIn(['a', 'b', 'c'], list => list.push(6));
// Map { a: Map { b: Map { c: List [ 3, 4, 5, 6 ], d: 7 } } }

```

