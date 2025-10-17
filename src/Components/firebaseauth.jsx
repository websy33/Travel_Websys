// Import from clean firebase config to avoid conflicts
import { auth } from '../firebase';

// Re-export auth for backward compatibility
export { auth };
export default auth;