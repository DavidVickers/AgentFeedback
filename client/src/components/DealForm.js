import React, { useState } from 'react';
import axios from 'axios';
import './DealForm.css';

const DealForm = ({ onDealAdded }) => {
  const [formData, setFormData] = useState({
    dealId: '',
    customerName: '',
    currentStage: 'Discovery',
    TAOwner: '',
    useCases: '',
    roadblocks: '',
    solutionRecommendations: '',
    additionalComments: '',
    editedBy: ''
  });

  const stages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/deals', {
        dealId: formData.dealId,
        customerName: formData.customerName,
        currentStage: formData.currentStage,
        TAOwner: formData.TAOwner,
        version: {
          useCases: formData.useCases,
          roadblocks: formData.roadblocks,
          solutionRecommendations: formData.solutionRecommendations,
          additionalComments: formData.additionalComments,
          editedBy: formData.editedBy
        }
      });
      
      setFormData({
        dealId: '',
        customerName: '',
        currentStage: 'Discovery',
        TAOwner: '',
        useCases: '',
        roadblocks: '',
        solutionRecommendations: '',
        additionalComments: '',
        editedBy: ''
      });
      
      onDealAdded();
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Error creating deal. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="deal-form">
      <h2>New Deal Entry</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="dealId">Deal ID:</label>
          <input
            id="dealId"
            name="dealId"
            type="text"
            value={formData.dealId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerName">Customer Name:</label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentStage">Current Stage:</label>
          <select
            id="currentStage"
            name="currentStage"
            value={formData.currentStage}
            onChange={handleChange}
            required
          >
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="TAOwner">TA Owner:</label>
          <input
            id="TAOwner"
            name="TAOwner"
            type="text"
            value={formData.TAOwner}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-full-width">
        <div className="form-group">
          <label htmlFor="useCases">Use Cases:</label>
          <textarea
            id="useCases"
            name="useCases"
            value={formData.useCases}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="roadblocks">Roadblocks:</label>
          <textarea
            id="roadblocks"
            name="roadblocks"
            value={formData.roadblocks}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="solutionRecommendations">Solution Recommendations:</label>
          <textarea
            id="solutionRecommendations"
            name="solutionRecommendations"
            value={formData.solutionRecommendations}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalComments">Additional Comments:</label>
          <textarea
            id="additionalComments"
            name="additionalComments"
            value={formData.additionalComments}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="editedBy">Edited By:</label>
          <input
            id="editedBy"
            name="editedBy"
            type="text"
            value={formData.editedBy}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button type="submit" className="submit-button">Create Deal</button>
    </form>
  );
};

export default DealForm; 