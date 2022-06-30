/**
 * Created by fuwenfang on 2017/4/4.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'antd';
import Slider from 'react-slick';
let cover = undefined;
const createCover = {
  index:0,
  Carousel:{},
	userIntroduce(overCallBack,userIntro) {
    const that = this
    that.userIntro = userIntro
    that.overCallBack = overCallBack
		//背景遮罩
		createElement('cover');
    const cover = document.getElementById("cover");
    if(!this.isClickBind){
      if (window.addEventListener) {
        window.addEventListener('click', coverHandler,false);	
        this.isClickBind = true
      } else if (window.attachEvent) {
        window.attachEvent('onclick', coverHandler,false);
        this.isClickBind = true
      }
    }
		//document.body.appendChild(cover);

    //备注说明
    let coverRemark =  document.createElement("div");
    coverRemark.id = 'coverRemark'
    coverRemark.style.position = 'absolute';
		coverRemark.style.left = '50%';
		coverRemark.style.top = '50%';
		coverRemark.style.width = document.body.clientWidth+'px';
    coverRemark.style.height = (document.body.clientHeight)+'px';	
    coverRemark.style.marginLeft = (-document.body.clientWidth/2)+'px';
    coverRemark.style.marginTop = (-document.body.clientHeight/2)+'px';
    coverRemark.style.color = "#fff";
    coverRemark.style.zIndex = "10";
    document.body.appendChild(coverRemark);
    this.createCarousel(overCallBack,userIntro)
    this.Carousel = this.createCarousel(overCallBack,userIntro).refs.slider
    this.coverGuide(cover,userIntro[0]);
    // resize
    if (!this.isResizeBind) {
      if (window.addEventListener) {
        window.addEventListener('resize', windowResizeHandle,false);	
        this.isResizeBind = true;
      } else if (window.attachEvent) {
        window.attachEvent('onresize', windowResizeHandle,false);
        this.isResizeBind = true;
      }
    }
	},
  coverGuide(cover, userIntro) {
    if(userIntro.picUrl != ''){
      let coverElement = document.getElementById("cover");
      let coverPic = document.getElementById("coverPic");
      if(coverElement){
        coverElement.parentNode.removeChild(coverElement);
      } 
      if(coverPic){
        coverPic.parentNode.removeChild(coverPic);
      }
      createElement('coverPic')
      return 
    }
    let body = document.body, doc = document.documentElement;
    if (cover && userIntro) {
      // target size(width/height)
      let targetWidth = userIntro.element.clientWidth,
          targetHeight = userIntro.element.clientHeight;
      // page size
      let   pageHeight = doc.scrollHeight,
            pageWidth = doc.scrollWidth;
      // offset of target	
      let offsetTop = userIntro.element.getBoundingClientRect().top + (body.scrollTop || doc.scrollTop),
            offsetLeft = userIntro.element.getBoundingClientRect().left + (body.scrollLeft || doc.scrollLeft);
      
      // set size and border-width
      cover.style.width = targetWidth +40 + 'px';
      cover.style.height = targetHeight+40 + 'px';	
      cover.style.borderWidth = 
        (offsetTop -20) + 'px ' + 
        (pageWidth - targetWidth - offsetLeft-20) + 'px ' +
        (pageHeight - targetHeight - offsetTop-20) + 'px ' + 
        (offsetLeft-20) + 'px';
      
      cover.style.display = 'block';
      let arrowElement = document.getElementById("arrow");
      if(arrowElement){
		    arrowElement.parentNode.removeChild(arrowElement);
      }
      if(userIntro.arrow !== 0){
        let arrow = document.createElement("img");
        arrow.id = 'arrow';
        arrow.setAttribute('src',require('../../images/userIntroduce/arrow/arrow'+userIntro.arrow+'.png'));
        arrow.style.position = 'absolute';
        if(userIntro.arrow === 8){
          arrow.style.left = offsetLeft +targetWidth+20 + 'px ';
          arrow.style.top = offsetTop -40 + 'px';
        }else if(userIntro.arrow === 3 && userIntro.element.className === 'anticon anticon-plus-circle ant-dropdown-trigger'){
          arrow.style.left = offsetLeft - (targetWidth +40) + 'px ';
          arrow.style.top = offsetTop + targetHeight+20 + 'px';
        }else if(userIntro.arrow === 3){
          arrow.style.left = offsetLeft + 'px ';
          arrow.style.top = offsetTop + targetHeight+20 + 'px';
        }else if(userIntro.arrow === 2){
          arrow.style.left = offsetLeft + (targetWidth+40)/2 + 'px ';
          arrow.style.top = offsetTop + targetHeight+20 + 'px';
        }
        arrow.style.zIndex = '11'
        arrow.style.transition = 'all .3s';
        document.body.appendChild(arrow)
      }
    }
  },
  createCarousel(overCallBack,userIntro){
    const that = this
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      //fade:true,
      //afterChange:this.onChange,
    };
    const CarouselDiv = React.createClass({
        render:function(){
            return (
              <div style={{height:(document.body.clientHeight)}}>
                <Slider  {...settings} ref='slider'>
                  {userIntro.map((item,i)=>{
                      if(item.picUrl === ''){
                        if(i === userIntro.length-1){
                          return (<div key = {i}>
                            <div className='slick-slide-content'>
                              <div className='slick-slide-content-wrap'>
                                <div className={'userIntroTitle'+item.info.titlePic}></div>
                                <div className='userIntroRemark'>{item.info['remark']}</div>
                              </div>
                              <Button type='primary' onClick = {(e)=>{that.overIntroduce(e,overCallBack)}}>我知道了</Button>
                              </div>
                            </div>)
                        }else {
                          return (<div key = {i}>
                            <div className='slick-slide-content'>
                              <div className='slick-slide-content-wrap'>
                                <div className={'userIntroTitle'+item.info.titlePic}></div>
                                <div className='userIntroRemark'>{item.info['remark']}</div>
                              </div>
                              <Button type='primary' onClick = {(e)=>{that.goOnIntroduce(e,userIntro)}}>继续了解</Button>
                            </div>
                            </div>)
                        }
                      }else{
                        if(i === userIntro.length-1){
                          return (<div key = {i}>
                            <div className='slick-slide-content'>
                              <div className={item.picUrl}></div>
                              <Button type='primary' onClick = {(e)=>{that.overIntroduce(e,overCallBack)}}>我知道了</Button>
                              </div>
                            </div>)
                        }else {
                          return (<div key = {i}>
                            <div className='slick-slide-content'>
                              <div className={item.picUrl}></div>
                              <Button type='primary' onClick = {(e)=>{that.goOnIntroduce(e,userIntro)}}>继续了解</Button>
                            </div>
                            </div>)
                        }
                      }
                    })
                  }
              </Slider>
              <ul className='mock-slide-dots'>
                {
                  userIntro.map((item,i)=>{
                    return (
                      <li key = {i} className = {that.index === i?'current':''}
                        onClick = {(e)=>{that.clickDots(e,userIntro,i)}}></li>
                    )
                  })
                }
              </ul>
          </div>
            );
        }
    });
    /*ReactDOM.render 是 React 的最基本方法，用于将模板(html，jsx,React.createElement等)转为 HTML ，并插入指定的 DOM 节点。*/
    //ReactDOM.render(<CarouselDiv/>,document.getElementById('coverRemark'));
    return ReactDOM.render(<CarouselDiv/>,document.getElementById('coverRemark'))
  },
  goOnIntroduce(e,userIntro){
    e.stopPropagation()
    e.preventDefault()
    this.index++;
    if (!userIntro[this.index]) {
        this.index = 0;    
    }
    if(userIntro[this.index].picUrl!==''){
      //有图模式
      let coverElement = document.getElementById("cover");
      let arrowElement = document.getElementById("arrow");
      let coverPic = document.getElementById("coverPic");
      if(coverElement){
        coverElement.parentNode.removeChild(coverElement);
        arrowElement.parentNode.removeChild(arrowElement);
      }    
      //背景遮罩
      if(!coverPic){
        createElement('coverPic')
      }
    }else{
      let coverElement = document.getElementById("cover");
      let coverPic = document.getElementById("coverPic");
      if(!coverElement){
        createElement('cover')
        if(coverPic){
          coverPic.parentNode.removeChild(coverPic);
        }    
      }
      const cover = document.getElementById('cover')
      this.coverGuide(cover, userIntro[this.index]);
    }
    if(this.Carousel.slickGoTo){
        this.Carousel.slickGoTo(this.index)
      }
      const DotsUl = document.getElementsByClassName('mock-slide-dots')[0];
      const DotsLiArr = DotsUl.getElementsByTagName('li');
      for(let i = 0 ;i<DotsLiArr.length;i++){
        DotsLiArr[i].removeAttribute('class')
      }
      DotsLiArr[this.index].setAttribute("class", "current");   
  },
  clickDots(e,userIntro,item){
    e.stopPropagation()
    e.preventDefault()
    this.index = item;
    if(userIntro[this.index].picUrl!==''){
      //有图模式
      let coverElement = document.getElementById("cover");
      let arrowElement = document.getElementById("arrow");
      let coverPic = document.getElementById("coverPic");
      if(coverElement){
        coverElement.parentNode.removeChild(coverElement);
        arrowElement.parentNode.removeChild(arrowElement);
      }    
      if(!coverPic){
        createElement('coverPic')
      }
    }else{
      let coverElement = document.getElementById("cover");
      let coverPic = document.getElementById("coverPic");
      if(!coverElement){
        createElement('cover')
        if(coverPic){
          coverPic.parentNode.removeChild(coverPic);
        }    
      }
      const cover = document.getElementById('cover')
      this.coverGuide(cover, userIntro[this.index]);
    }
    if(this.Carousel.slickGoTo){
      this.Carousel.slickGoTo(this.index)
    }
    const DotsUl = document.getElementsByClassName('mock-slide-dots')[0];
    const DotsLiArr = DotsUl.getElementsByTagName('li');
    for(let i = 0 ;i<DotsLiArr.length;i++){
      DotsLiArr[i].removeAttribute('class')
    }
    DotsLiArr[item].setAttribute("class", "current"); 
  },
  overIntroduce(e,overCallBack){
	  e.stopPropagation()
    e.preventDefault()
    if (overCallBack) {
      overCallBack();
    }
    let coverElement = document.getElementById("cover");
		let coverRemarkElement = document.getElementById("coverRemark");
    let arrowElement = document.getElementById("arrow");
    let coverPic = document.getElementById("coverPic");
    if(coverElement){
		  coverElement.parentNode.removeChild(coverElement);
    }
    if(coverRemarkElement){
		  coverRemarkElement.parentNode.removeChild(coverRemarkElement);
    }
    if(arrowElement){
      arrowElement.parentNode.removeChild(arrowElement);
    }
    if(coverPic){
		  coverPic.parentNode.removeChild(coverPic);
    }
    if(window.addEventListener){
      window.removeEventListener('click', coverHandler,false);
      window.removeEventListener('resize', windowResizeHandle,false);
    }
    if(window.attachEvent){
      window.removeEvent('onclick', coverHandler,false)
      window.removeEvent('onresize', windowResizeHandle,false)
    }
    createCover.index = 0
    createCover.isClickBind = false
    createCover.isResizeBind = false
  }
}
const coverHandler = function(){
  const that = createCover
  that.index++;
  if (!that.userIntro[that.index]) {
      that.index = 0;    
  }
  if(that.userIntro[that.index].picUrl!==''){
    //有图模式
    let coverElement = document.getElementById("cover");
    let arrowElement = document.getElementById("arrow");
    let coverPic = document.getElementById("coverPic");
    if(coverElement){
      coverElement.parentNode.removeChild(coverElement);
      arrowElement.parentNode.removeChild(arrowElement);
    }
    //背景遮罩
    if(!coverPic){
		  createElement('coverPic')
    }
    that.Carousel = that.createCarousel(that.overCallBack,that.userIntro).refs.slider
    that.Carousel.slickGoTo(that.index)
    return
  }
  let coverElement = document.getElementById("cover");
  if(!coverElement){
    createElement('cover')
    let coverPic = document.getElementById("coverPic");
    if(coverPic){
      coverPic.parentNode.removeChild(coverPic);
    }    
  }
  let cover = document.getElementById("cover");
  console.log(coverElement)
  that.coverGuide(cover, that.userIntro[that.index]);
  that.Carousel = that.createCarousel(that.overCallBack,that.userIntro).refs.slider
  that.Carousel.slickGoTo(that.index)
}
const windowResizeHandle = function(){
    const that = createCover
    that.coverGuide(that.cover, that.userIntro[that.index]);
}
function createElement(id){
    let cover = document.createElement("div");
		cover.id = id;
		cover.style.position = 'absolute';
		cover.style.left = '0';
		cover.style.top = '0';
		cover.style.right = '0';
		cover.style.bottom = '0';
    if(id == 'cover'){
      cover.style.width = '0';
      cover.style.height = '0';
      cover.style.display = 'none';
    }else{
      cover.style.width = '100%';
      cover.style.height = '100%';
      cover.style.background='#000'
    }
    cover.style.border = '0 solid #000';
		cover.style.zIndex = "9";
		cover.style.opacity = ".85";
		cover.style.filter = "alpha(opacity=85)";
    /* 过渡效果 */
    cover.style.transition = 'all .25s';
    /* 边缘闪动问题fix */
    cover.style.boxShadow =  '0 0 0 100px #000';
    cover.style.overflow = 'hidden';
    cover.style.boxSizing = 'content-box';
    document.body.appendChild(cover);
}
export default createCover;





