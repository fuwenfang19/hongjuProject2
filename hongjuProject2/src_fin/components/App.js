import React, {Component} from 'react'
import {connect} from 'react-redux';
// import {Link} from 'react-router'
import {
	doLogin,
	getCookieUserInfo,
	changeClientHeight,
	showProblem,
	hideProblem,
	putProblem,
	changeProblem,
	changeLeftMenuSelected
} from '../actions';
import {homePageReducer} from '../reducers';
import {Layout, Menu, Icon, Tooltip, Input, Button} from 'antd';
import hongjulogo from '../images/app/company.ico';
import {hashHistory} from 'react-router';
import departmenticon from '../images/app/department.png';
import count from '../images/app/count.png';
import persionlogo from '../images/app/logo-sm.png';
const SubMenu = Menu.SubMenu;
const {Header, Sider, Content} = Layout;
const isDev = process.env.NODE_ENV === 'development';
const isRemote = process.env.frontendWithoutBackend.local_or_remote;
import NetWork from '../global/utils/network';
const oldUrl = '/organization/dataimport/';
const menuList = [
	{hashKey: 'budgetUnapproved', iconType: 'home', text: '待审批', children: []},
    {hashKey: 'budgetApproved', iconType: 'home', text: '已审批', children: []},

	{
		hashKey: '', iconType: 'bars', text: '我的申请',
		children: [
			{hashKey: 'budget_application', iconType: '', text: '预算申请'},
			{hashKey: 'budget_application_detail', iconType: '', text: '[T]预算申请详情'},
			{hashKey: 'budget_application_edit', iconType: '', text: '[T]预算申请编辑'},
			{hashKey: 'budget_adjust_application', iconType: '', text: '预算调整申请'},
			{hashKey: 'detailTEST', iconType: '', text: '详情test'},
		]
	},

	{hashKey: 'test', iconType: 'home', text: '测试表格', children: []},
];
let remoteLogo = undefined;
class App extends Component {

	constructor() {
		super();
		this.state = {
			current: 'department',
			openKeys: [],
			collapsed: false,
			currentMenuItem: undefined,
			userName: ''
		};
		this.toggle = this.toggle.bind(this);
		this.doLogin = this.doLogin.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}

	componentWillMount() {
		// 前后端分离的时候执行登录
		if (isDev && isRemote) {
			this.doLogin();//开发环境下才执行模拟登录
		} else {//直接执行获取cookie
			this.props.dispatch(getCookieUserInfo());
		}
		if (!isDev) {
			//如果在本地环境访问sso的图片，因为本地sso的域也是127.0.0.1 因为 sso 和 manage的sessionid是不同的，
			//所以访问sso/currentuserlogo/ 用的是manage的sessionid sso无法识别，返回403，并且将127的域的sessionid清空，
			//从而导入manage的接口也无法访问
			//解法1：本地sso起成其他域名，如你的内网ip
			//解法2：本地环境不请求sso
			const url = '/organization/getssourl/';
			NetWork.get(url, (responds) => {
				const remoteLogoUrl = `${responds.replace('/sso/loginpage/', '')}/sso/currentuserlogo/`;
				if (remoteLogoUrl.indexOf('127.0.0.1') === -1) {//本地环境不请求
					let logoTest = new Image();
					logoTest.onerror = () => {

					};
					logoTest.onload = () => {
						remoteLogo = remoteLogoUrl;
					};
					logoTest.src = remoteLogoUrl;
				}
			})
		}

		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	}

	componentDidMount() {

	}

	handleResize() {
		this.props.dispatch(changeClientHeight(document.body.clientHeight, document.body.clientWidth));
	}

