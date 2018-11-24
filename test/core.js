import test from 'ava';
import sinon from 'sinon';
import PubSub from 'pubsub-js';
import * as main from '../index.mjs';

/*******************************************  Fake function ********************************************/

test(`Fake Function return some value.`, (t) => {
  let fakeFunction = sinon.fake.returns('hello');
  fakeFunction()
  t.is(fakeFunction.callCount, 1)
  t.is(fakeFunction(), 'hello')
});

test(`Fake Function throws some error.`, (t) => {
  let fakeFunction = sinon.fake.throws(new Error('something went wrong!'));
  t.throws(() => {
    fakeFunction()
  })
});

test(`Fake Function resolve and have no error.`, (t) => {
  let data = {
    message: "Resolved value"
  }
  let fakeFunction = sinon.fake.resolves(data)
  fakeFunction()
    .then(res => {
      console.log(res)
    })
  t.is(fakeFunction.callCount, 1)
  t.notThrows(() => {
    fakeFunction()
  })
});

test(`Fake Function reject.`, (t) => {
  let fakeFunction = sinon.fake.rejects(new Error('something went wrong!'))
  fakeFunction()
    .then(res => {
      console.log(res)
    }).catch(err => {
      console.log('Error::', err.message)
    })
  t.is(fakeFunction.callCount, 1)
});

test(`Fake Function yields.`, (t) => {
  let fakeFunction = sinon.fake.yields('hello')
  fakeFunction(console.log)
  t.is(fakeFunction.callCount, 1)
});

test(`Fake Function wraps an existing Function to record all interactions.`, (t) => {
  let fakeFunction = sinon.fake(main.demoFucntion)
  console.log(fakeFunction())
  t.is(fakeFunction.callCount, 1)
});

test(`Fake Function Instance properties.`, (t) => {
  let f = sinon.fake();
  let cb1 = function () { };
  let cb2 = function () { };
  // console.log(cb1())  
  f(1, 2, 5, cb1);
  f(1, 2, 3, cb2);
  // console.log(f.callback, cb2)
  t.true(f.callback === cb2)
});

test(`Fake Function check lastArg.`, (t) => {
  let f = sinon.fake();
  let date1 = new Date();
  let date2 = new Date();

  f(1, 2, date1);
  f(1, 2, date2);
  t.true(f.getCall(0).lastArg === date1)
  t.true(f.getCall(1).lastArg === date2)
  t.true(f.lastCall.lastArg === date2)
});

test(`Fake Function Adding the fake to the system under test.`, (t) => {
  let fake = sinon.fake.returns('42');

  sinon.replace(main, 'demoFucntion', fake);

  main.demoFucntion();
  // console.log(main.demoFucntion())
  t.true(main.demoFucntion() === '42')
  sinon.restore();
});

/******************************************  spy function ****************************************/

test('Creating a spy as an anonymous function and check it"s information', t => {
  let spyFunction = sinon.spy();

  //We can call a spy like a function
  spyFunction('Hello', 'World');

  //Now we can get information about the call
  t.true(spyFunction.called);
  t.is(spyFunction.callCount, 1);
  t.deepEqual(spyFunction.firstCall.args, ['Hello', 'World'])
});

test('Using a spy to wrap an existing method', t => {
  let userFunction = sinon.spy(main, 'user');
  main.callUser('john');
  t.true(userFunction.called)
  t.is(userFunction.callCount, 1);
  userFunction.restore();
});

test('Using a spy to wrap an existing method and check argument', t => {
  let userFunction = sinon.spy(main, 'user');
  main.callUser('john');
  t.true(userFunction.called)
  t.is(userFunction.callCount, 1);

  t.true(userFunction.calledWith('john'))
  //or
  t.deepEqual(userFunction.getCall(0).args, ['john']);
  //or
  t.deepEqual(userFunction.getCall(0).args[0], 'john');

  userFunction.restore();
});

test('should call method once with each argument', t => {
  let object = {
    method: function (value) {
      return value
    }
  };
  let spy = sinon.spy(object, "method");

  object.method(42);
  object.method(1);
  t.true(spy.firstCall.calledWith(42));
  t.true(spy.withArgs(1).calledOnce);
});


// test.only('test should call all subscribers, even if there are exceptions', t => {
//   let message = 'an example message';
//   let stub = sinon.stub().throws();
//   let spy1 = sinon.spy();
//   let spy2 = sinon.spy();

//   PubSub.subscribe(message, stub);
//   PubSub.subscribe(message, spy1);
//   PubSub.subscribe(message, spy2);

//   PubSub.publishSync(message, '123');

//   t.true(spy1.called);
//   t.true(spy2.called);
//   t.true(stub.calledBefore(spy1));
// });