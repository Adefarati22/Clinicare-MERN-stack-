import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./contextStore/AuthProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Toaster position="top-center" richColors={true} />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
