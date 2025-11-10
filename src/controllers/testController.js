// Health check
export const healthCheck = (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Track App Backend API is running'
  });
};

// GET test endpoint
export const getHello = (req, res) => {
  res.json({
    message: 'Hello from Track App Backend!'
  });
};

// POST test endpoint
export const postHello = (req, res) => {
  const { name, message } = req.body;

  res.json({
    name: name || 'Anonymous',
    message: message || 'No message provided'
  });
};
