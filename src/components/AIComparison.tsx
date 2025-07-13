import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, Loader } from 'lucide-react';

interface AIComparisonProps {
  dispatchPhoto: string;
  returnPhoto: string;
  onResult: (similarity: number, accepted: boolean) => void;
  onClose: () => void;
}

export function AIComparison({ dispatchPhoto, returnPhoto, onResult, onClose }: AIComparisonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [similarity, setSimilarity] = useState(0);
  const [result, setResult] = useState<'accepted' | 'rejected' | null>(null);

  useEffect(() => {
    // Simulate AI processing
    const analyzePhotos = async () => {
      setIsAnalyzing(true);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate AI comparison result (random between 60-95%)
      const simulatedSimilarity = Math.floor(Math.random() * 35) + 60;
      const accepted = simulatedSimilarity >= 80;
      
      setSimilarity(simulatedSimilarity);
      setResult(accepted ? 'accepted' : 'rejected');
      setIsAnalyzing(false);
    };

    analyzePhotos();
  }, []);

  const handleConfirm = () => {
    onResult(similarity, result === 'accepted');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">AI Photo Comparison</h2>
            <p className="text-gray-600 mt-2">
              Analyzing photos to determine if the return is valid
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Before Dispatch</h3>
              <img
                src={dispatchPhoto}
                alt="Dispatch"
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">After Return</h3>
              <img
                src={returnPhoto}
                alt="Return"
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          </div>

          {isAnalyzing ? (
            <div className="text-center py-8">
              <Loader className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">AI is analyzing the photos...</p>
              <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full mb-4 ${
                result === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result === 'accepted' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                {result === 'accepted' ? 'Return Accepted' : 'Return Rejected'}
              </div>
              
              <div className="mb-6">
                <p className="text-2xl font-bold text-gray-900 mb-2">{similarity}% Match</p>
                <p className="text-gray-600">
                  {result === 'accepted' 
                    ? 'The photos show sufficient similarity. Return is valid.' 
                    : 'The photos show significant differences. Return is not valid.'}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                    result === 'accepted' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm Result
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}