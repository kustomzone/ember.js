import EmberView from 'ember-views/views/view';
import run from 'ember-metal/run_loop';
import compile from 'ember-template-compiler/system/compile';
import { equalInnerHTML } from 'htmlbars-test-helpers';
import { test, testModule } from 'ember-glimmer/tests/utils/skip-if-glimmer';

var view;

function appendView(view) {
  run(function() { view.appendTo('#qunit-fixture'); });
}

testModule('ember-htmlbars: svg attribute', {
  teardown() {
    if (view) {
      run(view, view.destroy);
    }
  }
});

test('unquoted viewBox property is output', function() {
  var viewBoxString = '0 0 100 100';
  view = EmberView.create({
    context: { viewBoxString: viewBoxString },
    template: compile('<svg viewBox={{viewBoxString}}></svg>')
  });
  appendView(view);

  equalInnerHTML(view.element, `<svg viewBox="${viewBoxString}"></svg>`, 'attribute is output');

  run(view, view.set, 'context.viewBoxString', null);
  equal(view.element.getAttribute('svg'), null, 'attribute is removed');
});

test('quoted viewBox property is output', function() {
  var viewBoxString = '0 0 100 100';
  view = EmberView.create({
    context: { viewBoxString: viewBoxString },
    template: compile('<svg viewBox=\'{{viewBoxString}}\'></svg>')
  });
  appendView(view);

  equalInnerHTML(view.element, `<svg viewBox="${viewBoxString}"></svg>`, 'attribute is output');
});

test('quoted viewBox property is concat', function() {
  var viewBoxString = '100 100';
  view = EmberView.create({
    context: { viewBoxString: viewBoxString },
    template: compile('<svg viewBox=\'0 0 {{viewBoxString}}\'></svg>')
  });
  appendView(view);

  equalInnerHTML(view.element, `<svg viewBox="0 0 ${viewBoxString}"></svg>`, 'attribute is output');

  var newViewBoxString = '200 200';
  run(view, view.set, 'context.viewBoxString', newViewBoxString);

  equalInnerHTML(view.element, `<svg viewBox="0 0 ${newViewBoxString}"></svg>`, 'attribute is output');
});

test('class is output', function() {
  view = EmberView.create({
    context: { color: 'blue' },
    template: compile('<svg class=\'{{color}} tall\'></svg>')
  });
  appendView(view);

  equalInnerHTML(view.element, '<svg class="blue tall"></svg>', 'attribute is output');

  run(view, view.set, 'context.color', 'red');

  equalInnerHTML(view.element, '<svg class="red tall"></svg>', 'attribute is output');
});
