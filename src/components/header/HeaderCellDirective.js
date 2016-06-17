import angular from 'angular';
import { HeaderCellController } from './HeaderCellController';

export function HeaderCellDirective($compile){
  return {
    restrict: 'E',
    controller: HeaderCellController,
    controllerAs: 'hcell',
    scope: true,
    bindToController: {
      options: '=',
      column: '=',
      onCheckboxChange: '&',
      onSort: '&',
      sortType: '=',
      onResize: '&',
      selected: '='
    },
    replace: true,
    template:
      `<div ng-class="hcell.cellClass()"
            class="dt-header-cell"
            draggable="true"
            data-id="{{column.$id}}"
            ng-style="hcell.styles()"
            title="{{::hcell.column.name}}">
      </div>`,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          var cellHTML=`
            <div resizable="hcell.column.resizable"
               on-resize="hcell.onResized(width, hcell.column)"
               min-width="hcell.column.minWidth"
               max-width="hcell.column.maxWidth">
              <label ng-if="hcell.column.isCheckboxColumn && hcell.column.headerCheckbox" class="dt-checkbox">
                <input type="checkbox"
                       ng-checked="hcell.selected"
                       ng-click="hcell.onCheckboxChange()" />
              </label>
              <span class="dt-header-cell-label"
                    ng-click="hcell.onSorted()">
              </span>
              <span ng-class="hcell.sortClass()"></span>
            </div>
          `
          var $cellElm=angular.element(cellHTML)
          $elm.append($cellElm);
          var label = $elm.find('.dt-header-cell-label');

          if(ctrl.column.headerTemplate){
            let elm = angular.element(`<span>${ctrl.column.headerTemplate.trim()}</span>`);
            label.append(elm);
          } else if(ctrl.column.headerRenderer){
            let elm = angular.element(ctrl.column.headerRenderer($scope, $elm, $attrs, ctrl,label));
            if(elm) label.append(elm);
          } else {
            label.html("{{ hcell.column.name }}");
          }
          $compile($cellElm)($scope);
        }
      }
    }
  };
};
