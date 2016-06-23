import { FooterController } from './FooterController';

export function FooterDirective($compile){
  return {
    restrict: 'E',
    controller: FooterController,
    controllerAs: 'footer',
    scope: true,
    bindToController: {
      paging: '=',
      onPage: '&'
    },
    template:
      `<div class="dt-footer">
        
      </div>`,
    replace: true,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          var footerHTML=`
            <div class="page-count"></div>
            <dt-pager page="footer.page"
                   size="footer.paging.size"
                   count="footer.paging.count"
                   on-page="footer.onPaged(page)"
                   ng-show="footer.paging.count / footer.paging.size > 1">
            </dt-pager>
          `;
          var $footerElm=angular.element(footerHTML);
          $elm.append($footerElm);
          var total=$elm.find(".page-count");
          if(ctrl.paging.totalTemplate){
            total.html(`${ctrl.paging.totalTemplate.trim()}`);
          }else if(ctrl.footerRenderer){
            let elm = angular.element(ctrl.footerRenderer($scope, $elm, $attrs, ctrl,total));
            if(elm)total.append(elm);
          }else{
            total.html(`{{footer.paging.count}} total`)
          }
          $compile($elm.children())($scope);
        }
      }
    }
  };
};
