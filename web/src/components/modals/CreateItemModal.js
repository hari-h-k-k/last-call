'use client';
import {useState, useEffect} from 'react';
import Modal from '../ui/Modal';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import {useAuth} from '../../hooks/useAuth';
import {itemService} from '../../services/itemService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

export default function CreateItemModal({isOpen, onClose}) {
  const {isAuthenticated} = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    category: '',
    registrationClosingDate: null,
    auctionStartDate: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchData = async () => {
        try {
          const categoriesResponse = await itemService.getCategories();
          setCategories(categoriesResponse.subject || []);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const itemData = {
        title: formData.title,
        description: formData.description,
        startingPrice: parseFloat(formData.startingPrice),
        category: formData.category,
        registrationClosingDate: formData.registrationClosingDate,
        auctionStartDate: formData.auctionStartDate
      };

      await itemService.createItem(itemData);
      toast.success('Item created successfully');
      handleClose();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create item';
      setError(message);
      toast.error('Failed to create item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      startingPrice: '',
      category: '',
      registrationClosingDate: null,
      auctionStartDate: null
    });
    setError('');
    onClose();
  };

  if (!isAuthenticated && (showLoginModal || showSignupModal)) {
    return (
      <>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      </>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create Auction</h2>
        <p className="text-slate-400">List your item for auction</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder="Item Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-green-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-green-500 focus:outline-none h-24 resize-none"
            required
          />
        </div>

        <div>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Starting Price ($)"
            value={formData.startingPrice}
            onChange={(e) => setFormData({...formData, startingPrice: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-green-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-green-500 focus:outline-none"
            required
          >
            <option value="">Select Category</option>
            {categories.map(({ category }) => (
              <option key={category} value={category}>
                {category[0].toUpperCase() + category.slice(1).toLowerCase()}
              </option>
            ))}

          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Registration Closing</label>
            <DatePicker
              selected={formData.registrationClosingDate}
              onChange={(date) => setFormData({...formData, registrationClosingDate: date})}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Select date & time"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-green-500 focus:outline-none text-sm"
              wrapperClassName="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Auction Start</label>
            <DatePicker
              selected={formData.auctionStartDate}
              onChange={(date) => setFormData({...formData, auctionStartDate: date})}
              showTimeSelect
              dateFormat="MMM d, yyyy h:mm aa"
              placeholderText="Select date & time"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-green-500 focus:outline-none text-sm"
              wrapperClassName="w-full"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Creating...' : 'Create Auction'}
        </button>
      </form>
    </Modal>
  );
}