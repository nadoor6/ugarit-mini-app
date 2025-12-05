import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Text, 
  Title, 
  Image, 
  Button, 
  Spinner,
  Divider,
  Cell,
  Headline
} from '@telegram-apps/telegram-ui';
import { hapticFeedback } from '@tma.js/sdk';
import { TonConnectButton, useTonAddress, useTonWallet } from '@tonconnect/ui-react';
import { supabase } from '../lib/supabase';

interface ListingDetail {
  id: string;
  price: number;
  status: string;
  created_at: string;
  collectible: {
    id: string;
    title: string;
    description: string;
    media_url: string;
    media_type: string;
    attributes: any;
  };
  seller: {
    id: string;
    username: string;
    telegram_id: number;
    first_name?: string;
    last_name?: string;
  };
}

export function ListingDetail() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  
  const userFriendlyAddress = useTonAddress();
  const wallet = useTonWallet();

  const fetchListingDetail = async () => {
    if (!listingId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id, 
          price,
          status,
          created_at,
          collectibles!inner (
            id,
            title,
            description,
            media_url,
            media_type,
            attributes,
            created_at
          ),
          profiles!seller_id (
            id,
            telegram_id,
            username,
            first_name,
            last_name
          )
        `)
        .eq('id', listingId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Listing not found');

      const listingData: ListingDetail = {
        id: data.id,
        price: data.price,
        status: data.status,
        created_at: data.created_at,
        collectible: data.collectibles[0],
        seller: data.profiles[0]
      };

      setListing(listingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listing details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!listing || !wallet) return;
    
    try {
      setPurchasing(true);
      
      // Haptic feedback
      if (hapticFeedback) {
        hapticFeedback.impactOccurred('medium');
      }

      console.log('Initiating purchase for listing:', listing.id);
      console.log('Price:', listing.price, 'TON');
      console.log('Buyer address:', userFriendlyAddress);
      
      // TODO: Implement actual TON transaction
      // You'll need to:
      // 1. Send transaction via TON Connect
      // 2. Verify on-chain confirmation
      // 3. Update database
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (hapticFeedback) {
        hapticFeedback.notificationOccurred('success');
      }
      
      alert(`Purchase successful! You bought "${listing.collectible.title}" for ${listing.price} TON.`);
      
    } catch (err) {
      console.error('Purchase failed:', err);
      
      if (hapticFeedback) {
        hapticFeedback.notificationOccurred('error');
      }
      
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  useEffect(() => {
    fetchListingDetail();
  }, [listingId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Spinner size="l" />
        <Text style={{ marginTop: '16px' }}>Loading listing details...</Text>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <Headline>Error</Headline>
          <Text color="red" style={{ marginBottom: '16px' }}>
            {error || 'Listing not found'}
          </Text>
          <Button onClick={() => navigate('/')} size="m">
            Back to Marketplace
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Button 
        onClick={() => navigate(-1)}
        size="s"
        mode="plain"
        style={{ marginBottom: '16px' }}
      >
        ← Back
      </Button>

      <Card style={{ marginBottom: '16px', padding: '0', overflow: 'hidden' }}>
        <Image
          src={listing.collectible.media_url}
          alt={listing.collectible.title}
          style={{
            width: '100%',
            maxHeight: '300px',
            objectFit: 'cover'
          }}
        />
      </Card>

      <div style={{ marginBottom: '20px' }}>
        <Title level="1" style={{ marginBottom: '8px' }}>
          {listing.collectible.title}
        </Title>
        <Headline style={{ color: 'var(--tg-theme-link-color)' }}>
          {listing.price} TON
        </Headline>
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <Title level="3" style={{ marginBottom: '12px' }}>Description</Title>
        <Text>
          {listing.collectible.description || 'No description provided.'}
        </Text>
      </Card>

      <Card style={{ marginBottom: '24px' }}>
        <Title level="3" style={{ marginBottom: '12px' }}>Seller</Title>
        <Cell
          subtitle={`Telegram ID: ${listing.seller.telegram_id}`}
        >
          {listing.seller.username || `${listing.seller.first_name} ${listing.seller.last_name}`}
        </Cell>
      </Card>

      <Divider style={{ marginBottom: '24px' }} />

      <div>
        <Title level="3" style={{ marginBottom: '16px' }}>Purchase</Title>
        
        {wallet ? (
          <div>
            <Text style={{ marginBottom: '12px' }}>
              Connected wallet: {userFriendlyAddress.slice(0, 8)}...{userFriendlyAddress.slice(-6)}
            </Text>
            <Button
              size="l"
              stretched
              loading={purchasing}
              onClick={handlePurchase}
              disabled={listing.status !== 'active' || purchasing}
            >
              {purchasing ? 'Processing...' : `Buy Now for ${listing.price} TON`}
            </Button>
            
            {listing.status !== 'active' && (
              <Text color="red" style={{ marginTop: '8px', textAlign: 'center' }}>
                This item is no longer available
              </Text>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Text style={{ marginBottom: '16px' }}>
              Connect your TON wallet to purchase this item
            </Text>
            <TonConnectButton style={{ marginBottom: '16px' }} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Text color="var(--tg-theme-hint-color)" style={{ fontSize: '12px' }}>
          Listed on {new Date(listing.created_at).toLocaleDateString()}
        </Text>
      </div>
    </div>
  );
}