// Mock implementation for gradio_client.whl
export default {
  // Add any mock functions or properties needed
  version: '0.6.0',
  Client: class {
    constructor() {
      console.log('Gradio client mock initialized');
    }
    predict() {
      return Promise.resolve({ data: [] });
    }
  }
};
