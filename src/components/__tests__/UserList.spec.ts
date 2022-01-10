import UserList from "../UserList.vue";
import { server } from "@/mocks/server";
import { render } from "@testing-library/vue";
import { rest } from "msw";
import "@testing-library/jest-dom";
import "whatwg-fetch";

describe("UserList.vue", () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  test("API コールが完了するまではローディングが表示されユーザー一覧が表示されない", async () => {
    const { findByText, queryAllByTestId } = render(UserList);

    expect(await findByText("Loading...")).toBeInTheDocument();
    expect(queryAllByTestId("user")).toHaveLength(0);
  });

  test("API コールが完了したらローディングの表示はなくなりユーザー名の一覧が表示される", async () => {
    const { findByText, queryByText, findAllByTestId } = render(UserList);

    expect(await findAllByTestId("user")).toHaveLength(3);
    expect(await findByText("John")).toBeInTheDocument();
    expect(queryByText("Loading...")).not.toBeInTheDocument();
  });

  test("API コールが失敗したらエラーメッセージが表示される", async () => {
    server.use(
      rest.get("/api/users", (req, res, ctx) => {
        return res.once(
          ctx.status(500),
          ctx.json({ message: "Internal Server Error" })
        );
      })
    );

    const { findByText, queryByText } = render(UserList);

    expect(await findByText("Something went wrong...")).toBeInTheDocument();
    expect(queryByText("Loading...")).not.toBeInTheDocument();
  });
});
