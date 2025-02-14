import React, { useState } from 'react';
import axios from 'axios';
import './DealList.css';

const DealList = ({ deals, onRefresh }) => {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [newVersion, setNewVersion] = useState({
    useCases: '',
    roadblocks: '',
    solutionRecommendations: '',
    additionalComments: '',
    editedBy: '',
    currentStage: ''
  });

  const stages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const handleVersionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/deals/${selectedDeal.id}/versions`, {
        version: newVersion,
        currentStage: newVersion.currentStage || selectedDeal.currentStage
      });

      setNewVersion({
        useCases: '',
        roadblocks: '',
        solutionRecommendations: '',
        additionalComments: '',
        editedBy: '',
        currentStage: ''
      });

      onRefresh();
      setSelectedDeal(null);
    } catch (error) {
      console.error('Error updating deal:', error);
      alert('Error updating deal. Please try again.');
    }
  };

  return (
    <div className="deal-list">
      <h2>Active Deals</h2>
      
      <div className="deals-grid">
        {deals.map(deal => (
          <div key={deal.id} className="deal-card" onClick={() => setSelectedDeal(deal)}>
            <h3>{deal.customer_name}</h3>
            <div className="deal-info">
              <p><strong>Deal ID:</strong> {deal.deal_id}</p>
              <p><strong>Stage:</strong> {deal.current_stage}</p>
              <p><strong>TA Owner:</strong> {deal.ta_owner}</p>
              <p><strong>Versions:</strong> {deal.versions ? deal.versions.length : 0}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedDeal && (
        <div className="deal-detail-modal">
          <div className="modal-content">
            <h3>Deal Details: {selectedDeal.customer_name}</h3>
            
            <div className="version-history">
              <h4>Version History</h4>
              {selectedDeal.versions && selectedDeal.versions.map((version) => (
                <div key={version.id} className="version-entry">
                  <h5>Version {version.version_number} - {new Date(version.timestamp).toLocaleString()}</h5>
                  <p><strong>Use Cases:</strong> {version.use_cases}</p>
                  <p><strong>Roadblocks:</strong> {version.roadblocks}</p>
                  <p><strong>Solutions:</strong> {version.solution_recommendations}</p>
                  {version.additional_comments && (
                    <p><strong>Comments:</strong> {version.additional_comments}</p>
                  )}
                  <p><strong>Edited By:</strong> {version.edited_by}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleVersionSubmit} className="new-version-form">
              <h4>Add New Version</h4>
              
              <div className="form-group">
                <label>Current Stage:</label>
                <select
                  value={newVersion.currentStage}
                  onChange={(e) => setNewVersion({...newVersion, currentStage: e.target.value})}
                >
                  <option value="">Keep Current Stage</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Use Cases:</label>
                <textarea
                  value={newVersion.useCases}
                  onChange={(e) => setNewVersion({...newVersion, useCases: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Roadblocks:</label>
                <textarea
                  value={newVersion.roadblocks}
                  onChange={(e) => setNewVersion({...newVersion, roadblocks: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Solution Recommendations:</label>
                <textarea
                  value={newVersion.solutionRecommendations}
                  onChange={(e) => setNewVersion({...newVersion, solutionRecommendations: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Additional Comments:</label>
                <textarea
                  value={newVersion.additionalComments}
                  onChange={(e) => setNewVersion({...newVersion, additionalComments: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Edited By:</label>
                <input
                  type="text"
                  value={newVersion.editedBy}
                  onChange={(e) => setNewVersion({...newVersion, editedBy: e.target.value})}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setSelectedDeal(null)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealList; 