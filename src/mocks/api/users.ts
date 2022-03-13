import { ResponseResolver, MockedRequest, restContext } from "msw";

const get: ResponseResolver<MockedRequest, typeof restContext> = (
  req,
  res,
  ctx
) => {
  let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" },
    { id: 3, name: "Bob" },
  ];

  const q = req.url.searchParams.get("q");
  if (q) {
    users = users.filter((user) => user.name.includes(q));
  }

  return res(ctx.status(200), ctx.json(users));
};

export default { get };
