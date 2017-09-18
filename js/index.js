var app = new Vue({
    el: "#index",
    data: {
        date: "",
        day: "",
        weather: {},
        news: [],
        inteval: null,
        tab: 1,
        routes: [],
        pause: false
    },
    created: function() {
        window.setInterval(this.getDate, 1000);
        this.getWeather();
        this.getNews();
        this.scrollNews();
    },
    mounted: function() {
        var that = this;
        AMap.service('AMap.Driving', function() { //回调函数
            //实例化Driving
            driving = new AMap.Driving({ city: '北京市' });
            //TODO: 使用driving对象调用驾车路径规划相关的功能
        })
        this.map = new AMap.Map('trafic', {
            resizeEnable: true,
            zoom: 10,
            center: [116.480983, 40.0958]
        });
        this.driving = new AMap.Driving({
            map: that.map,
            // panel: "traficinfo",
            policy: AMap.DrivingPolicy.REAL_TRAFFIC,
            extensions: "all"
        });
        //传名称
        this.driving.search([{ keyword: '阜成路北2号楼', city: '北京' }, { keyword: '国凯基业汽车维修中心' }], function(status, result) {
            that.routes = result.routes;
        });
    },
    methods: {
        changepolicy: function(policy, tab) {
        	var that=this;
            this.tab = tab;
            this.driving.setPolicy(AMap.DrivingPolicy[policy])
            this.driving.search([{ keyword: '阜成路北2号楼', city: '北京' }, { keyword: '国凯基业汽车维修中心' }], function(status, result) {
            	console.log(result)
                that.routes = result.routes;
            });
        },
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
        getWeather: function() {
            var that = this;
            $.ajax({
                type: "get",
                headers: { "Authorization": "APPCODE 3638f6d28ade4a84ad7c5d759733129d" },
                url: "http://jisutqybmf.market.alicloudapi.com/weather/query?city=北京&citycode=101010100&cityid=1&ip=ip&location=location",
                data: {},
                success: function(r) {
                    if (r.status == 0) {
                        that.weather = r.result;
                    }
                }
            })
        },
        getNews: function() {
            var that = this;
            $.ajax({
                type: "get",
                headers: { "Authorization": "APPCODE 3638f6d28ade4a84ad7c5d759733129d" },
                url: "http://toutiao-ali.juheapi.com/toutiao/index",
                data: { type: "top" },
                success: function(r) {
                    if (r.error_code == 0) {
                        that.news = r.result.data;
                    }
                }
            })
        },

        scrollNews: function() {
            this.inteval = window.setInterval(function() {
                var ctop = parseFloat($("#news ul").css("top"));
                var rtop = parseFloat($("#news ul").parent().height()) - parseFloat($("#news ul").height());
                if (ctop < rtop) {
                    var t = 0;
                } else {
                    var t = ctop - 1;
                }
                $("#news ul").css("top", t + "px");
            }, 30)
        },
        scroll: function(f) {
            this.pause = !this.pause;

            if (f == 0) {
                this.scrollNews()
            } else {
                window.clearInterval(this.inteval);
                this.inteval = null;
            }
        }
    }
})