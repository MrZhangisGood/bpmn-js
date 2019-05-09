import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import coreModule from 'lib/core';
import modelingModule from 'lib/features/modeling';
import replaceModule from 'lib/features/replace';

describe('features/modeling/behavior - subprocess', function() {
  var diagramXML = require('./SubProcessBehavior.bpmn');

  beforeEach(bootstrapModeler(
    diagramXML, {
      modules: [
        coreModule,
        modelingModule,
        replaceModule
      ]
    }
  ));


  describe('should prevent overlap with previous content', function() {

    it('when replacing a task with an expanded subprocess', inject(
      function(elementRegistry, bpmnReplace) {

        // given
        var task = elementRegistry.get('Task'),
            expandedSubProcess;

        // when
        expandedSubProcess = bpmnReplace.replaceElement(task, {
          type: 'bpmn:SubProcess',
          isExpanded: true
        });

        // y has not changed after replace and width/height are the defaults
        var expectedBounds = {
          x: task.x,
          y: 21,
          width: 350,
          height: 200
        };

        // then
        expect(expandedSubProcess).to.have.bounds(expectedBounds);
      }
    ));


    it('when expanding a subprocess', inject(
      function(elementRegistry, modeling) {

        // given
        var collapsedSubProcess = elementRegistry.get('SubProcess'),
            collapsedXPosition = collapsedSubProcess.x,
            expandedSubProcess;

        // when
        modeling.toggleCollapse(collapsedSubProcess);

        expandedSubProcess = elementRegistry.get('SubProcess');

        // y has not changed after toggle and width/height are the defaults
        var expectedBounds = {
          x: collapsedXPosition,
          y: 210,
          width: 350,
          height: 200
        };

        // then
        expect(expandedSubProcess).to.have.bounds(expectedBounds);
      }
    ));

  });

});
