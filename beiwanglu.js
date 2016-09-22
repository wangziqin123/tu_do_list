/**
 * Created by Administrator on 2016/9/9 0009.
 */
angular.module("myapp",[])
.controller("ctrl",["$scope","$filter",function($scope,$filter){
    $scope.data=localStorage.messages?JSON.parse(localStorage.messages):[];
    //localStorage.messages=[];
    /*localStorage.messages=JSON.stringify([{id:1,title:"111"},{id:2,title:"222"}])
     $scope.data=JSON.parse(localStorage.messages)*/
    //console.log($scope.data);

    /*搜索 当内容变化时进行监测*/
    $scope.search="";
    $scope.$watch("search",function(){
        //alert(1)
        var arr=$filter("filter")($scope.data,$scope.search);
        $scope.dangqianCon=$scope.data[getIndex(arr[0].id)];
    })


    /*获取当前的id和内容*/
    $scope.dangqianId=$scope.data.length?$scope.data[0].id:null;
    $scope.dangqianCon=$scope.dangqianId?$scope.data[getIndex($scope.dangqianId)]:null;
    /* alert($scope.dangqianCon)*/

    /*开关*/
    $scope.isshow=true;


    /*添加列表*/
    $scope.addList=function(){
        $scope.isshow=true;
        var maxid=getMaxId($scope.data);
        var obj={id:maxid+1,title:"新建文档"+(maxid+1)+"",son:[]}
        $scope.data.push(obj);
        console.log($scope.data);
        localStorage.messages=JSON.stringify($scope.data);
        // console.log(localStorage.messages)
        //使右侧显示新添加的页面信息
        $scope.dangqianCon=$scope.data[maxid];
    }
    /*删除列表*/
   /* console.log($scope.data)*/
    $scope.removeList=function(id){
        //alert(id)
        angular.forEach($scope.data,function(val,index){
             if(val.id==id){
                 if($scope.data.length==1){
                     //alert(1)
                     $scope.dangqianId=null;
                     $scope.dangqianCon=[];
                     $scope.data=[];
                 }else if(getIndex(id)==$scope.data.length-1){
                     $scope.data.splice(index,1);
                     $scope.dangqianCon=$scope.data[index-1];
                 }else{
                     $scope.data.splice(index,1);
                     $scope.dangqianCon=$scope.data[index];
                 }
             }
            localStorage.messages=JSON.stringify($scope.data);
        })


    }



    /*更改数据列表*/
    $scope.blur=function(id){
        /*for(var i=0;i<$scope.data.length;i++){
            if($scope.data[i].id==id){*/
                localStorage.messages=JSON.stringify($scope.data);
        /*    }
        }*/
    }

    /*列表映射*/
    $scope.focus=function(id){
        $scope.isshow=true;
        $scope.dangqianId=id;
        $scope.dangqianCon=$scope.dangqianId?$scope.data[getIndex($scope.dangqianId)]:null;
    }

    /*添加子内容*/
    $scope.addCon=function(){
        /*alert(1)*/
        var id=getMaxId($scope.dangqianCon.son);
        var obj={id:id+1,title:"新建目录"+(id+1)}
        console.log(obj)
        $scope.dangqianCon.son.push(obj);
        localStorage.messages=JSON.stringify($scope.data);
    }
    /*修改子内容*/
    $scope.xiugai=function(){
        //alert($scope.dangqianCon.son.length)
        /*for(var i=0;i<$scope.dangqianCon.son.length;i++){
            if(id==$scope.dangqianCon.son[i].id){*/
                localStorage.messages=JSON.stringify($scope.data);
       /*     }
        }*/
    }

    /*删除数据*/
    $scope.removeCon=function(id){
        angular.forEach($scope.dangqianCon.son,function(val,index){
            if(id==val.id){
                $scope.dangqianCon.son.splice(index,1);
            }
        })
        localStorage.messages=JSON.stringify($scope.data);
    }

    /*获取已完成的数据，并保存到$scope上*/
    $scope.success=localStorage.success?JSON.parse(localStorage.success):[];
    /*存入已完成的数组*/
    $scope.done=function(id){
        for(var i=0;i<$scope.success.length;i++){
            if($scope.success[i].id==id){
                alert("已完成项目id相同不能添加，请添加不同id");
                return ;
            }
        }
        //放入到success中
        var index=getIndex(id,$scope.dangqianCon.son);
        //alert(index)
        var obj=$scope.dangqianCon.son[index];
        $scope.success.push(obj);
        //删除原数组中的元素
        $scope.dangqianCon.son.splice(index,1);
        //将现在的数组保存到success中
        localStorage.success=JSON.stringify($scope.success);
        localStorage.messages=JSON.stringify($scope.data);
    }

    //删除已完成项
    $scope.removeDone=function(id){
        angular.forEach($scope.success,function(val,index){
            if(val.id==id){
                $scope.success.splice(index,1);
            }
        })
        localStorage.success=JSON.stringify($scope.success);
    }

    //数组对其进行排序
    /* var arr=[{id:1,title:11111},{id:3,title:3333333},{id:9,title:999},{id:2,title:222222}]
     arr.sort(function(a,b){
     return a.id > b.id;
     })
     console.log(arr)*/
    /*获取最大id*/
    function getMaxId(arr){
        var temp;
        if(arr.length>0){
            temp=arr[0].id;
            for(var i=0;i<arr.length;i++){
                if(temp<arr[i].id){
                    temp=arr[i].id;
                }
            }
        }else{
            temp=0;
        }

        return parseInt(temp);
    }

    /*通过id获取对应的下标*/
    function getIndex(id,arr){
        arr=arr||$scope.data;
        for(var i=0;i<arr.length;i++){
            if(arr[i].id==id){
                return i;
            }
        }
    }

    /*点击checkbox选择并得出id*/
    var checkarr=[];
    $scope.xuanze=function(id){
        /*alert(id)*/
        angular.forEach($scope.data,function(val,index){
            if(val.id==id){
                checkarr.push($scope.data[index].id);
            }
        })
        //console.log(checkarr)
        return checkarr;
    }

    /*点击删除选中的元素*/
    $scope.delList=function(){
        //console.log(checkarr)
        for(var i=0;i<checkarr.length;i++){
            for(var j=0;j<$scope.data.length;j++){
                if($scope.data[j].id==checkarr[i]){
                    //console.log($scope.data[j])
                    var index=getIndex($scope.data[j].id);
                    $scope.data.splice(index,1)
                }
            }
        }
        localStorage.messages=JSON.stringify($scope.data);
    }
}])

