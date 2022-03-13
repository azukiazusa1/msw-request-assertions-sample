import UserList from "./UserList.vue";
import { server } from "@/mocks/server";
import { fireEvent, render } from "@testing-library/vue";
import { rest } from "msw";
import "@testing-library/jest-dom";
import "whatwg-fetch";

describe("UserList.vue", () => {
  const mockFn = jest.fn();
  beforeEach(() => {
    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        const target = req.url.searchParams.get("q"); // クエリパラメータを取得する
        mockFn(target); // クエリパラメータを引数にモック関数を呼び出す
        return res(ctx.json([]));
      })
    );
  });

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
    mockFn.mockClear();
  });

  afterAll(() => server.close());

  test("input に入力せずにボタンをクリックした場合クエリパラメータが付与されない", async () => {
    const { getByText } = render(UserList);
    const button = getByText("Fetch");

    await fireEvent.click(button);

    expect(mockFn).toHaveBeenCalledWith(null);
  });

  test('input に "Alice" と入力してボタンをクリックした場合 ?q=Alice がリクエストに付与される', async () => {
    const { getByText, getByLabelText } = render(UserList);
    const button = getByText("Fetch");
    const input = getByLabelText("Search");

    await fireEvent.update(input, "Alice");
    await fireEvent.click(button);

    expect(mockFn).toHaveBeenCalledWith("Alice");
  });
});
