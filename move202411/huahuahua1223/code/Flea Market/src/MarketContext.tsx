import React, { createContext, useContext, useState } from 'react';

interface MarketContextType {
  objectId: string | null;
  setObjectId: (id: string) => void;
  marketIds: string[];
  addMarketId: (id: string) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC = ({ children }) => {
  const [objectId, setObjectId] = useState<string | null>(null);
  const [marketIds, setMarketIds] = useState<string[]>([]);

  const addMarketId = (id: string) => {
    if (!marketIds.includes(id)) {
      setMarketIds([...marketIds, id]);
    }
  };

  return (
    <MarketContext.Provider value={{ objectId, setObjectId, marketIds, addMarketId }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}; 