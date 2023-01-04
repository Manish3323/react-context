import { CircularProgress, IconButton } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import MaterialTable from "material-table";
import { useState } from "react";
import "./App.css";
import { getList } from "./context";
import { DeleteOutline } from "@material-ui/icons";

const defaultMaterialTheme = createTheme();

const DemoComponent = ({ count }: { count: number }) => {
  return <span>{count}</span>;
  // const result = count && getList(count)
  // return result ? <span>{result.data?.length}</span> : <></>
};

const IncrementCount = ({
  setCount,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const incrementItem = useMutation({
    mutationKey: ["incrementitem"],
    mutationFn: async () => setCount((prev) => prev + 1),
  });
  return <button onClick={() => incrementItem.mutateAsync()}>+</button>;
};

const Table = ({
  count,
  setCount,
}: {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => {

  const [loading, setLoading] = useState("")
  const { data, isLoading } = getList(count);

  const r = async () => {
    setCount((prev) => prev - 1);
  };

  const { mutateAsync, isLoading: removingitem } = useMutation({
    mutationKey: ["removeItem"],
    mutationFn: r,
  });

  const columns = [
    {
      title: "Actions",
      render: (rowData: any) => {
        if(loading === rowData.name) {
          return <CircularProgress size={38} />
        }
        return (
          <div>
            <IconButton
              aria-label="delete"
              disabled={removingitem || isLoading || loading === rowData.name}
              onClick={async () => {
                await mutateAsync();
              }}
            >
              <DeleteOutline />
            </IconButton>
          </div>
        );
      },
    },
    { title: "Name", field: "name" },
  ];
  if (!data) return <></>;

  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MaterialTable<{ name: string }>
        title="Simple Action Preview"
        columns={columns}
        data={data}
        // actions={actions}
        isLoading={removingitem || isLoading}
      />
    </ThemeProvider>
  );
};

function App() {
  const queryClient = new QueryClient();
  const [count, setCount] = useState(0);
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <DemoComponent count={count} />
        <IncrementCount setCount={setCount} />
        <Table count={count} setCount={setCount} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
