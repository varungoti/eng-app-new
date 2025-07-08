// Mock implementation for @self/spa
export default {
  // Add any mock functions or properties needed
  mount: (element) => {
    console.log('Gradio SPA mock mounted');
    return {
      unmount: () => console.log('Gradio SPA mock unmounted')
    };
  }
};
