function sum(a, b) {
  return a + b;
}
test('2 + 3 = 5', () => {
  expect(sum(2, 3)).toBe(5);
});
