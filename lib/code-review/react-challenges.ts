import type { ChallengeLevel, CodeReviewChallenge } from "@/lib/code-review/challenges";

type Template = readonly [string, string, string, string, string];

const BASIC: Template[] = [
  ["Counter resets", "A product card should keep its click count when its parent rerenders.", `function ProductCard({ product }) {\n  let clicks = 0;\n\n  function addClick() {\n    clicks += 1;\n  }\n\n  return <button onClick={addClick}>{clicks}</button>;\n}`, `function ProductCard({ product }) {\n  const [clicks, setClicks] = useState(0);\n\n  function addClick() {\n    setClicks((current) => current + 1);\n  }\n\n  return <button onClick={addClick}>{clicks}</button>;\n}`, "A local variable is recreated on every render and does not trigger an update. Keep changing UI data in state."],
  ["Wrong list key", "An editable task list must keep each input attached to the same task after a new task is inserted.", `function TaskList({ tasks }) {\n  return tasks.map((task, index) => (\n    <TaskInput key={index} task={task} />\n  ));\n}`, `function TaskList({ tasks }) {\n  return tasks.map((task) => (\n    <TaskInput key={task.id} task={task} />\n  ));\n}`, "Array indexes change when items are inserted or removed. Use the task's stable ID so React preserves the right component state."],
  ["Form page reload", "A search form should show results without reloading the entire application.", `function SearchForm() {\n  function submit() {\n    searchCustomers();\n  }\n\n  return <form onSubmit={submit}>\n    <button>Search</button>\n  </form>;\n}`, `function SearchForm() {\n  function submit(event) {\n    event.preventDefault();\n    searchCustomers();\n  }\n\n  return <form onSubmit={submit}>\n    <button>Search</button>\n  </form>;\n}`, "Submitting a form follows the browser default and reloads the page. Prevent that default before handling the search."],
];

const INTERMEDIATE: Template[] = [
  ["Stale cart quantity", "Two quick clicks must add two items to a cart.", `function AddToCart() {\n  const [quantity, setQuantity] = useState(0);\n\n  function addTwo() {\n    setQuantity(quantity + 1);\n    setQuantity(quantity + 1);\n  }\n\n  return <button onClick={addTwo}>{quantity}</button>;\n}`, `function AddToCart() {\n  const [quantity, setQuantity] = useState(0);\n\n  function addTwo() {\n    setQuantity((current) => current + 1);\n    setQuantity((current) => current + 1);\n  }\n\n  return <button onClick={addTwo}>{quantity}</button>;\n}`, "Both updates read the same rendered value. Use the functional state form when the next value depends on the previous one."],
  ["Effect misses account", "An account page must refetch when its account ID changes.", `function AccountPage({ accountId }) {\n  const [account, setAccount] = useState(null);\n\n  useEffect(() => {\n    fetchAccount(accountId).then(setAccount);\n  }, []);\n\n  return <AccountCard account={account} />;\n}`, `function AccountPage({ accountId }) {\n  const [account, setAccount] = useState(null);\n\n  useEffect(() => {\n    fetchAccount(accountId).then(setAccount);\n  }, [accountId]);\n\n  return <AccountCard account={account} />;\n}`, "The effect captures the first account ID forever. Include every value the effect reads and expects to react to."],
  ["Mutated settings", "A preferences screen toggles one nested setting without changing the existing state object.", `function Preferences() {\n  const [settings, setSettings] = useState({\n    alerts: { email: true },\n  });\n\n  function disableEmail() {\n    settings.alerts.email = false;\n    setSettings(settings);\n  }\n\n  return <button onClick={disableEmail}>Disable</button>;\n}`, `function Preferences() {\n  const [settings, setSettings] = useState({\n    alerts: { email: true },\n  });\n\n  function disableEmail() {\n    setSettings((current) => ({\n      ...current,\n      alerts: { ...current.alerts, email: false },\n    }));\n  }\n\n  return <button onClick={disableEmail}>Disable</button>;\n}`, "Mutating the existing object makes updates hard to detect and corrupts previous state. Create new objects at each changed level."],
];

