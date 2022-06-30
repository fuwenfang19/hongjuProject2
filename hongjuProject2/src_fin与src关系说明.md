- 初衷：
- 为了共享公共组件和公共样式
- src_fin 是财务web  src是公司管理员web
- src_fin下components/common/index 引用自 src的同名目录下的文件，
这样做带来的问题是webpack，babel编译路径需要支持src下的所有common引用到的js,
初衷是引用common的时候不需要应用src的，直接在src_fin下就可以；
暂时没有找到好的方式，所以用的比较笨拙的方法；
- src_fin index.js 中引用了src components/common/Loading
- src_fin index.css 中应用了src global/style/share.scss
- src_fin 和 src 没有公用global/utils
- 所有的fin相关的配置和文件带有_fin字样 如 paths_fin.js

导致的问题
0.项目维护上，财务端master和公司管理员master实际上是一个master,维护的时候需要注意！
并且没有经过深度测试，比如修改线上问题的时候，两个端的打包是否相互干扰，理论上来讲没有太大影响，
当然修改common组件、公共样式的时候，肯定是有影响的；假如修改公共组件，需要两端都进行测试！
1.components/common/index 增加的组件，需要在 src_fin下components/common/index 引用
公共组件的样式，同时也需要在两个目录下的index.scss中引用
2.修改webpack config时需要同时修改 _fin的config
3.修改公共样式，需要到src下修改share
4.项目用的package.json是同一个，可能导致lib库冗余

目前公共的部分
1.components/common
2.global/share

项目运行
1.公司管理员 yarn start / yarn build
2.财务人员   yarn start_fin / yarn build_fin
