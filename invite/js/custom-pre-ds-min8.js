(function () {
    var e = 60 * 30;
    var t = function (e) {
        var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
        var n = window.location.search.substr(1).match(t);
        if (n != null)return unescape(n[2]);
        return null
    };
    var n = function (e) {
        var t = /http:\/\/([^\/]+)\//i;
        var n = e.match(t);
        return n[1]
    };
    var r = function (e) {
        if (!e)return "";
        if (e.indexOf("://") != -1)e = e.substr(e.indexOf("://") + 3);
        var t = ["com", "net", "org", "gov", "edu", "mil", "biz", "name", "info", "mobi", "pro", "travel", "museum", "int", "areo", "post", "rec", "im", "cn", "me"];
        var n = e.split(".");
        if (n.length <= 1)return e;
        if (!isNaN(n[n.length - 1]))return e;
        var r = ".com.cn";
        if (e.indexOf(r) != -1) {
            return n[n.length - 3] + "." + n[n.length - 2] + "." + n[n.length - 1]
        }
        var i = 0;
        while (i < t.length && t[i] != n[n.length - 1])i++;
        if (i != t.length)return n[n.length - 2] + "." + n[n.length - 1]; else {
            i = 0;
            while (i < t.length && t[i] != n[n.length - 2])i++;
            if (i == t.length)return n[n.length - 2] + "." + n[n.length - 1]; else return n[n.length - 3] + "." + n[n.length - 2] + "." + n[n.length - 1]
        }
    };
    var i = {
        get: function (e) {
            var t = document.cookie.match(new RegExp("(^| )" + e + "=([^;]*)(;|$)"));
            if (t != null)return unescape(t[2]);
            return null
        }, add: function (e, t, n) {
            var i = e + "=" + t;
            if (n != 0) {
                var o = new Date;
                var a = n * 1e3;
                o.setTime(o.getTime() + a);
                i += "; expires=" + o.toGMTString()
            }
            var s = r(location.hostname);
            if (s != "") {
                i += "; domain=" + s
            }
            i += ";path=/";
            document.cookie = i
        }
    };
    var o = function () {
        var t = {
            setItem: function (t, n) {
                i.add(t, n, e)
            }, getItem: function (e) {
                return i.get(e)
            }, removeItem: function (e) {
                i.add(e, "", -1)
            }
        };
        if (sessionStorage) {
            try {
                var o = ["REFER_DSCKID", "REFER_DSTIMESTAMP", "DS_FROM_TYPE"];
                var a = function () {
                    if (document.referrer != "") {
                        var e = r(n(document.referrer));
                        var t = r(location.hostname);
                        return e == t
                    } else {
                        return false
                    }
                }();
                if (!a) {
                    for (var s = 0; s < o.length; s++) {
                        t.removeItem(o[s])
                    }
                } else {
                    for (var s = 0; s < o.length; s++) {
                        var l = sessionStorage.getItem(o[s]);
                        var c = t.getItem(o[s]);
                        if ((l == null || l == "") && (c != null && c != "")) {
                            sessionStorage.setItem(o[s], c)
                        }
                    }
                }
            } catch (u) {
            }
        }
        return {
            setItem: function (e, n) {
                sessionStorage && sessionStorage.setItem(e, n);
                t.setItem(e, n)
            }, getItem: function (e) {
                if (sessionStorage) {
                    return sessionStorage.getItem(e)
                } else {
                    return t.getItem(e)
                }
            }
        }
    }();
    var a = function () {
        var e = location.href;
        if (e.indexOf("DSCKID") != -1) {
            var n = t("DSCKID");
            var r = t("DSTIMESTAMP");
            o.setItem("REFER_DSCKID", n);
            o.setItem("REFER_DSTIMESTAMP", r)
        }
        if (e.indexOf("from") != -1) {
            var i = t("from");
            var a = {singlemessage: 1, groupmessage: 2, timeline: 3};
            if (a[i] == undefined) {
                o.setItem("DS_FROM_TYPE", 0)
            } else {
                o.setItem("DS_FROM_TYPE", a[i])
            }
        }
        var s = document.referrer;
        if (s.indexOf("mp.weixin.qq.com") != -1 || s.indexOf("mp.weixinbridge.com") != -1) {
            o.setItem("DS_FROM_TYPE", 4)
        }
    };
    var s = function () {
        var e = "";
        try {
            e = document.getElementById("DS_PRE_JS").src.split("?")[1].split("&")[0].split("=")[1];
            if (e == null || e == "") {
                console.log("please contact DataStory");
                return
            }
            var t = "";
            if (e == "aiwanpai") {
                if (location.host.indexOf("aiwanpai.com") != -1) {
                    t += "-" + location.pathname.split("/")[1]
                }
            } else if (e == "maka") {
                try {
                    t += "-" + document.getElementById("DS_PRE_JS").src.split("?")[1].split("&")[1].split("=")[1]
                } catch (n) {
                    console.log("Id is empty, please contact DataStory");
                    return
                }
            } else if (e == "youtu") {
                if (location.host.indexOf("360youtu.cn") != -1) {
                    t += "-" + location.pathname.split("/")[3].split(".")[0]
                }
            } else if (e == "gengyun") {
                if (location.host.indexOf("xiao8web.com") != -1) {
                    t += "-" + location.pathname.split("/")[3]
                }
            } else if (e == "eqxiu") {
                t += "-" + location.pathname.split("/s/")[1].match(/^[a-zA-Z0-9_]{8,}/)[0]
            }
            if (t == null || t == "") {
                console.log("please contact DataStory");
                return
            }
            e += t
        } catch (n) {
            console.log("please read DataStory api doc");
            return
        }
        var r = document.createElement("script");
        r.src = document.location.protocol + "//tongji.datastory.com.cn/ds2.js?dsTid=" + e;
        var i = document.getElementsByTagName("script")[0];
        // i.parentNode.insertBefore(r, i)
    };
    var l = function (e, t) {
        return e.indexOf(t) != -1
    };
    var c = function () {
        try {
            if (window.DS == undefined)window.DS = {};
            DS.ready = function (e) {
                var t = function () {
                    if (DS.linkChange == undefined || DS.sendRepost == undefined) {
                        setTimeout(t, 500)
                    } else {
                        try {
                            e()
                        } catch (n) {
                        }
                    }
                };
                t()
            };
            a();
            s()
        } catch (e) {
        }
    };
    c()
})();