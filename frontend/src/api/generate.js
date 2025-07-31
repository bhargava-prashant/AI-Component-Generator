import axios from 'axios';

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  return 'https://ai-component-generator-0akk.onrender.com/api';
};

export const generateComponent = async (formData, onProgress, onComplete, onError) => {
  try {
    // First try streaming approach
    try {
      const response = await fetch(`${getApiBaseUrl()}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
                             switch (data.status) {
                 case 'started':
                   onProgress && onProgress(data.message);
                   break;
                 case 'complete':
                   if (data.warning) {
                     console.warn('⚠️', data.warning);
                   }
                   onComplete && onComplete(data.code);
                   return data.code;
                 case 'error':
                   onError && onError(data.message);
                   throw new Error(data.message);
                 default:
                   console.log('Unknown status:', data);
               }
            } catch (error) {
              console.error('Error parsing SSE data:', error);
              // Continue processing other lines
            }
          }
        }
      }
    } catch (streamingError) {
      console.log('Streaming failed, trying fallback approach:', streamingError.message);
      
      // Fallback to regular API call
      const fallbackResponse = await generateComponentLegacy(formData);
      const responseData = fallbackResponse.data;
      
      if (responseData.code) {
        onComplete && onComplete(responseData.code);
        return responseData.code;
      } else {
        throw new Error('No code generated in fallback response');
      }
    }

  } catch (error) {
    console.error('Error in generateComponent:', error);
    onError && onError(error.message || 'Failed to generate component');
    throw error;
  }
};

// Fallback method for non-streaming requests (if needed)
export const generateComponentLegacy = async (formData) => {
  return await axios.post(`${getApiBaseUrl()}/generate/legacy`, formData, {
    timeout: 60000 // 60 second timeout
  });
};
