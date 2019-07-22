let pagename = getPageName();
const REDIS_NOT_FOUND       = 0;
const REDIS_STRING          = 1;
const REDIS_SET             = 2;
const REDIS_LIST            = 3;
const REDIS_ZSET            = 4;
const REDIS_HASH            = 5;

const SERVER_URI = "//localhost/phpcli";

// 首页渲染
function dbInfo(){
    $.ajax({
        url: SERVER_URI + "/index.php?action=dbInfo",
        success: function(data){
            data = JSON.parse(data);
            let infoMsg = "";
            _showDbMenu(data);
            // 获得 db数据
            for (let i in data){
                infoMsg += "            <div class=\"col-md-6\">" + i + "</div>\n" +
                    "            <div class=\"col-md-6\">" + data[i] + "</div>";
            }

            $("#db-info").append(infoMsg);


        }
    });
}

function _showDbMenu(data) {
    let dbMsg = [];
    for (let dbItem=0;dbItem<16;dbItem++){
        dbMsg[dbItem.toString()] = [];
    }
    // 获得 db数据
    for (let i in data){
        if(i.indexOf("db") == 0){
            dbMsg[i.substr(2)] = data[i];
        }
    }
    let dbMsgHtml = "";
    for (let i in dbMsg){
        if(dbMsg[i].length>0){
            dbMsgHtml += "<h6>"+ i + ":&nbsp;&nbsp;&nbsp;&nbsp;<a href='db.html?index="+ i +"'>" + dbMsg[i] +"</a></h6>";
        }else{
            dbMsgHtml += "<h6>"+ i + ":&nbsp;&nbsp;&nbsp;&nbsp;" + dbMsg[i] +"</h6>";
        }
    }
    $("#db-message").append(dbMsgHtml);
}

// key list
function dbDetail(){
    // 展示左侧栏 所有db的基本信息
    $.ajax({
        url: SERVER_URI + "/index.php?action=dbInfo",
        success: function(data){
            data = JSON.parse(data);
            _showDbMenu(data);
        }
    });
}

function dbDetailKeysList(index){
    console.log(index)
    // 展示db中详情列表
    $.ajax({
        url: SERVER_URI + "/index.php?action=getDbAllKeys&index=" + index,
        success: function(data){
            data = JSON.parse(data);
            _showKeysList(data,index);
        }
    });
}


function _showKeysList(data,dbindex) {
    let allKeysHtml = "";
    for (let item in data){
        allKeysHtml += " <div class=\"row\">\n    " +
            "      <div class=\"col-md-3\">"+ data[item]["key"] +"</div>\n" +
            "            <div class=\"col-md-3\">"+  data[item]["type"] +"</div>\n" +
            "            <div class=\"col-md-3\">"+  data[item]["ttl"] +"</div>\n" +
            "            <div class=\"col-md-3\"><a href='./detail.html?key="+ data[item]['key'] +"&index="+ dbindex +"'>查看</a>|<a class='key-delete' href='javascript:void()' index='"+ dbindex +"' key='"+ data[item]["key"] +"'>删除</a></div>\n" +
            "</div>"
        ;
    }
    $("#db-all-keys").nextAll().remove();
    $("#db-all-keys").after(allKeysHtml);
}
function dbDetailSearch(index){
    $("#search").bind('input propertychange',function () {
        let keyword = $(this).val();
        $.ajax({
            url: SERVER_URI + "/index.php?action=search&index="+ index +"&keyword="+keyword,
            success: function(data){
                data = JSON.parse(data);
                _showKeysList(data,index);
            }
        });
    });
}

function showDbIndex(index) {
    $("#db-index").html(index);
}

// key value

function showKeyValue(index,key) {
    $.ajax( {
        url: SERVER_URI + "/index.php?action=keyDetail&key="+ key +"&index=" + index,
            success: function(data){
                data = JSON.parse(data);
                let html = "";
                console.log(data['value']);
                console.log(data['type']);
                //
                // const REDIS_NOT_FOUND       = 0;
                // const REDIS_STRING          = 1;
                // const REDIS_SET             = 2;
                // const REDIS_LIST            = 3;
                // const REDIS_ZSET            = 4;
                // const REDIS_HASH            = 5;

                switch (data["type"]) {
                    case REDIS_STRING:
                        html = "       <div class=\"col-md-12\">\n" + data['value'] +
                            "            </div>";
                        break;
                    case REDIS_ZSET:
                        html += "<div class=\"col-md-6\">field</div>" +
                            "<div class=\"col-md-6\">分数</div>";
                        for(item in data['value']){
                            html += "<div class=\"col-md-6\">" + item + "</div>" +
                                "<div class=\"col-md-6\">" + data['value'][item]+ "</div>";
                        }
                        break;
                    default:
                        html += "<div class=\"col-md-6\">序号/key</div>" +
                            "<div class=\"col-md-6\">值</div>";
                        for(item in data['value']){
                            html += "<div class=\"col-md-6\">" + item + "</div>" +
                                "<div class=\"col-md-6\">" + data['value'][item]+ "</div>";
                        }
                        break;
                }

                $("#key-value").html(html);
                $("#ttl").html(data["ttl"]);
                $("#type").html(data["type"]);
            }
    });
}

function deleteKey(index){
    $(document).on('click', '.key-delete', function(){
        let key = $(this).attr("key")
        let that = this;
        $.ajax({
            url: SERVER_URI + "/index.php?action=deleteKey&index="+ index +"&key="+key,
            success: function(){
                $(that).parent("div").parent("div").remove();
            }
        });
    });
}

// dbInfo();
if(pagename === "index" || pagename === ""){
    dbInfo();
}else if(pagename === "db"){
    let index = getParam("index");
    dbDetail();
    dbDetailKeysList(index);
    dbDetailSearch(index);
    showDbIndex(index);
    deleteKey(index);

}else if(pagename === "detail"){
    let index = getParam("index");
    let key = getParam("key");
    showKeyValue(index,key)
}
