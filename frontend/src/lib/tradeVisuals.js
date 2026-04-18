const tradeImageByTitle = {
  "Portable Fusion Cell Pack": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "Encrypted Mapping Dataset": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
};

const tradeImageByCategory = {
  energy: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80",
  data: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  hardware: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
  supplies: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  digital: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  services: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
};

export function getTradePreviewImage(trade) {
  if (trade?.images?.length) return trade.images[0];
  if (tradeImageByTitle[trade?.title]) return tradeImageByTitle[trade.title];
  return tradeImageByCategory[String(trade?.category || "").toLowerCase()] || null;
}
