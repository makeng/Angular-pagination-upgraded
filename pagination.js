/**
 * Created by ken on 201showListLength/4/23.
 */
/*  分页指令
 *   对外暴露的有两个参数，一个是当前页page，一个是最大页数maxPage
 *   对最大页数进行监听，如果改变了就更新最大页数数组
 * */
app.directive('pagination', function () {
    return {
        //元素
        restrict: 'E',
        //作用域
        scope: {
            page: '=',  //等号是双向绑定
            maxPage: '=',
            showListLength: '='
        },
        //html
        template: '<div class="pagination">' +
        '<ul class="pager">' +
        '<li><a href="javascript:void(0)" ng-click="pageGo(1)">首页</a></li>' +
        '<li><a href="javascript:void(0)" ng-click="pagePre()">上一页</a></li>' +
        '</ul>' +
        '<ul ng-show="isShowOmitFirstPage">' +
        '<li><a href="javascript:void(0)" ng-click="pageGo(1)">1</a></li>' +
        '<li><a href="javascript:void(0)" ng-click="pageGo(2)">2</a></li>' +
        '<li><a>...</a></li>' +
        '</ul>' +
        '<ul>' +
        '<li ng-repeat="num in pageShowList track by $index" ng-class="{active: clickPage == num}">' +
        '<a href="javascript:void(0)" ng-click="pageGo(num)">{{num}}</a>' +
        '</li>' +
        '</ul>' +
        '<ul ng-show="isShowOmitLastPage">' +
        '<li><a>...</a></li>' +
        '<li><a href="javascript:void(0)" ng-click="pageGo(maxPage-1)">{{maxPage-1}}</a></li>' +
        '<li><a href="javascript:void(0)" ng-click="pageGo(maxPage)">{{maxPage}}</a></li>' +
        '</ul>' +
        '<ul class="pager">' +
        '<li><a href="javascript:void(0)" ng-click="pageNext()">下一页</a></li>' +
        '<li><a href="javascript:void(0)" ng-click="pageGo(maxPage)">尾页:{{maxPage}}</a></li>' +
        '</ul>' +
        '</div>',
        //替换
        replace: true,
        //link函数
        link: function ($scope) {
            //变量
            var pageList = [];
            $scope.page = 1;    //初始默认为第一页
            $scope.pageShowList = [];    //最大显示showListLength个格子
            $scope.isShowOmitLastPage = false;  //一开始不显示带省略号的头尾页
            $scope.isShowOmitFirstPage = false;

            /*  监听最大页数，如果页数变化，重新生成页数数组
             * */
            var watch = $scope.$watch('maxPage', function (newValue, oldValue, scope) {
                pageList = [];
                for (var i = 1; i <= newValue; i++) {   //一个个压入页码
                    pageList.push(i);
                }
                resetPageOrder($scope.page);
            });

            /*  直接跳页
             * */
            $scope.pageGo = function (num) {
                $scope.page = num;
                resetPageOrder($scope.page);
            };

            /*  上一页
             * */
            $scope.pagePre = function () {
                if ($scope.page > 1) {
                    $scope.page--;
                    resetPageOrder($scope.page);
                }
            };

            /*  下一页
             * */
            $scope.pageNext = function () {
                if ($scope.page < $scope.maxPage) {
                    $scope.page++;
                    resetPageOrder($scope.page);
                }
            };

            /*  重新设置页码
             *   @param num当前页码
             * */
            function resetPageOrder(num) {
                if (num === '...')return;
                $scope.clickPage = num; //变色
                var halfShowListLength = Math.ceil($scope.showListLength / 2);
                //分三种情况讨论
                //第一种是窗口在头，且页码在窗口左半边，不移动
                if (num < halfShowListLength) {
                    $scope.pageShowList = pageList.slice(0, $scope.showListLength);  //只显示最大showListLength个
                }
                //页码大于一半窗口开始跟随移动
                else {
                    //第二种是窗口在尾，且页码在窗口右半边
                    if (num > $scope.maxPage - halfShowListLength) {
                        $scope.pageShowList = pageList.slice($scope.maxPage - $scope.showListLength, $scope.maxPage);  //只显示最大showListLength个
                    }
                    //第三种是窗口在头尾各去掉一半的中间移动
                    else {
                        $scope.pageShowList = [];
                        for (var i = 1; i <= $scope.showListLength; i++) {
                            $scope.pageShowList.push(
                                num - halfShowListLength + i
                            )
                        }
                    }
                }
                /*---增加省略号---*/
                //总页数大于窗口大小，才有此功能
                $scope.isShowOmitLastPage = false;
                $scope.isShowOmitFirstPage = false;
                if ($scope.maxPage > 3 && $scope.maxPage > ($scope.pageShowList.length + 4)) {
                    //剩下3页未显示，且未显示的多于2页
                    if ($scope.page <= ($scope.maxPage - 3) && ($scope.maxPage - $scope.page - halfShowListLength >= 2 ))
                        $scope.isShowOmitLastPage = true;
                    //当前超过三页，且已经过去了的多于2页
                    if ($scope.page >= 3 && ($scope.page - halfShowListLength > 2 ))
                        $scope.isShowOmitFirstPage = true;
                }
            }
        }
    }
});
