import UserList from "./UserList.vue";
import { server } from "@/mocks/server";
import { fireEvent, render } from "@testing-library/vue";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { waitForRequest } from "@/mocks/waitForRequest";

describe("UserList.vue", () => {
  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  test("input に入力せずにボタンをクリックした場合クエリパラメータが付与されない", async () => {
    const { getByText } = render(UserList);
    // /api/users に対応するリクエストを監視する
    const pendingRequest = waitForRequest("GET", "/api/users");

    const button = getByText("Fetch");
    await fireEvent.click(button);

    // リクエストが到達するまで待機して、リクエストを取得する
    const request = await pendingRequest;
    expect(request.url.searchParams.get("q")).toBeNull();
  });

  test('input に "Alice" と入力してボタンをクリックした場合 ?q=Alice がリクエストに付与される', async () => {
    const { getByText, getByLabelText } = render(UserList);
    const pendingRequest = waitForRequest("GET", "/api/users");

    const button = getByText("Fetch");
    const input = getByLabelText("Search");

    await fireEvent.update(input, "Alice");
    await fireEvent.click(button);

    const request = await pendingRequest;
    expect(request.url.searchParams.get("q")).toBe("Alice");
  });
});
