/**
 * @file Index file for demo-test.
 */

export function demoFucntion() { return true }
export const sampleCons = 'demoConst'

export function user(name) {
  return `user-${name}`;
}

export function callUser(userName = 'john') {
  this.user(userName)
}