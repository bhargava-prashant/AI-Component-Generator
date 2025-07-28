
const isAuthenticated = (req, res, next) => {
  console.log("🔍 Session ID:", req.sessionID);
  console.log("🔍 Session Object:", req.session);
  console.log("🔍 Passport User ID:", req.session?.passport?.user);
  console.log("🔍 req.user:", req.user);
  console.log("🔍 req.isAuthenticated():", req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    console.log("✅ User is authenticated:", req.user);
    
    // Update user's last active timestamp
    if (req.user && req.user.updateLastActive) {
      req.user.updateLastActive().catch(err => {
        console.error('❌ Error updating last active timestamp:', err);
      });
    }
    
    return next();
  }
  
  console.log("❌ User not authenticated");
  res.status(401).json({ message: 'Unauthorized' });
};

const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      message: 'Authentication required',
      redirectTo: '/login'
    });
  }
  next();
};

module.exports = { isAuthenticated, requireAuth };