const ADVANCED: Template[] = [
  ["Old search results", "A customer search must not display an older request after the user has typed a newer query.", `function CustomerSearch() {\n  const [query, setQuery] = useState("");\n  const [customers, setCustomers] = useState([]);\n\n  useEffect(() => {\n    if (!query) {\n      setCustomers([]);\n      return;\n    }\n\n    searchCustomers(query).then((result) => {\n      setCustomers(result);\n    });\n  }, [query]);\n\n  return (\n    <>\n      <input value={query} onChange={(event) => setQuery(event.target.value)} />\n      <CustomerList customers={customers} />\n    </>\n  );\n}`, `function CustomerSearch() {\n  const [query, setQuery] = useState("");\n  const [customers, setCustomers] = useState([]);\n\n  useEffect(() => {\n    const controller = new AbortController();\n\n    if (!query) {\n      setCustomers([]);\n      return () => controller.abort();\n    }\n\n    searchCustomers(query, { signal: controller.signal })\n      .then(setCustomers)\n      .catch((error) => {\n        if (error.name !== "AbortError") throw error;\n      });\n\n    return () => controller.abort();\n  }, [query]);\n\n  return (\n    <>\n      <input value={query} onChange={(event) => setQuery(event.target.value)} />\n      <CustomerList customers={customers} />\n    </>\n  );\n}`, "Requests can finish out of order. Cancel the previous request during cleanup so stale results cannot replace the newest search."],
  ["Duplicate checkout", "A checkout button must not submit twice while the first payment request is still pending.", `function CheckoutButton({ cart }) {\n  const [status, setStatus] = useState("idle");\n\n  async function checkout() {\n    setStatus("loading");\n\n    await createPayment({\n      cartId: cart.id,\n      total: cart.total,\n    });\n\n    setStatus("success");\n  }\n\n  return (\n    <button onClick={checkout}>\n      {status === "loading" ? "Paying..." : "Pay now"}\n    </button>\n  );\n}`, `function CheckoutButton({ cart }) {\n  const [status, setStatus] = useState("idle");\n\n  async function checkout() {\n    if (status === "loading") return;\n\n    setStatus("loading");\n\n    try {\n      await createPayment({\n        cartId: cart.id,\n        total: cart.total,\n      });\n      setStatus("success");\n    } catch {\n      setStatus("error");\n    }\n  }\n\n  return (\n    <button disabled={status === "loading"} onClick={checkout}>\n      {status === "loading" ? "Paying..." : "Pay now"}\n    </button>\n  );\n}`, "The button remains active while the request is pending, which can create duplicate payments. Block and disable repeat submission."],
  ["Leaking subscription", "A live order feed must stop listening when the user leaves the page or selects another store.", `function OrderFeed({ storeId }) {\n  const [orders, setOrders] = useState([]);\n\n  useEffect(() => {\n    const subscription = subscribeToOrders(\n      storeId,\n      (order) => {\n        setOrders((current) => [order, ...current]);\n      },\n    );\n\n    subscription.connect();\n  }, [storeId]);\n\n  return (\n    <section>\n      <h2>Live orders</h2>\n      <OrderList orders={orders} />\n    </section>\n  );\n}`, `function OrderFeed({ storeId }) {\n  const [orders, setOrders] = useState([]);\n\n  useEffect(() => {\n    const subscription = subscribeToOrders(\n      storeId,\n      (order) => {\n        setOrders((current) => [order, ...current]);\n      },\n    );\n\n    subscription.connect();\n\n    return () => {\n      subscription.disconnect();\n    };\n  }, [storeId]);\n\n  return (\n    <section>\n      <h2>Live orders</h2>\n      <OrderList orders={orders} />\n    </section>\n  );\n}`, "Each store change creates another live subscription. Return a cleanup function to disconnect the old listener."],
];

function createChallenges(level: ChallengeLevel, startId: number, templates: Template[]): CodeReviewChallenge[] {
  return Array.from({ length: 50 }, (_, index) => {
    const [title, prompt, code, fixedCode, issue] = templates[index % templates.length];
    return {
      id: startId + index,
      level,
      title: `${title} ${Math.floor(index / templates.length) + 1}`,
      summary: "",
      prompt,
      code,
      issues: [issue],
      fixedCode,
    };
  });
}

export const REACT_CODE_REVIEW_CHALLENGES = [
  ...createChallenges("Basic", 4001, BASIC),
  ...createChallenges("Intermediate", 4051, INTERMEDIATE),
  ...createChallenges("Advanced", 4101, ADVANCED),
];
