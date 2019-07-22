function getUriParams (){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) === "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
}

//获取当前页面名，带后缀
function getFullPageName() {
    //return location.href.split('?').shift().split('/').pop();
    var q = location.href.indexOf('?');
    var s = location.href.lastIndexOf('/') + 1;
    return q == -1 ? location.href.substring(s) : location.href.substring(s, q);
}


function getPageName() {
    var pageName = getFullPageName();
    return pageName.substring(0, pageName.indexOf('.'));
}


function getParam(par){
    //获取当前URL
    var local_url = document.location.href;
    //获取要取得的get参数位置
    var get = local_url.indexOf(par +"=");
    if(get == -1){
        return false;
    }
    //截取字符串
    var get_par = local_url.slice(par.length + get + 1);
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
    }
    return get_par;
}