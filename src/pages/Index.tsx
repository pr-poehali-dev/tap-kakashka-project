import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  icon: string;
  owned: number;
}

const Index = () => {
  const [coins, setCoins] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0);
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [poopScale, setPoopScale] = useState(1);

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 'cursor', name: 'Туалетная щетка', cost: 15, multiplier: 0.1, icon: 'Brush', owned: 0 },
    { id: 'toilet', name: 'Золотой унитаз', cost: 100, multiplier: 1, icon: 'Home', owned: 0 },
    { id: 'factory', name: 'Какашко фабрика', cost: 500, multiplier: 5, icon: 'Factory', owned: 0 },
    { id: 'farm', name: 'Какашко ферма', cost: 2000, multiplier: 20, icon: 'Tractor', owned: 0 },
    { id: 'mine', name: 'Какашко шахта', cost: 10000, multiplier: 100, icon: 'Mountain', owned: 0 },
  ]);

  useEffect(() => {
    if (coinsPerSecond > 0) {
      const interval = setInterval(() => {
        setCoins(prev => prev + coinsPerSecond / 10);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [coinsPerSecond]);

  const handlePoopClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCoins(prev => prev + clickPower);
    
    const effectId = Date.now() + Math.random();
    setClickEffects(prev => [...prev, { id: effectId, x, y }]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== effectId));
    }, 1000);

    setPoopScale(1.2);
    setTimeout(() => setPoopScale(1), 100);
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    if (coins >= upgrade.cost) {
      setCoins(prev => prev - upgrade.cost);
      
      setUpgrades(prev => prev.map(u => {
        if (u.id === upgrade.id) {
          const newOwned = u.owned + 1;
          const newCost = Math.floor(u.cost * 1.15);
          return { ...u, owned: newOwned, cost: newCost };
        }
        return u;
      }));

      setCoinsPerSecond(prev => prev + upgrade.multiplier);
      
      toast.success(`Куплено: ${upgrade.name}! 🎉`, {
        description: `+${upgrade.multiplier} кашко/сек`
      });
    } else {
      toast.error('Недостаточно Кашко Коинов! 💩');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num).toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        <div className="text-center mb-8 animate-bounce-in">
          <h1 className="text-6xl md:text-7xl font-bold text-purple-600 mb-2 drop-shadow-lg">
            💩 Кашко Кликер
          </h1>
          <p className="text-xl text-purple-700 font-semibold">Тапай какашку, зарабатывай коины!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white/90 backdrop-blur shadow-2xl border-4 border-purple-300">
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg mb-4">
                  <span className="text-4xl font-bold">{formatNumber(coins)}</span>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-purple-600 font-semibold text-lg">
                  {coinsPerSecond > 0 && `+${formatNumber(coinsPerSecond)}/сек`}
                </p>
              </div>

              <div className="flex justify-center mb-6 relative">
                <div 
                  className="cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-float relative"
                  onClick={handlePoopClick}
                  style={{ transform: `scale(${poopScale})` }}
                >
                  <div className="text-[200px] leading-none select-none filter drop-shadow-2xl">
                    💩
                  </div>
                  
                  {clickEffects.map(effect => (
                    <div
                      key={effect.id}
                      className="absolute text-4xl font-bold text-yellow-400 animate-sparkle pointer-events-none"
                      style={{
                        left: effect.x,
                        top: effect.y,
                      }}
                    >
                      +{clickPower}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 font-semibold">
                  Сила клика: <span className="text-purple-600 text-xl font-bold">{clickPower}</span>
                </p>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-white/90 backdrop-blur shadow-2xl border-4 border-pink-300 max-h-[600px] overflow-y-auto">
              <h2 className="text-3xl font-bold text-pink-600 mb-6 flex items-center gap-2">
                <Icon name="ShoppingCart" size={32} />
                Магазин
              </h2>
              
              <div className="space-y-3">
                {upgrades.map((upgrade) => (
                  <Button
                    key={upgrade.id}
                    onClick={() => buyUpgrade(upgrade)}
                    disabled={coins < upgrade.cost}
                    className={`w-full p-4 h-auto flex flex-col items-start gap-2 transition-all ${
                      coins >= upgrade.cost 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon name={upgrade.icon as any} size={24} />
                      <div className="flex-1 text-left">
                        <div className="font-bold text-lg">{upgrade.name}</div>
                        <div className="text-sm opacity-90">+{upgrade.multiplier} кашко/сек</div>
                      </div>
                      {upgrade.owned > 0 && (
                        <div className="bg-white/30 px-2 py-1 rounded-full text-sm font-bold">
                          {upgrade.owned}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-yellow-300 font-bold">
                      <span>{formatNumber(upgrade.cost)}</span>
                      <span>💰</span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Card className="inline-block px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-400 border-4 border-orange-300 shadow-lg">
            <p className="text-white font-bold text-xl">
              🔥 Всего заработано: {formatNumber(coins)} Кашко Коинов! 🔥
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
