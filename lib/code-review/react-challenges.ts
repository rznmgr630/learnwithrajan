import type { CodeReviewChallenge } from "@/lib/code-review/challenges";

const FEATURES = ["CustomerCard", "OrderList", "InvoicePanel", "ProjectBoard", "TicketQueue", "BookingForm", "SubscriptionPage", "ShipmentTracker", "ProductGrid", "ReportTable", "ProfileEditor", "CommentThread", "DocumentEditor", "CampaignBuilder", "VendorPortal", "WorkspaceHome", "MemberDirectory", "CoursePlayer", "LessonChecklist", "ReceiptView", "PaymentForm", "RefundPanel", "PayoutHistory", "ContractEditor", "TemplateGallery", "AssetBrowser", "PhotoAlbum", "MessageInbox", "NotificationCenter", "TaskBoard", "MilestoneView", "EventCalendar", "VenueMap", "CouponForm", "GiftCardBalance", "WishlistPanel", "ReviewFeed", "ArticleReader", "PodcastPlayer", "PlaylistEditor", "RecipePlanner", "IngredientList", "DonationForm", "VolunteerRoster", "AppointmentCalendar", "PatientPortal", "PrescriptionList", "WarrantyClaim", "ClaimTracker", "ImportStatus"] as const;

function challenge(level: "Basic" | "Intermediate" | "Advanced", feature: string, index: number): CodeReviewChallenge {
  const id = (level === "Basic" ? 4001 : level === "Intermediate" ? 4051 : 4101) + index;
  const mode = index % 5;
  const code = level === "Basic"
    ? mode === 0 ? `function ${feature}() {\n  let count = 0;\n  function add() { count += 1; }\n  return <button onClick={add}>{count}</button>;\n}`
      : mode === 1 ? `function ${feature}({ items }) {\n  return items.map((item, index) => <Row key={index} item={item} />);\n}`
      : mode === 2 ? `function ${feature}() {\n  function submit() { save(); }\n  return <form onSubmit={submit}><button>Save</button></form>;\n}`
      : mode === 3 ? `function ${feature}({ value }) {\n  return <input value={value} />;\n}`
      : `function ${feature}({ title }) {\n  return <h2>{title.toUpperCase()}</h2>;\n}`
    : level === "Intermediate"
      ? mode === 0 ? `function ${feature}() {\n  const [count, setCount] = useState(0);\n  function addTwo() { setCount(count + 1); setCount(count + 1); }\n  return <button onClick={addTwo}>{count}</button>;\n}`
      : mode === 1 ? `function ${feature}({ id }) {\n  const [data, setData] = useState(null);\n  useEffect(() => { load(id).then(setData); }, []);\n  return <View data={data} />;\n}`
      : mode === 2 ? `function ${feature}() {\n  const [state, setState] = useState({ settings: { enabled: true } });\n  function disable() { state.settings.enabled = false; setState(state); }\n  return <button onClick={disable}>Disable</button>;\n}`
      : mode === 3 ? `function ${feature}({ items }) {\n  return items.sort((left, right) => left.name.localeCompare(right.name)).map((item) => <Row key={item.id} item={item} />);\n}`
      : `function ${feature}({ onSave }) {\n  useEffect(() => { window.addEventListener("save", onSave); }, [onSave]);\n  return null;\n}`
      : mode === 0 ? `function ${feature}({ query }) {\n  const [items, setItems] = useState([]);\n  useEffect(() => { search(query).then(setItems); }, [query]);\n  return <List items={items} />;\n}`
      : mode === 1 ? `function ${feature}({ request }) {\n  const [status, setStatus] = useState("idle");\n  async function submit() { setStatus("loading"); await request(); setStatus("done"); }\n  return <button onClick={submit}>Submit</button>;\n}`
      : mode === 2 ? `function ${feature}({ channel }) {\n  useEffect(() => { channel.subscribe((item) => console.log(item)); }, [channel]);\n  return <section>Live updates</section>;\n}`
      : mode === 3 ? `function ${feature}({ account }) {\n  return <pre>{JSON.stringify(account)}</pre>;\n}`
      : `function ${feature}({ token }) {\n  useEffect(() => { fetch("/api/data", { headers: { Authorization: token } }); }, []);\n  return null;\n}`;
  const fixedCode = code.replace("let count = 0;", "const [count, setCount] = useState(0);").replace("function add() { count += 1; }", "function add() { setCount((current) => current + 1); }").replace("key={index}", "key={item.id}").replace("function submit() { save(); }", "function submit(event) { event.preventDefault(); save(); }").replace("<input value={value} />", "<input value={value} onChange={() => {}} />").replace("title.toUpperCase()", "title?.toUpperCase() ?? \"Untitled\"").replace("setCount(count + 1); setCount(count + 1);", "setCount((current) => current + 1); setCount((current) => current + 1);").replace("}, []);\n  return <View", "}, [id]);\n  return <View").replace("state.settings.enabled = false; setState(state);", "setState((current) => ({ ...current, settings: { ...current.settings, enabled: false } }));").replace("return items.sort", "return [...items].sort").replace("useEffect(() => { window.addEventListener(\"save\", onSave); }, [onSave]);", "useEffect(() => { window.addEventListener(\"save\", onSave); return () => window.removeEventListener(\"save\", onSave); }, [onSave]);").replace("search(query).then(setItems);", "const controller = new AbortController(); search(query, { signal: controller.signal }).then(setItems); return () => controller.abort();").replace("return <button onClick={submit}>", "return <button disabled={status === \"loading\"} onClick={submit}>").replace("}, [channel]);", "const unsubscribe = channel.subscribe((item) => console.log(item)); return unsubscribe; }, [channel]);").replace("JSON.stringify(account)", "JSON.stringify({ id: account.id, name: account.name })").replace("}, []);\n  return null;", "}, [token]);\n  return null;");
  return { id, level, title: `${feature} ${level} review`, summary: "", prompt: `Review this ${feature} component for a real React state, effect, rendering, or data-exposure bug.`, code, issues: [`The ${feature} component has a lifecycle or state boundary that needs an explicit React-safe implementation.`], fixedCode };
}

export const REACT_CODE_REVIEW_CHALLENGES: CodeReviewChallenge[] = [
  ...FEATURES.map((feature, index) => challenge("Basic", feature, index)),
  ...FEATURES.map((feature, index) => challenge("Intermediate", feature, index)),
  ...FEATURES.map((feature, index) => challenge("Advanced", feature, index)),
];
