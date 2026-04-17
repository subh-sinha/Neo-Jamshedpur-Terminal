import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { tradesApi } from "../../api/services";
import { TradeCard } from "../../components/trades/TradeCard";
import { Button } from "../../components/shared/Button";
import { SectionHeader } from "../../components/shared/SectionHeader";

export function TradesPage() {
  const { data = [] } = useQuery({ queryKey: ["trades"], queryFn: () => tradesApi.list({}) });
  return (
    <div>
      <SectionHeader eyebrow="Resource Exchange" title="Marketplace and negotiation threads" action={<Link to="/trades/create"><Button>List a trade</Button></Link>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((trade) => <TradeCard key={trade._id} trade={trade} />)}
      </div>
    </div>
  );
}
