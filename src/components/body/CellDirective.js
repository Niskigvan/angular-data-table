import angular from 'angular';
import { CellController } from './CellController';

export function CellDirective($rootScope, $compile, $log, $timeout){
  return {
    restrict: 'E',
    controller: CellController,
    scope: true,
    controllerAs: 'cell',
    bindToController: {
      options: '=',
      value: '=',
      selected: '=',
      column: '=',
      row: '=',
      expanded: '=',
      hasChildren: '=',
      onTreeToggle: '&',
      onCheckboxChange: '&'
    },
    template:
      `<div class="dt-cell"
            data-title="{{::cell.column.name}}"
            ng-style="cell.styles()"
            ng-class="cell.cellClass()">
      </div>`,
    replace: true,
    compile: function() {
      return {
        pre: function($scope, $elm, $attrs, ctrl) {
          var cellHTML=`
            <label ng-if="cell.column.isCheckboxColumn" class="dt-checkbox">
              <input type="checkbox"
                     ng-checked="cell.selected"
                     ng-click="cell.onCheckboxChanged($event)" />
            </label>
            <span ng-if="cell.column.isTreeColumn && cell.hasChildren"
                  ng-class="cell.treeClass()"
                  ng-click="cell.onTreeToggled($event)"></span>
            <span class="dt-cell-content"></span>
          `
          if(ctrl.column.cellPreLink){
            ctrl.column.cellPreLink($scope, $elm, $attrs, ctrl,cellHTML)
            return
          }
          var $cellElm=angular.element(cellHTML)
          $elm.append($cellElm);
          var content = angular.element($cellElm[4]);
          if(ctrl.column.template){
            content.empty();
            var elm = angular.element(`<span>${ctrl.column.template.trim()}</span>`);
            content.append(elm);
          } else if(ctrl.column.cellRenderer){
            var elm = angular.element(ctrl.column.cellRenderer($scope, content));
            content.append(elm);
          } else {
            content[0].innerHTML = "{{cell.value}}";
          }
          $compile($cellElm)($scope);
        }
      }
    }
  };
};
