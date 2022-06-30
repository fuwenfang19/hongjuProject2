/**
 * Created by uncle on 2017/2/27.
 * 是否前后端分离开发
 * true 用的是测试环境
 * false 用的是本地环境
 * 当false的时候 '/api' 的target对应的是本地的管理端地址，
 * 要重点注意端口号 yourOwnManagePort
 */
module.exports = {
	local_or_remote: false,
	yourOwnManagePort: '8000'
};

