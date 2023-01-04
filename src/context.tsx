import { useQuery } from "@tanstack/react-query";

export const getList = (count: number) => {
  return useQuery({
    queryKey: ["listItems", count],
    queryFn: () => {
      console.log("executing tthiosss");
      return Promise.resolve(
        Array(count)
          .fill("A")
          .map((n, i) => ({ name: `${n}-${i + 1}` }))
      );
    },
  });
};
