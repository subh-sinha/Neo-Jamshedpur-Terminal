import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { tradesApi } from "../../api/services";
import { TradeCard } from "../../components/trades/TradeCard";
import { Button } from "../../components/shared/Button";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { CardSkeleton } from "../../components/shared/CardSkeleton";

export function TradesPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ["trades"], queryFn: () => tradesApi.list({}) });
  return (
    <div>
      <SectionHeader eyebrow="Resource Exchange" title="Marketplace and negotiation threads" action={<Link to="/trades/create"><Button>List a trade</Button></Link>} />
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {data.map((trade) => (
            <motion.div 
              key={trade._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }}
            >
              <TradeCard trade={trade} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
