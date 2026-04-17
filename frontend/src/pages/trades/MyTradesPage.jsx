import { useQuery } from "@tanstack/react-query";
import { tradesApi } from "../../api/services";
import { TradeCard } from "../../components/trades/TradeCard";
import { SectionHeader } from "../../components/shared/SectionHeader";

export function MyTradesPage() {
  const { data = [] } = useQuery({ queryKey: ["my-trades"], queryFn: tradesApi.myTrades });
  return (
    <div>
      <SectionHeader eyebrow="My Exchange Board" title="Listings you own" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((trade) => <TradeCard key={trade._id} trade={trade} />)}
      </div>
    </div>
  );
}
