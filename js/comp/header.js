Vue.component('my-head', {
  template:`
	<nav class="clearfix">
			<div class="time fl">
				<span>{{date}}</span>
				<span>{{day}}</span>
				<!-- <span>{{nongli}}</span> -->
			</div>
			<div class="system fr">
				<a @click="back()"></a>
				<a @click="forward()"></a>
				<a @click="refresh()"></a>
				<a @click="fullscreen()"></a>
			</div>
		</nav>
  `,
  data:function(){
  return {
  	date: "",
    day: "",
    full:false
  }},
  created: function() {
        window.setInterval(this.getDate, 1000);
  },
  methods:{
  	getDate: function() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
                " " + date.getHours() + seperator2 + date.getMinutes() +
                seperator2 + date.getSeconds();
            this.date = currentdate;
            var day = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
            this.day = day[date.getDay()];
        },
        back: function() {
            window.history.back();
        },
        forward: function() {
            window.history.go(1);
        },
        refresh: function() {
            this.getWeather();
        },
        fullscreen: function() {
            if (!this.full) {
                var docElm = document.documentElement;

                //W3C 

                if (docElm.requestFullscreen) {

                    docElm.requestFullscreen();

                }

                //FireFox 
                else if (docElm.mozRequestFullScreen) {

                    docElm.mozRequestFullScreen();

                }

                //Chrome等 
                else if (docElm.webkitRequestFullScreen) {

                    docElm.webkitRequestFullScreen();

                }

                //IE11
                else if (elem.msRequestFullscreen) {

                    elem.msRequestFullscreen();

                }
                this.full=true;
            }
            else{
                if (document.exitFullscreen) { 
                document.exitFullscreen(); 
                } 
                else if (document.mozCancelFullScreen) { 
                document.mozCancelFullScreen(); 
                } 
                else if (document.webkitCancelFullScreen) { 
                document.webkitCancelFullScreen(); 
                } 
                else if (document.msExitFullscreen) { 
                document.msExitFullscreen(); 
                }
                this.full=false;
            }
        }
  }
})