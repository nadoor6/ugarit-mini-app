import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT
import { Card, Text, Title, Image, Button, Spinner } from '@telegram-apps/telegram-ui';
import { hapticFeedback } from '@tma.js/sdk';
import { supabase } from '../lib/supabase';

interface Listing {
  id: string;
  price: number;
  collectible: {
    title: string;
    media_url: string;
    media_type: string;
  };
  seller: {
    username: string;
  };
}

export function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Now properly initialized

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id, 
          price,
          collectibles!inner (title, media_url, media_type),
          profiles!seller_id (username)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedListings: Listing[] = (data || []).map(item => ({
        id: item.id,
        price: item.price,
        collectible: item.collectibles[0],
        seller: item.profiles[0]
      }));

      setListings(mappedListings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (hapticFeedback && typeof hapticFeedback.impactOccurred === 'function') {
      hapticFeedback.impactOccurred(type);
    } else {
      console.log('Haptic feedback not available (running in browser)');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spinner size="l" />
        <Text style={{ marginTop: '10px' }}>Loading collectibles...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Text color="red">Error: {error}</Text>
        <Button 
          onClick={() => {
            triggerHaptic('medium');
            fetchListings();
          }} 
          style={{ marginTop: '10px' }}
        >
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Title level="2" style={{ marginBottom: '20px' }}>
        Marketplace
      </Title>

      {listings.length === 0 ? (
        <Card>
          <Text>No listings available yet. Be the first to sell!</Text>
        </Card>
      ) : (
        listings.map((listing) => (
          <Card 
            key={listing.id} 
            style={{ 
              marginBottom: '16px',
              cursor: 'pointer'
            }}
            onClick={() => {
              triggerHaptic('light');
              navigate(`/listing/${listing.id}`); // FIXED: Using the correct 'listing' variable
            }}
          >
            <div style={{ display: 'flex', gap: '16px' }}>
              <Image
                src={listing.collectible.media_url}
                alt={listing.collectible.title}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
              
              <div style={{ flex: 1 }}>
                <Title level="3" style={{ margin: '0 0 8px 0' }}>
                  {listing.collectible.title}
                </Title>
                <Text color="var(--tg-theme-hint-color)">
                  By @{listing.seller.username}
                </Text>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px'
                }}>
                  <Text weight="2" style={{ fontSize: '18px' }}>
                    {listing.price} TON
                  </Text>
                  <Button 
                    size="s"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('medium');
                      console.log('Buy clicked for:', listing.id);
                    }}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}