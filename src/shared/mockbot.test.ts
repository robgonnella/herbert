import { Mockbot } from "./mockbot";

test("mockbot", () => {
  const mockbot = new Mockbot();
  expect(mockbot).toEqual({});
});
