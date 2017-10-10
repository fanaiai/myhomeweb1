var app = new Vue({
    el: "#index",
    data: {
        date: "",
        day: "",
        weather: {},
        news: [],
        oldnews: [],
        inteval: null,
        tab: 1,
        routes: [],
        full:false,
        pause: false
    },
    created: function() {
        window.setInterval(this.getDate, 1000);
        this.getWeather();
        // this.getNews();
        // this.scrollNews();
    },
    mounted: function() {
        var that = this;
        AMap.service('AMap.Driving', function() { //回调函数
            //实例化Driving
            driving = new AMap.Driving({ city: '北京市' });
            //TODO: 使用driving对象调用驾车路径规划相关的功能
        })
        var map = new AMap.Map('map', {
            resizeEnable: true,
            zoom: 10,
            mapStyle: "amap://styles/e641144abf4cf90028d1cf583c0a5249",
            center: [116.480983, 40.0958]
        });
        map.setFeatures(['road', 'point']) //多个种类要素显示
        map.plugin(["AMap.ToolBar"], function() {
            map.addControl(new AMap.ToolBar());
        });
        map.plugin(["AMap.MouseTool"], function() {
            var mousetool = new AMap.MouseTool(map);
            mousetool.marker(); //使用鼠标工具，在地图上画标记点
        });
        var driving = new AMap.Driving({
            map: map,
            // panel: "panel"
        });
        driving.search([{ keyword: '甘家口大厦', city: '北京' }, { keyword: '西单商场' }], function(status, result) {
            //TODO 解析返回结果，自己生成操作界面和地图展示界面
        });
    },
    methods: {
        changepolicy: function(policy, tab) {
            var that = this;
            this.tab = tab;
            this.driving.setPolicy(AMap.DrivingPolicy[policy])
            this.driving.search([{ keyword: '阜成路北2号楼', city: '北京' }, { keyword: '国凯基业汽车维修中心' }], function(status, result) {
                console.log(result)
                that.routes = result.routes;
            });
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
        rendnews: function(data) {
            var that = this;
            that.oldnews = data;
            if (that.news.length == 0) {
                that.news = data;
            } else {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].uniquekey == that.oldnews[0].uniquekey) {
                        return;
                    }
                    that.news.unshift(data[i]);
                }
            }
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
                        that.rendnews(r.result.data);
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