import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cell,
  Input, 
  Textarea, 
  Button, 
  Card,
  Title,
  Spinner
} from '@telegram-apps/telegram-ui';
import { hapticFeedback } from '@tma.js/sdk';
import { useSignal } from '@tma.js/sdk-react';
import { initData } from '@tma.js/sdk-react';
import { supabase } from '../lib/supabase';

export function CreateListingForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    media_url: 'https://placehold.co/600x400/png',
    media_type: 'image'
  });

  const userData = useSignal(initData.state);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?.user?.id) {
      alert('Please log in with Telegram first');
      return;
    }

    try {
      setLoading(true);
      
      // 1. Get or create user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('telegram_id', userData.user.id)
        .single();

      if (!profile) {
        alert('User profile not found. Please open the app from Telegram.');
        return;
      }

      // 2. Create collectible
      const { data: collectible, error: collectibleError } = await supabase
        .from('collectibles')
        .insert({
          owner_id: profile.id,
          title: formData.title,
          description: formData.description,
          media_url: formData.media_url,
          media_type: formData.media_type
        })
        .select()
        .single();

      if (collectibleError) throw collectibleError;

      // 3. Create listing
      const { error: listingError } = await supabase
        .from('listings')
        .insert({
          collectible_id: collectible.id,
          seller_id: profile.id,
          price: parseFloat(formData.price),
          status: 'active'
        });

      if (listingError) throw listingError;

      // Haptic feedback
      if (hapticFeedback) {
        hapticFeedback.notificationOccurred('success');
      }

      alert('Listing created successfully!');
      navigate('/');
      
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button 
        onClick={() => navigate('/')}
        size="s"
        mode="plain"
        style={{ marginBottom: '16px' }}
      >
        ← Back to Marketplace
      </Button>

      <Card style={{ padding: '20px' }}>
        <Title level="2" style={{ marginBottom: '24px' }}>
          Create New Listing
        </Title>

        <form onSubmit={handleSubmit}>
          {/* Title field */}
          <Cell
            before="Title *"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Rare Telegram Sticker Pack"
              required
            />
          </Cell>

          {/* Description field */}
          <Cell
            before="Description"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your collectible..."
              rows={3}
            />
          </Cell>

          {/* Price field */}
          <Cell
            before="Price (TON) *"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="10.5"
              step="0.1"
              min="0.1"
              required
            />
          </Cell>

          {/* Image URL field */}
          <Cell
            before="Image URL"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Input
              value={formData.media_url}
              onChange={(e) => handleChange('media_url', e.target.value)}
              placeholder="https://example.com/image.png"
            />
            <div style={{ marginTop: '8px' }}>
              <img 
                src={formData.media_url} 
                alt="Preview" 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid var(--tg-theme-hint-color)'
                }}
              />
            </div>
          </Cell>

          <Button
            type="submit"
            size="l"
            stretched
            loading={loading}
            disabled={!formData.title || !formData.price || loading}
            style={{ marginTop: '24px' }}
          >
            {loading ? <Spinner size="s" /> : 'Create Listing'}
          </Button>
        </form>
      </Card>
    </div>
  );
}