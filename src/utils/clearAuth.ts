export const clearUserData = () => {
    localStorage.removeItem('userDetails');
    // Don't try to manually clear HTTP-only cookies from client side
  };