	doLogin = () => {
		this.props.dispatch(doLogin());
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		}, () => {
			this.handleResize();
		});
	};

	handleClick = (e) => {
		try {
			hashHistory.push(e.key);//路由跳转
			this.props.dispatch(changeLeftMenuSelected(e.key))
		} catch (e) {

		}
	};

	onOpenChange = (openKeys) => {
		const state = this.state;
		const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
		const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

		let nextOpenKeys = [];
		if (latestOpenKey) {
			nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
		}
		if (latestCloseKey) {
			nextOpenKeys = this.getAncestorKeys(latestCloseKey);
		}
		this.setState({openKeys: nextOpenKeys});
	};

	getAncestorKeys = (key) => {
		const map = {
			sub3: ['sub2'],
		};
		return map[key] || [];
	};
	//点击show问题反馈
	showProblem = () => {
		this.props.dispatch(showProblem())
	}
	//点击hide问题反馈
	hideProblem = () => {
		this.props.dispatch(hideProblem())
	}
	//修改input的值
	changeInput = (e) => {
		this.setState({userName: e.target.value});
	}
	//点击发送问题
	clickProblem = () => {
		//console.log(this.state.userName, 3333333333)
		this.props.dispatch(putProblem(this.state.userName))
		this.props.dispatch(hideProblem())
	}

	render() {
		const baseState = this.props.$$baseState.toJS();
		const {userInfo, clientHeight, show, problem, current} = baseState;
		let isComplete;
		if (userInfo) {
			isComplete = userInfo.isComplete
		}
		let headerZIndex = 1;
		let leftZIndex = 2;

		let headerHeight = 48;
		let contentMargin = 16;
		let contentMinHeight = clientHeight - headerHeight - contentMargin;
		let leftCollapsedWidth = 64;

		let noHeaderOffsetTop = 10;//不显示头部时候的距离顶部的距离

		let leftNotCollapsedWidth = 180;
		let menuConfig = {
			onClick: this.handleClick,
			openKeys: this.state.openKeys,
			onOpenChange: this.onOpenChange,
			style: {
				position: 'absolute',
				height: clientHeight - headerHeight + 'px',
				width: '100%',
			},
			mode: this.state.collapsed ? 'vertical' : 'inline',
			selectedKeys: [current]
		};

		if (this.state.collapsed) {
			delete menuConfig.openKeys;
			delete menuConfig.onOpenChange;
		}
		// sou 是 是否不在首页 的标识（不知道云飞是如何设计的...）
		// isComplete 公司是否完善信息
		// 上边的是不显示左侧菜单
		return (
			<Layout className="hj-menu">
				<div>
					<Sider
						trigger={null}
						collapsible={true}
						collapsed={this.state.collapsed}
						className={this.state.collapsed ? 'side-bar-visible' : 'side-bar-auto'}
						style={{
							zIndex: leftZIndex,
							position: 'fixed',
							left: 0,
							top: headerHeight + 'px',
							bottom: 0,
							width: this.state.collapsed ? leftCollapsedWidth + 'px' : leftNotCollapsedWidth + 'px'
						}}
					>
						{/*vertical inline horizontal*/}

						<Menu {...menuConfig}>
							{menuList.map((item, i) => {
								if (item.children.length === 0) {
									if (item.iconType == '') {
										return (
											<Menu.Item key={item.hashKey}>
												<img src={item.src} alt="" style={{
													width: '12px',
													height: '12px',
													marginRight: '10px',
													marginBottom: '2px'
												}}/>
												<span className="nav-text">{item.text}</span>
											</Menu.Item>
										)
									} else {
										return (
											<Menu.Item key={item.hashKey}>
												<Icon type={item.iconType}/>
												<span className="nav-text">{item.text}</span>
											</Menu.Item>
										)
									}
								} else {
									if (item.iconType == '') {
										return (
											<SubMenu key={i}
											         title={
												         <span>
																			 {/*<Icon type={item.iconType}/>*/}
													         <img src={item.src} alt="" style={{
														         width: '12px',
														         height: '12px',
														         marginRight: '8px',
														         marginBottom: '2px'
													         }}/>
																			 <span>{item.text}</span>
																		</span>
											         }
											>
												{item.children.map((subItem) => {
													return (
														<Menu.Item key={subItem.hashKey}>
															<span className="link-name">{subItem.text}</span>
														</Menu.Item>
													)
												})}
											</SubMenu>
										)
									} else {
										return (
											<SubMenu key={i}
											         title={
												         <span>
																			<Icon type={item.iconType}/><span>{item.text}</span>
																		</span>
											         }
											>
												{item.children.map((subItem) => {
													return (
														<Menu.Item key={subItem.hashKey}>
															<span className="link-name">{subItem.text}</span>
														</Menu.Item>
													)
												})}
											</SubMenu>
										)
									}
									count(1).png
								}
							})}
						</Menu>
					</Sider>
					<Layout>
						<Header style={{
							background: '#fff',
							padding: 0,
							height: headerHeight + 'px',
							lineHeight: headerHeight + 'px',
							position: 'fixed',
							top: 0,
							width: '100%',
							zIndex: headerZIndex,
							paddingLeft: this.state.collapsed ? leftCollapsedWidth + contentMargin + 'px' : leftNotCollapsedWidth + contentMargin + 'px',
						}}>
							<div className="header-container">

								<div className="logo"
								     style={{
									     height: headerHeight,
									     position: 'fixed',
									     top: 0,
									     left: 0,
									     zIndex: 10,
									     width: this.state.collapsed ? leftCollapsedWidth + 'px' : leftNotCollapsedWidth + 'px',
									     transform: 'translate3d(0, 0, 0)'
								     }}>
									<Icon className="trigger"
									      style={{lineHeight: headerHeight + 'px',}}
									      type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
									      onClick={this.toggle}
									/>
									<span className="logo-title">红橘微财务</span>
								</div>


								{/*<div className="header-btn-container">*/}
								{/*<img src={hongjulogo} alt="logo"/>*/}
								{/*</div>*/}

								<span
									className="user-info-label">{userInfo && userInfo.companyname || ''}</span>

								<Menu mode="horizontal" defaultSelectedKeys={['1']}
								      style={{margin: 'auto', display: 'inline-block'}}>
									<Menu.Item key="1">日常业务</Menu.Item>
								</Menu>

								<div className="header-btn-container">
									<a href={oldUrl} className="back-to-old">返回旧版</a>
								</div>


								<div className="header-btn-container">
									<Icon type="question-circle-o" onClick={this.showProblem}/>
								</div>
								{/*<div className="header-btn-container">*/}
								{/*<Icon type="message"/>*/}
								{/*</div>*/}
								<div className="header-btn-container" onClick={() => {
									window.location.href = userInfo.sso_url + '/sso/loginpage/';
								}}>
									<Tooltip title="退出">
										<Icon type="logout"/>
									</Tooltip>
								</div>

								<div className="user-logo-name">
									<img src={remoteLogo ? remoteLogo : persionlogo} alt="" style={{
										width: '20px',
										height: '20px',
										borderRadius: '20px',
										marginRight: '5px',
										marginBottom: '2px'
									}}/>
									<span className="user-info-label">{userInfo && userInfo.name || ''}</span>
								</div>
							</div>

						</Header>
						{
							show === true ? <div className="problemPage">
								<div className="problemPage-title">帮助—问题反馈<Icon type="close"
								                                                className="problemPage-close"
								                                                onClick={this.hideProblem}/>
								</div>
								<div className="problemPage-head">给微财务反馈问题或提出建议</div>
								<Input type="textarea" className="problemPage-text" value={this.state.userName}
								       onChange={this.changeInput}/>
								<Button className="problemPage-ok" onClick={this.clickProblem}>发送</Button>
								<div className="problemPage-help">
									{/*<Icon></Icon>*/}
									{/*<a href="#">帮助中心</a>*/}
								</div>
							</div> : ''
						}
						<Content style={{
							marginTop: headerHeight + contentMargin + 'px',
							marginRight: contentMargin + 'px',
							marginBottom: 0 + 'px',
							marginLeft: this.state.collapsed ? leftCollapsedWidth + contentMargin + 'px' : leftNotCollapsedWidth + contentMargin + 'px',
							height: contentMinHeight,
							overFlow: 'hidden',
							position: 'relative',
						}}>
							{baseState.userInfo ? this.props.children : null}
						</Content>
					</Layout>
				</div>
			</Layout>
		);
	}
}

function mapStateToProps(state) {
	return {
		$$baseState: state.get('baseState'),
	}
}

export default connect(mapStateToProps)(App);
