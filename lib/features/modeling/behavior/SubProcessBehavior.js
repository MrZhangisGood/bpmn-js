import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isExpanded } from '../../../util/DiUtil';

import { is } from '../../../util/ModelUtil';

var LOW_PRIORITY = -Infinity;

export default function SubProcessBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);

  /**
   * Adjust position of expanded SubProcess after it replaces a shape
   */
  this.postExecuted('shape.replace', function(event) {
    var oldShape = event.context.oldShape,
        newShape = event.context.newShape;

    if (
      !is(newShape, 'bpmn:SubProcess') &&
      !isExpanded(newShape)
    ) {
      return;
    }

    modeling.moveShape(newShape, {
      x: oldShape.x - newShape.x,
      y: 0
    });
  });

  this.preExecuted('shape.toggleCollapse', LOW_PRIORITY, function(event) {
    var shape = event.context.shape;

    event.context.preToggledShape = shape;
  });

  this.postExecuted('shape.toggleCollapse', LOW_PRIORITY, function(event) {

    var preToggledShape = event.context.preToggledShape,
        postToggledShape = event.context.shape;

    // TODO: Why is the condition not true when toggling an expanded subprocess to collapsed?
    // Why is it a task?!
    if (
      !is(postToggledShape, 'bpmn:SubProcess') &&
      !isExpanded(preToggledShape)
    ) {
      return;
    }

    modeling.moveShape(postToggledShape, {
      x: preToggledShape.x,
      y: 0
    });
  });
}

SubProcessBehavior.$inject = [
  'eventBus',
  'modeling'
];

inherits(SubProcessBehavior, CommandInterceptor);
