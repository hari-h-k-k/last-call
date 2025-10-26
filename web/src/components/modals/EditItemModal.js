'use client';
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { itemService } from '../../services/itemService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

export default function EditItemModal({ isOpen, onClose, item, onUpdate, onDelete }) {
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
    const fetchCategories = async () => {
      try {
        const response = await itemService.getCategories();
        setCategories(response.subject || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        startingPrice: item.startingPrice.toString(),
        category: item.category,
        registrationClosingDate: new Date(item.registrationClosingDate),
        auctionStartDate: new Date(item.auctionStartDate)
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      await itemService.updateItem(item.id, itemData);
      onUpdate();
      handleClose();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update item';
      setError(message);
      toast.error('Failed to update item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleDelete = async () => {
    try {
      await itemService.deleteItem(item.id);
      toast.success('Item deleted successfully!');
      onClose();
      window.location.href = '/browse';
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Edit Item</h2>
        <p className="text-slate-400">Update your auction item details</p>
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
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none h-24 resize-none"
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
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
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
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none text-sm"
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
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none text-sm"
              wrapperClassName="w-full"
              required
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update Item'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-6 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </form>
    </Modal>
  );
}