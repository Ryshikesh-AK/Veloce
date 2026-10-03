export const tabForPath = (path) => {
  if (path === '/wishlist') return 'My wishlist';
  if (path === '/compare') return 'Compare cars';
  if (path === '/admin') return 'Admin workspace';
  return 'Discover';
};

export const getPathForNavItem = (item) => {
  if (item.startsWith('/admin')) return item;
  if (item === 'My wishlist' || item === '/wishlist') return '/wishlist';
  if (item === 'Compare cars' || item === 'Compare' || item === '/compare') return '/compare';
  if (item === 'Admin workspace' || item === '/admin') return '/admin';
  return '/';
};