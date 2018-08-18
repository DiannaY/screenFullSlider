var ppt = {
    $slider : $('.slider'),
    len : $('.slider').length,
    lastIndex : null,
    curIndex : null,
    key : true,
    timer : undefined,
    init : function () {
        if (this.len > 1) { // 当ppt的页数大于1的时候，才会进行轮播。
            this.addDom();// 根据ppt的页数来添加相应数量的小圆点到页面上
            this.bindEvent(); //绑定事件。
            this.sliderAuto();
        }  
    },
    addDom : function () {
        var orderStr = '';
        for (var i = 0 ;i < this.len;i ++) {
            orderStr +=  '<li>' + i + '</li>'
        }
        $('ul').append(orderStr);
        $('li:eq(0)').addClass('active');
        // var btnStr = '<div class="prev_btn"></div>\
        //               <div class="next_btn"></div>';
        // $('.btn').append(btnStr);
    },
    bindEvent : function () {
    //给前后按钮和小圆点添加点击事件
        var _this = this;
        $('li').add($('.prev_btn')).add($('.next_btn')).on('click',function () {
        //判断点击的是前按钮还是后按钮或者小圆点，然后调用运动函数，并传相应的方向。
            if ($(this).attr('class') == 'prev_btn') {
                _this.tool('prev');
            }else if ($(this).attr('class') == 'next_btn') {
                _this.tool('next');
            }else {
                //如果是点击小圆点的话，获取它的下标，调用运动函数，传下标。
                var index = $(this).index();
                _this.tool(index);
            }
        });
        // 为每一页ppt内容绑定out事件和in事件。
        // out事件的处理函数的功能是实现当页ppt淡出，并且里边的图片是以运动animate的方式，宽度逐渐减小。
        // in事件的处理函数的功能是1)实现某页ppt淡入，并且里边的图片延迟运动并且是以运动animate的方式，宽度逐渐增大到40%。
        //                       2)当某页ppt淡入结束之后，再回调函数调用ppt自动播放的功能（sliderAuto）
        this.$slider.on('out',function () {
            $(this).fadeOut(400).find($('img')).animate({width : "0%"},400,'linear').end().find($('.cont p')).animate({fontSize : 10},400,'linear');
        })
        this.$slider.on('in',function () {
            $(this).fadeIn(400).find($('img')).delay(400).animate({width : '40%'},400,'linear',function () {
                _this.key = true;
                _this.sliderAuto();
            }).end().find($('.cont p')).animate({fontSize : 16},400,'linear');
        })
    },
    tool : function (text) {
        if (this.key) { 
            //根据传过来的文本（'prev'/ 'next' / index），获取到当前页的下标作为上一个展示页的下标，以便进行下页的展示。
            this.getIndex(text);
            if (this.lastIndex != this.curIndex) {
            // 如果即将要展示页的下标不等于上一展示页的下标。
                this.key = false;
                this.changeClass(this.curIndex);//改变当前页对应的小圆点的状态。
                // 上一个展示页实现淡出。即将要展示的页实现淡入。
                this.$slider.eq(this.lastIndex).trigger('out');
                this.$slider.eq(this.curIndex).delay(400).trigger('in');
            }
        }
    }, 
    getIndex : function (text) {
        this.lastIndex = $('.active').index();//获取当前展示页的下标作为上一展示页的下标，以便计算下页展示的下标。
         //获取即将要展示页的下标
        if (text == 'prev') {
            this.curIndex = this.lastIndex == 0 ? this.len - 1 : this.lastIndex - 1;
        }else if (text == 'next') {
            this.curIndex = this.lastIndex == this.len - 1 ? 0 : this.lastIndex + 1;
        }else {
            this.curIndex = text;
        }
    },
    //改变小圆点的class类名：
    // 将上一展示页特殊的class类名取消，并给当前展示页对应的小圆点添加特殊的class类名，
    changeClass : function (num) {
        $('.active').removeClass();
        $('li:eq(' + num + ')').addClass('active');
    },
    sliderAuto : function () {//自动播放ppt，
        clearTimeout(this.timer);
        var _this = this;
        this.timer = setTimeout(function () {
            _this.tool('next');
        },4000)
    }
}
ppt.init();


