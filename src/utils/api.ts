
// Simulated API to fetch user data
const generateMockUsers = (count: number) => {
  const roles = ["admin", "user", "editor"];
  const statuses = ["active", "inactive", "pending"];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = index + 1;
    const name = `User ${id}`;
    const email = `user${id}@example.com`;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id,
      name,
      email,
      role,
      status,
    };
  });
};

// Bug 13: Unpredictable random data can cause issues
export const fetchUsers = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  // Return random number of users between 50-150
  return generateMockUsers(Math.floor(Math.random() * 100) + 50);
};
