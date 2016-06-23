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
          var $cellElm=angular.element(cellHTML)
          $elm.append($cellElm);
          var content = $elm.find(".dt-cell-content");
          if(ctrl.column.template){
            content.empty();
            let elm = angular.element(`<span>${ctrl.column.template.trim()}</span>`);
            content.append(elm);
          } else if(ctrl.column.cellRenderer){
            let elm = angular.element(ctrl.column.cellRenderer($scope, $elm, $attrs, ctrl,content));
            if(elm)content.append(elm);
          } else {
            content.html("{{cell.value}}");
          }
          $compile($elm.children())($scope);
        }
      }
    }
  };
};
