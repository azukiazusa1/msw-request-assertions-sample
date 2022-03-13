import UserList from "./UserList.vue";
import { server } from "@/mocks/server";
import { fireEvent, render, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import "whatwg-fetch";

describe("UserList.vue", () => {
  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  test("input に入力せずにボタンをクリックした場合すべてのユーザーを取得する", async () => {
    const { getByText, getAllByRole } = render(UserList);

    const button = getByText("Fetch");
    await fireEvent.click(button);

    await waitFor(() => {
      const users = getAllByRole("listitem");
      expect(users).toHaveLength(3);
    });
  });

  test('input に "Alice" と入力してボタンをクリックした場合ユーザー名が "Alice" のユーザーのみ取得する', async () => {
    const { getByText, getByLabelText, getAllByRole } = render(UserList);

    const button = getByText("Fetch");
    const input = getByLabelText("Search");

    await fireEvent.update(input, "Alice");
    await fireEvent.click(button);

    await waitFor(() => {
      const users = getAllByRole("listitem");
      expect(users).toHaveLength(1);
      expect(users[0]).toHaveTextContent("Alice");
    });
  });
});
