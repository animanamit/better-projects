export function useUser() {
  //   const { data, isLoading, error } = useQuery({
  //     queryKey: ["user"],
  //     queryFn: () => getUser(),
  //   });
  const user = {
    id: 1,
    name: "Animan Amit",
    email: "amitanim@gmail.com",
    image: "https://github.com/shadcn.png",
    role: "admin",
    firstName: "Animan",
    lastName: "Amit",
  };

  return user;
}
