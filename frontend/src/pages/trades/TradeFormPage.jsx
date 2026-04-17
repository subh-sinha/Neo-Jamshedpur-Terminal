import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { tradesApi } from "../../api/services";
import { Panel } from "../../components/shared/Panel";
import { Button } from "../../components/shared/Button";

export function TradeFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    itemType: "physical",
    expectedExchange: "",
    condition: "",
    quantity: 1,
    sector: "",
    imageUrls: ""
  });

  const mutation = useMutation({
    mutationFn: tradesApi.create,
    onSuccess: (data) => navigate(`/trades/${data._id}`)
  });

  const inputFields = [
    ["title", "Listing title"],
    ["description", "Describe the item or resource"],
    ["category", "Category"],
    ["itemType", "physical / digital / service"],
    ["expectedExchange", "Expected exchange"],
    ["condition", "Condition"],
    ["quantity", "Quantity"],
    ["sector", "Sector / zone"],
    ["imageUrls", "Image URL(s), comma separated"]
  ];

  return (
    <Panel>
      <div className="text-xl font-semibold">Create trade listing</div>
      <div className="mt-2 text-sm text-slate-400">Add one or more image URLs so buyers can inspect the trade object before starting negotiations.</div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {inputFields.map(([field, placeholder]) => (
          <input
            key={field}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            value={form[field]}
            onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
            placeholder={placeholder}
          />
        ))}
      </div>
      {form.imageUrls ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <img src={form.imageUrls.split(",")[0].trim()} alt="Trade preview" className="h-56 w-full object-cover" />
        </div>
      ) : null}
      {mutation.error ? (
        <div className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {mutation.error.response?.data?.message || "Trade publishing failed."}
        </div>
      ) : null}
      <Button
        className="mt-6"
        onClick={() =>
          mutation.mutate({
            ...form,
            quantity: Number(form.quantity),
            images: form.imageUrls
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          })
        }
      >
        Publish listing
      </Button>
    </Panel>
  );
}
